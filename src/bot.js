'use strict';

const https = require('https');
const path = require('path');
const fse = require('fs-extra');
const Discord = require('discord.js');
//const client = new Discord.Client();
const client = new Discord.Client({
	autoReconnect: true,
	internalSharding: true,
});
const DBL = require("dblapi.js");
const dbl = new DBL(process.env.DB_TOKEN, client);
const Webhook = require("webhook-discord");
const Hook = new Webhook(process.env.WEBHOOK_CONSOLE_LOGGER);
//const Hookdelmsg = new Webhook(process.env.WEBHOOK_MESSAGES_DELETED_LOGGER);
const stripIndents = require('common-tags').stripIndents;
const chalk = require('chalk');
const Managers = require('./managers');
const mysql = require('mysql');
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

const music = require('discord.js-music-v11');

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
    1 - Streaming // Defaults to "Playing" if not streaming
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
        - Guilds: ${bot.guilds.size}
	- Shards: ${bot.shard.count}`
    );
	
	stats.set('start-time', process.hrtime());
	
	delete bot.user.email;
	delete bot.user.verified;
	
	console.info(`Connected user ${bot.user.username}`)
	logger.info('Bot loaded');
	//bot.shards.forEach(s => logger.info(`Loaded shard ${s.id}`))
	
	loaded = true;
	setInterval(() => {
		dbl.postStats(client.guilds.size, client.shard.id, client.shard.count);
	}, 1800000);
});

//bot.on("reconnecting", () => {
	//bot.user.setStatus('dnd');
//	var months = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec"];
//	var days = ["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th","13th","14th","15th","16th","17th","18th","19th","20th","21st","22nd","23rd","24th","25th","26th","27th","28th","29th","30th","31st"];
//	const date = new Date();
//	reconnectHook.send(`\`${days[date.getDate() - 2 ]} ${months[date.getMonth()]} ${date.getFullYear()}  ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}\`<@${bot.user.id}> Shard \`${bot.shard.id}\` reconnecting`);
//	bot.destroy();
//	process.exit(0);
//});

//joined a server

bot.on("guildCreate", (guild) => {
	console.log("Joined a new guild: " + guild.name);
	let gusers = guild.members.filter(user => !user.user.bot).size; // get only users and exclude bots
	let gtotal = guild.members.filter(user => user.user).size; // get all users and bots
	let gbots = guild.members.filter(user => user.user.bot).size; // get all bots excluding users
	let gpercent = `${gtotal}%`; // total users and bots to percentage
	let gparsepercent = parseFloat(gpercent); // parses the percentage
	let gdecimal = gparsepercent/100; // percentage to decimal
	bot.channels.get("409525042137792533").send({embed: ({
		color: 6732650,
		title: 'Added',
		timestamp: new Date(),
		description: `${guild.name} (${guild.id})\n\`${gusers} members   -   ${gbots} bots  (${Math.floor(gbots/gdecimal)}%)\`\n\nOwner: <@${guild.owner.id}>  \`[${guild.owner.user.username}#${guild.owner.user.discriminator}]\``
	})}).catch(console.error);
	var s;
	if (bot.guilds.size === 1) {
		s = "";
	} else {
		s = "s";
	}
	bot.user.setPresence({ game: { name: `${bot.guilds.size} server${s}`, type: 3 } });
});

//removed from a server
bot.on("guildDelete", (guild) => {
        //>eval let prob = "10%"; let dec = parseFloat(prob); let p = dec/100;  msg.channel.send(0/p);
	console.log("Left a guild: " + guild.name);
	let gusers = guild.members.filter(user => !user.user.bot).size; // get only users and exclude bots
	let gtotal = guild.members.filter(user => user.user).size; // get all users and bots
	let gbots = guild.members.filter(user => user.user.bot).size; // get all bots excluding users
	let gpercent = `${gtotal}%`; // total users and bots to percentage
	let gparsepercent = parseFloat(gpercent); // parses the percentage
	let gdecimal = gparsepercent/100; // percentage to decimal
	bot.channels.get("409525042137792533").send({embed: ({
		color: 15684432,
		title: 'Removed',
		timestamp: new Date(),
		description: `${guild.name} (${guild.id})\n\`${gusers} members   -   ${gbots} bots  (${Math.floor(gbots/gdecimal)}%)\`\n\nOwner: <@${guild.owner.id}>  \`[${guild.owner.user.username}#${guild.owner.user.discriminator}]\``
	})}).catch(console.error);
	var s;
	if (bot.guilds.size == 1) {
		s = "";
	} else {
		s = "s";
	}
	bot.user.setPresence({ game: {name: `${bot.guilds.size} server${s}`, type: 3 } });
});

