'use strict';

const https = require('https');
const path = require('path');
const fse = require('fs-extra');
const Discord = require('discord.js');
const client = new Discord.Client();
const reconnectHook = new Discord.WebhookClient("409525362381553665", "qiPJaiOgZLHrH8FHNQhcaaTzMcIAIBqxhig0p0HUMuynIbmFhCkQU1-yy8m3IVrQp5lc");
const stripIndents = require('common-tags').stripIndents;
const chalk = require('chalk');
const Managers = require('./managers');
const music = require('discord.js-music-v11');


//const extdir = './extensions/'
const fs = require('fs');


const bot = global.bot = exports.client = new Discord.Client();

let guildArray = bot.guilds.array();

bot.managers = {};

const logger = bot.logger = new Managers.Logger(bot);
logger.inject();

bot.managers.dynamicImports = global.dynamicImports = new Managers.DynamicImports(bot, __dirname);
bot.managers.dynamicImports.init();

const configManager = bot.managers.config = new Managers.Config(bot, __dirname, bot.managers.dynamicImports);

bot.config = global.config = configManager.load();

const pluginManager = bot.plugins = bot.managers.pluginManager = new Managers.Plugins(bot);
pluginManager.loadPlugins();

bot.storage = new Managers.Storage();

bot.managers.notifications = new Managers.Notifications(bot);

const commands = bot.commands = new Managers.CommandManager(bot);
const stats = bot.managers.stats = new Managers.Stats(bot);

bot.deleted = new Discord.Collection();

bot.setInterval(() => {
    bot.deleted.clear();
}, 7200000);

const settings = global.settings = {
    dataFolder: path.resolve(__dirname, '..', 'data'),
    configsFolder: path.resolve(__dirname, '..', 'data', 'configs')
};

if (!fse.existsSync(settings.dataFolder)) fse.mkdirSync(settings.dataFolder);
if (!fse.existsSync(settings.configsFolder)) fse.mkdirSync(settings.configsFolder);

Managers.Migrator.migrate(bot, __dirname);

let loaded = false;

bot.utils = global.utils = require('./utils');

bot.on('ready', () => {
	if (!bot.user.bot) {
		logger.severe(`${bot.user.username} is a bot, but you entered a selfbot token. Please follow the instructions at ${chalk.green('https://discordapp.com/developers')} and re-enter your token by running ${chalk.green('yarn run config')}.`);
		process.exit(666);
	}

    // =======================================================
    // === Until we know how to fix this, just make people ===
    // === use the //status command to make the bot invis. ===
    // =======================================================
    // bot.user.setStatus('invisible');
    //bot.user.setPresence({ game: { name: `${bot.config.prefix}help for commands`, type: 0 } }); // last presence [playing]
    var s;
    if (bot.guilds.size === 1) {
        s = "";
    } else {
        s = "s";
    }
    bot.user.setPresence({ game: { name: `${bot.guilds.size} server${s}`, type: 3 } });
    /*
    0 - Playing
    1 - Playing
    2 - Listening to
    3 - Watching
    */
    // Fix mobile notifications
    bot.user.setAFK(true);

    commands.loadCommands();

    (title => {
        process.title = title;
        process.stdout.write(`\u001B]0;${title}\u0007`);
    })(`${bot.user.username}`);

    logger.info(stripIndents`Stats:
        - User: ${bot.user.username}#${bot.user.discriminator} <ID: ${bot.user.id}>
        - Users: ${bot.users.filter(user => !user.bot).size}
        - Bots: ${bot.users.filter(user => user.bot).size}
        - Channels: ${bot.channels.size}
        - Guilds: ${bot.guilds.size}`
    );

    stats.set('start-time', process.hrtime());

    delete bot.user.email;
    delete bot.user.verified;
	
	console.info(`Connected user ${bot.user.username}`)
    logger.info('Bot loaded');

    loaded = true;
});

bot.on("reconnecting", () => {
	//bot.user.setStatus('dnd');
	var months = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec"];
	var days = ["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th","13th","14th","15th","16th","17th","18th","19th","20th","21st","22nd","23rd","24th","25th","26th","27th","28th","29th","30th","31st"];
	const date = new Date();
	reconnectHook.send(`\`${days[date.getDate() - 2 ]} ${months[date.getMonth()} ${date.getFullYear()}  ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}\`<@${bot.user.id}> Shard \`${bot.shard.id}\` reconnecting`);
	bot.destroy();
	process.exit(0);
});

//joined a server
bot.on("guildCreate", (guild) => {
	console.log("Joined a new guild: " + guild.name);
	var s;
	if (bot.guilds.size == 1) {
		s = "";
	} else {
		s = "s";
	}
	bot.user.setPresence({ game: { name: `${bot.guilds.size} server${s}`, type: 3 } });
});

//removed from a server
bot.on("guildDelete", (guild) => {
	console.log("Left a guild: " + guild.name);
	var s;
	if (bot.guilds.size == 1) {
		s = "";
	} else {
		s = "s";
	}
	bot.user.setPresence({ game: {name: `${bot.guilds.size} server${s}`, type: 3 } });
});

bot.on('message', (msg) => {
	if (bot.config.blockBots) {
		if (msg.author.bot) return;
	}
	if (!bot.config.allowDMCmds) {
		if (msg.channel.type == "dm") return;
	}
	if (msg.content == bot.config.prefix || msg.content == bot.config.prefix + " " || msg.content == " " + bot.config.prefix) return;
	//if (msg.guild.owner.user.id !== msg.author.id) return;
	if (msg.guild && bot.config.blacklistedServers && bot.config.blacklistedServers.indexOf(msg.guild.id.toString()) > -1) {
		return;
	}
	return bot.commands.handleCommand(msg, msg.content);
});

bot.on('messageDelete', (msg) => {
    bot.deleted.set(msg.author.id, msg);
});

process.on('exit', () => {
    bot.storage.saveAll();
    loaded && bot.destroy();
});

bot.on('error', console.error);
bot.on('warn', console.warn);
bot.on('disconnect', event => {
    if (event.code === 1000) {
        logger.info('Disconnected from Discord cleanly');
    } else if (event.code === 4004) {
        // Force the user to reconfigure if their token is invalid
        logger.severe(`Failed to authenticate with Discord. Please follow the instructions at ${chalk.green('https://discordapp.com/developers')} and re-enter your token by running ${chalk.green('yarn run config')}.`);
        process.exit(666);
    } else {
        logger.warn(`Disconnected from Discord with code ${event.code}`);
    }
});

process.on('uncaughtException', (err) => {
    let errorMsg = (err ? err.stack || err : '').toString().replace(new RegExp(`${__dirname}\/`, 'g'), './');
    logger.severe(errorMsg);
});

process.on('unhandledRejection', err => {
    logger.severe('Uncaught Promise error: \n' + err.stack);
});

music(bot, {
	// https://github.com/nexu-dev/discord.js-music/blob/master/README.md
	prefix: bot.config.prefix, // The prefix to use for the commands.
	global: false, // Wether to use a global queue instead of a server-specific queue.
	maxQueueSize: 100, // Maximum queue size.
	anyoneCanSkip: true, // Allow anybody to skip the song. If false then only admins and the user that requested the song can skip it.
	volume: 100, // The default volume of the player.
	clearInvoker: false // Clear the command message.
	//channel: 'music' // Name of the channel to join, If omitted, will instead join user's voice channel.
});
bot.config && bot.login(bot.config.botToken);
