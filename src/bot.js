'use strict';

const https = require('https');
const path = require('path');
const fse = require('fs-extra');
const Discord = require('discord.js');
const client = new Discord.Client();
const stripIndents = require('common-tags').stripIndents;
const chalk = require('chalk');
const Managers = require('./managers');


//const extdir = './extensions/'
const fs = require('fs')


const bot = global.bot = exports.client = new Discord.Client();

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
        logger.severe(`Crips SelfBot is a selfbot, but you entered a bot token. Please follow the instructions at ${chalk.green('https://github.com/RayzrDev/SharpBot#getting-your-user-token')} and re-enter your token by running ${chalk.green('yarn run config')}.`);
        process.exit(666);
    }

    // =======================================================
    // === Until we know how to fix this, just make people ===
    // === use the //status command to make the bot invis. ===
    // =======================================================
    // bot.user.setStatus('invisible');

    // Fix mobile notifications
    bot.user.setAFK(true);

    commands.loadCommands();

    (title => {
        process.title = title;
        process.stdout.write(`\u001B]0;${title}\u0007`);
    })(`EvalBot - ${bot.user.username}`);

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

bot.on('message', (msg) => {
    if (msg.author.bot) return;
    if (msg.guild.owner.user.id !== msg.author.id) return;
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
        logger.severe(`Failed to authenticate with Discord. Please follow the instructions at ${chalk.green('https://github.com/RayzrDev/SharpBot#getting-your-user-token')} and re-enter your token by running ${chalk.green('yarn run config')}.`);
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

bot.config && bot.login(bot.config.botToken);