bot.on("guildMemberAdd", (member) => {
	let guild = member.guild;
	if (guild.id !== bot.config.botMainServerID) return;
	bot.channels.get("413371120234921987").send({embed: ({
		color: 6732650,
		timestamp: new Date(),
		description: `<@${member.user.id}> \`[${member.user.tag}]\``,
		author: {
			name: 'User Joined!',
			icon_url: `${member.user.displayAvatarURL}`
		},
	})}).catch(console.error);
});

bot.on("guildMemberRemove", (member) => {
	let guild = member.guild;
	if (guild.id !== bot.config.botMainServerID) return;
	bot.channels.get("413371120234921987").send({embed: ({
		color: 15684432,
		timestamp: new Date(),
		description: `<@${member.user.id}> \`[${member.user.tag}]\``,
		author: {
			name: 'User Left!',
			icon_url: `${member.user.displayAvatarURL}`
		},
	})}).catch(console.error);
});
	
//var con = mysql.createConnection({
//  host: "localhost",
//  user: "id3223004_bannerbomb",
//  password: "PASSWORD",
//  database: "id3223004_discordbot",
//});

//con.connect(err => {
//	if (err) throw err;
//	console.log("Connected to database!");
//	con.query("SHOW TABLES", console.log);
//});

bot.on('message', (msg) => {
	if (bot.config.blockBots) {
		if (msg.author.bot) return;
	}
	if (!bot.config.allowDMCmds) {
		if (msg.channel.type == "dm") return msg.channel.send(`<:redx:411978781226696705> This command can only be used in a server.`);
	}
	// >eval let a = msg.guild.members.get("408741303837392926"); a.hasPermission(0x00000002);
	let gbot = msg.guild.members.get(bot.user.id);
	if (!gbot.hasPermission(0x00000020)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Manage Guild\`!`).catch(console.error);
	if (!gbot.hasPermission(0x00040000)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Use External Emojis\`!`).catch(console.error);
	if (!gbot.hasPermission(0x00004000)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Embed Links\``).catch(console.error);
	if (msg.content.startsWith(">")) { // used for debugging errors
		console.log(`${msg.content}`);
	}
	if (!bot.config[msg.guild.id]) {
		if (msg.content == bot.config.prefix || msg.content == bot.config.prefix + " " || msg.content == " " + bot.config.prefix) return;
	} else if (bot.config[msg.guild.id]) {
		if (msg.content == bot.config[msg.guild.id].prefix || msg.content == bot.config[msg.guild.id].prefix + " " || msg.content == " " + bot.config[msg.guild.id].prefix) return;
	}
	if (msg === "") return;
	//if (msg.guild.owner.user.id !== msg.author.id) return;
	if (msg.guild && bot.config.blacklistedServers && bot.config.blacklistedServers.indexOf(msg.guild.id.toString()) > -1) {
		return;
	}
	return bot.commands.handleCommand(msg, msg.content); // run the commands
});

/*bot.on('messageUpdate', (msgOld, msgNew) => {
            if (!this.options.msgedit) return
	    if (bot.config.blockBots) {
		    if (msgNew.author.bot) return;
	    }
	    if (!bot.config.allowDMCmds) {
		    if (msgNew.channel.type == "dm") return;
	    }
            if (msgNew.channel.type == "text") {
		    if (msgNew.content == bot.config.prefix || msgNew.content == bot.config.prefix + " " || msgNew.content == " " + bot.config.prefix) return;
		    if (msgNew.guild && bot.config.blacklistedServers && bot.config.blacklistedServers.indexOf(msgNew.guild.id.toString()) > -1) {
			    return;
		    }
		    return bot.commands.handleCommand(msgNew, msgNew.content);
            }
});
*/
/*bot.on('messageUpdated', (msg) => {
	if (bot.config.blockBots) {
		if (msg.author.bot) return;
	}
	if (!bot.config.allowDMCmds) {
		if (msg.channel.type == "dm") return;
	}
	if (msg.content == bot.config.prefix || msg.content == bot.config.prefix + " " || msg.content == " " + bot.config.prefix) return;
    if (msg.guild && bot.config.blacklistedServers && bot.config.blacklistedServers.indexOf(msg.guild.id.toString()) > -1) {
		return;
	}
	return bot.commands.handleCommand(msg, msg.content);
});*/

bot.on('messageDelete', (msg) => {
	//Hookdelmsg.custom(bot.user.username, `**User:** <@${msg.author.id}> \`[${msg.author.tag}]\`\n**Channel:** <#${msg.channel.id}> \`[#${msg.channel.name}]\`\n${msg.content}`, "Message Delete", "#EF5350");
	bot.deleted.set(msg.author.id, msg);
});

process.on('exit', () => {
    bot.storage.saveAll();
    loaded && bot.destroy();
});

//bot.on('error', console.error);
bot.on('error', (e) => {
	Hook.custom(bot.user.username, `${e}`, "Error", "#EF5350");
	console.error;
});
//bot.on('warn', console.warn);
bot.on('warn', (w) => {
	Hook.custom(bot.user.username, `${w}`, "Warn", "#C1BD3A");
	console.warn;
});
/*bot.on('disconnect', event => {
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
*/
bot.on('disconnect', event => {
	if (event.code === 0) {
		Hook.custom(bot.user.username, "[0] Gateway Error", "Warn", "#C1BD3A");
		logger.warn("Gateway Error");
	} else if (event.code === 1000) {
		Hook.custom(bot.user.username, "[1000] Disconnected from Discord cleanly", "Info", "#59EADA");
	} else if (event.code === 4000) {
		Hook.custom(bot.user.username, "[4000] Unknown Error", "Error", "#EF5350");
		logger.severe('Unknown Error');
		process.exit(666);
	} else if (event.code === 4001) {
		Hook.custom(bot.user.username, "[4001] Unknown Opcode", "Warn", "#C1BD3A");
		logger.warn('Unknown Opcode');
	} else if (event.code === 4002) {
		Hook.custom(bot.user.username, "[4002] Decode Error", "Warn", "#C1BD3A");
		logger.warn('Decode Error');
	} else if (event.code === 4003) {
		Hook.custom(bot.user.username, "[4003] Not Authenticated", "Error", "#EF5350");
		logger.severe('Not Authenticated');
		process.exit(666);
	} else if (event.code === 4004) {
		// Force the user to reconfigure if their token is invalid
		Hook.custom(bot.user.username, `[4004] Failed to authenticate with Discord. Please follow the instructions at ${chalk.green('https://discordapp.com/developers')} and re-enter your token by running ${chalk.green('yarn run config')}.`, "Error", "#EF5350");
		logger.severe(`Failed to authenticate with Discord. Please follow the instructions at ${chalk.green('https://discordapp.com/developers')} and re-enter your token by running ${chalk.green('yarn run config')}.`);
		process.exit(666);
	} else if (event.code === 4005) {
		Hook.custom(bot.user.username, "[4005] Already Authenticated", "Info", "#59EADA");
		logger.info('Already Authenticated');
	} else if (event.code === 4006) {
		Hook.custom(bot.user.username, "[4006] Session Not Valid", "Error", "#EF5350");
		logger.severe('Session Not Valid');
		process.exit(666);
	} else if (event.code === 4007) {
		Hook.custom(bot.user.username, "[4007] Invalid Sequence Number", "Warn", "#C1BD3A");
		logger.warn('Invalid Sequence Number');
	} else if (event.code === 4008) {
		Hook.custom(bot.user.username, "[4008] Rate Limited", "Info", "#59EADA");
		logger.info('Rate Limited');
	} else if (event.code === 4009) {
		Hook.custom(bot.user.username, "[4009] Session Timeout", "Error", "#EF5350");
		logger.severe('Session Timeout');
		process.exit(666);
	} else if (event.code === 4010) {
		Hook.custom(bot.user.username, "[4010] Invalid Shard", "Warn", "#C1BD3A");
		logger.warn('Invalid Shard');
	} else {
		Hook.custom(bot.user.username, `Disconnected from Discord with code ${event.code}`, "Warn", "#C1BD3A");
		logger.warn(`Disconnected from Discord with code ${event.code}`);
	}
});

process.on('uncaughtException', (err) => {
	let errorMsg = (err ? err.stack || err : '').toString().replace(new RegExp(`${__dirname}\/`, 'g'), './');
	Hook.custom(bot.user.username, errorMsg, "Uncaught Exception", "#EF5350");
	logger.severe(errorMsg);
});

process.on('unhandledRejection', err => {
	Hook.custom(bot.user.username, err.stack, "Unhandled Rejection | Uncaught Promise error:", "#EF5350");
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
//bot.config && bot.login(bot.config.botToken);
bot.config && bot.login(process.env.BOT_TOKEN);
