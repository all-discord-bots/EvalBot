'use strict';

const debug = false;
const https = require('https');
const path = require('path');
const fse = require('fs-extra');
const Discord = require('discord.js');
const client = new Discord.Client({
	autoReconnect: true,
	internalSharding: false,
});
let startTime = new Date(); // start recording time of boot
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
const Music = require('discord.js-musicbot-addon');
const snekfetch = require('snekfetch');
require('./conf/globals.js'); // load global variables file
const { Client } = require('pg');

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

// bot.shard.broadcastEval('bot.guilds.size').then(results => {
bot.setInterval(() => {
	dbl.postStats(bot.guilds.size, bot.shard.id, bot.shard.count); // Current shard data
	//dbl.postStats(results.toString()); // Upload server count per shard
	console.log('Uploaded Bot Stats!');
}, 1800000);
// });

const settings = global.settings = {
	dataFolder: path.resolve(__dirname, '..', 'data'),
	configsFolder: path.resolve(__dirname, '..', 'data', 'configs')
};

if (!fse.existsSync(settings.dataFolder)) fse.mkdirSync(settings.dataFolder);
if (!fse.existsSync(settings.configsFolder)) fse.mkdirSync(settings.configsFolder);

Managers.Migrator.migrate(bot, __dirname);

let loaded = false;

bot.utils = global.utils = require('./utils');

bot.once('ready', () => {
	if (!bot.user.bot) {
		logger.severe(`${bot.user.username} is a bot, but you entered a selfbot token. Please follow the instructions at ${chalk.green('https://discordapp.com/developers')} and re-enter your token by running ${chalk.green('yarn run config')}.`);
		process.exit(666);
	}

	// =======================================================
	// === Until we know how to fix this, just make people ===
	// === use the //status command to make the bot invis. ===
	// =======================================================
	// bot.user.setStatus('invisible');
	let s;
	if (bot.guilds.size === 1) {
		s = '';
	} else {
		s = 's';
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

	logger.info(stripIndents `Stats:
		- User: ${bot.user.tag} <ID: ${bot.user.id}>
		- Users: ${bot.users.filter(user => !user.bot).size}
		- Bots: ${bot.users.filter(user => user.bot).size}
		- Channels: ${bot.channels.size}
		- Guilds: ${bot.guilds.size}
		- Shards: ${bot.shard.count}`);

	stats.set('start-time', process.hrtime());

	delete bot.user.email;
	delete bot.user.verified;

	console.info(`Connected user ${bot.user.username}`);
	logger.info('Bot loaded');
	loaded = true;

	//setInterval(() => {
	//	snekfetch.post(`https://discordbots.org/api/bots/${bot.user.id}/stats`)
	//		.set('Authorization', process.env.DB_TOKEN)
	//		.send({ server_count: bot.guilds.size })
	//		.send({ shards: bot.shard.id })
	//		.send({ shard_count: bot.shard.count })
	//		.then(() => console.log('Updated discordbots.org stats.'))
	//		.catch(err => console.error(`Whoops something went wrong with updating DBL stats: ${err}`));
	//}, 1800000);
	//setInterval(() => {
	//	snekfetch.post(`https://ls.terminal.ink/api/v1/bots/${bot.user.id}`)
	//		.set('Authorization', process.env.TERMINAL_TOKEN)
	//		.send({ server_count: bot.guilds.size })
	//		.send({ shards: bot.shard.id })
	//		.send({ shard_count: bot.shard.count })
	//		.then(() => console.log('Updated Terminal stats.'))
	//		.catch(err => console.error(`Whoops something went wrong with updating Terminal stats: ${err}`)); 
	//}, 1800000);
	let readyTime = new Date(); // start recording ready time
	bot.channels.get("409508147850379264").send({
		embed: ({
			color: 6732650,
			title: 'Ready',
			timestamp: new Date(),
			description: `Ready in: \`${parseInt(readyTime - startTime)}ms\``
		})
	}).catch(console.error);
	// begin database connection
/*	const dbclient = new Client({
		connectionString: process.env.DATABASE_URL,
		ssl: true,
	});
	dbclient.connect();
	dbclient.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
		if (err) throw err;
		for (let row of res.rows) {
			console.log(JSON.stringify(row));
		}
		dbclient.end();
	});*/
});

bot.once("guildUnavailable", (guild) => {
	if (guild.id !== bot.config.botMainServerID) return;
	bot.users.filter(user => user.id === bot.config.botCreatorID).forEach(user => user.sendMessage(`<@${bot.config.botCreatorID}> \`${guild.name} [${guild.id}]\` is currently unavailable!`));
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
	console.log(`Joined a new guild: ${guild.name}`);
	let gusers = guild.members.filter(user => !user.user.bot).size; // get only users and exclude bots
	let gtotal = guild.members.filter(user => user.user).size; // get all users and bots
	let gbots = guild.members.filter(user => user.user.bot).size; // get all bots excluding users
	let gpercent = `${gtotal}%`; // total users and bots to percentage
	let gparsepercent = parseFloat(gpercent); // parses the percentage
	let gdecimal = gparsepercent / 100; // percentage to decimal
	bot.channels.get("409525042137792533").send({
		embed: ({
			color: 6732650,
			title: 'Added',
			timestamp: new Date(),
			description: `${guild.name} (${guild.id})\n\`${gusers} members   -   ${gbots} bots  (${Math.floor(gbots/gdecimal)}%)\`\n\nOwner: <@${guild.owner.id}>  \`[${guild.owner.user.username}#${guild.owner.user.discriminator}]\``
		})
	}).catch(console.error);
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
	console.log("Left a guild: " + guild.name);
	let gusers = guild.members.filter(user => !user.user.bot).size; // get only users and exclude bots
	let gtotal = guild.members.filter(user => user.user).size; // get all users and bots
	let gbots = guild.members.filter(user => user.user.bot).size; // get all bots excluding users
	let gpercent = `${gtotal}%`; // total users and bots to percentage
	let gparsepercent = parseFloat(gpercent); // parses the percentage
	let gdecimal = gparsepercent / 100; // percentage to decimal
	bot.channels.get("409525042137792533").send({
		embed: ({
			color: 15684432,
			title: 'Removed',
			timestamp: new Date(),
			description: `${guild.name} (${guild.id})\n\`${gusers} members   -   ${gbots} bots  (${Math.floor(gbots/gdecimal)}%)\`\n\nOwner: <@${guild.owner.id}>  \`[${guild.owner.user.username}#${guild.owner.user.discriminator}]\``
		})
	}).catch(console.error);
	var s;
	if (bot.guilds.size == 1) {
		s = "";
	} else {
		s = "s";
	}
	bot.user.setPresence({ game: { name: `${bot.guilds.size} server${s}`, type: 3 } });
});

bot.on("guildMemberAdd", (member) => {
	let guild = member.guild;
	if (guild.id !== bot.config.botMainServerID) return;
	bot.channels.get("413371120234921987").send({
		embed: ({
			color: 6732650,
			timestamp: new Date(),
			description: `<@${member.user.id}> \`[${member.user.tag}]\``,
			author: {
				name: 'User Joined!',
				icon_url: `${member.user.displayAvatarURL}`
			},
		})
	}).catch(console.error);
});

bot.on("guildMemberRemove", (member) => {
	let guild = member.guild;
	if (guild.id !== bot.config.botMainServerID) return;
	bot.channels.get("413371120234921987").send({
		embed: ({
			color: 15684432,
			timestamp: new Date(),
			description: `<@${member.user.id}> \`[${member.user.tag}]\``,
			author: {
				name: 'User Left!',
				icon_url: `${member.user.displayAvatarURL}`
			},
		})
	}).catch(console.error);
});

bot.on("message", (msg) => {
	if (msg.content === "") return;
	if (bot.config.blockBots) {
		if (msg.author.bot) return;
	}
	if (!bot.config.allowDMCmds) {
		let mg = msg.content.toLowerCase().split(' ');
		//if (mg.length > bot.config.prefix.length && mg[0].toString() !== `${bot.config.prefix}whitelist` && msg.channel.type == "dm") return msg.channel.send(`<:redx:411978781226696705> This command can only be used in a server.`).catch(console.error);
		if (mg.length > bot.config.prefix.length && mg[0].toString().startsWith(bot.config.prefix) && msg.channel.type == "dm") return msg.channel.send(`<:redx:411978781226696705> This command can only be used in a server.`).catch(console.error);
	}
	// Load the music queue items
	if (msg.channel.type !== "dm") {
		if (musicqueue[msg.guild.id] === undefined) musicqueue[msg.guild.id] = [];
		if (musicqueue[msg.guild.id]['music'] === undefined) musicqueue[msg.guild.id]['music'] = [];
		if (musicqueue[msg.guild.id]['loopqueue'] === undefined) musicqueue[msg.guild.id]['loopqueue'] = false;
		if (musicqueue[msg.guild.id]['loopsong'] === undefined) musicqueue[msg.guild.id]['loopsong'] = false;
		if (musicqueue[msg.guild.id]['streaming'] === undefined) musicqueue[msg.guild.id]['streaming'] = false;
		if (musicqueue[msg.guild.id]['shuffle'] === undefined) musicqueue[msg.guild.id]['shuffle'] = false;
		if (songqueue[msg.guild.id] === undefined) songqueue[msg.guild.id] = [];
		// End loading the music queue items
		let gmsg = msg.content.toLowerCase().split(' ');
		if (msg.guild.id === bot.config.botMainServerID && gmsg[0] === "xd" && gmsg.length === 1) {
			msg.delete().then(msg => {
				msg.channel.send(`<:blobDerp:413114089225846785>`);
			}).catch(console.error);
		}
		let gbot = msg.guild.members.get(bot.user.id);
		let hascmd;
		let splitmsg = msg.content.split(' ');
		let joinmsg = splitmsg.join(' ');
		if (!bot.config[msg.guild.id]) {
			hascmd = bot.commands.all().map(n => bot.config.prefix + n.info.name).filter(n => n === splitmsg[0]).length;
			if (msg.content == bot.config.prefix || msg.content == bot.config.prefix + " " || msg.content == " " + bot.config.prefix) return;
			if (msg.content.startsWith(bot.config.prefix) && hascmd > 0) {
				// BEGIN DEBUGGING MESSAGES LOG FOR ERRORS
				if (msg.channel.id !== "345551930459684866" && !msg.author.bot) {
					bot.channels.get("415682448794451998").send({
						embed: ({
							color: 15684432,
							timestamp: new Date(),
							description: `${joinmsg}`,
							author: {
								name: `${msg.author.tag} - ${msg.author.id} | ${msg.guild.name} - ${msg.guild.id}`,
							},
						})
					}).catch(console.error);
				}
				// END DEBUGGING MESSAGES LOG FOR ERRORS
				if (!gbot.hasPermission(0x00040000)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Use External Emojis\`!`).catch(console.error);
				if (!gbot.hasPermission(0x00004000)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Embed Links\``).catch(console.error);
			}
		} else if (bot.config[msg.guild.id]) {
			hascmd = bot.commands.all().map(n => bot.config[msg.guild.id].prefix + n.info.name).filter(n => n === splitmsg[0]).length;
			if (msg.content == bot.config[msg.guild.id].prefix || msg.content == bot.config[msg.guild.id].prefix + " " || msg.content == " " + bot.config[msg.guild.id].prefix) return;
			if (msg.content.startsWith(bot.config[msg.guild.id].prefix) && hascmd > 0) {
				// BEGIN DEBUGGING MESSAGES LOG FOR ERRORS
				if (msg.channel.id !== "345551930459684866" && !msg.author.bot) {
					bot.channels.get("415682448794451998").send({
						embed: ({
							color: 15684432,
							timestamp: new Date(),
							description: `${joinmsg}`,
							author: {
								name: `${msg.author.tag} - ${msg.author.id} | ${msg.guild.name} - ${msg.guild.id}`,
							},
						})
					}).catch(console.error);
				}
				// END DEBUGGING MESSAGES LOG FOR ERRORS
				if (!gbot.hasPermission(0x00040000)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Use External Emojis\`!`).catch(console.error);
				if (!gbot.hasPermission(0x00004000)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Embed Links\`!`).catch(console.error);
			}
		}
		if (msg.guild && bot.config.blacklistedServers && bot.config.blacklistedServers.indexOf(msg.guild.id.toString()) > -1) {
			return;
		}
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

bot.on('error', (e) => {
	bot.channels.get("415265475895754752").send({
		embed: ({
			color: 15684432,
			timestamp: new Date(),
			title: `Error`,
			description: `${e}`
		})
	});
	console.error;
});
bot.on('warn', (w) => {
	bot.channels.get("415265475895754752").send({
		embed: ({
			color: 12696890,
			timestamp: new Date(),
			title: `Warn`,
			description: `${w}`
		})
	});
	console.warn;
});

if (debug) {
	bot.on('debug', (d) => {
		console.info(d);
	});
}

bot.on('disconnect', event => {
	if (event.code === 0) {
		logger.warn("Gateway Error");
		Hook.custom(bot.user.username, "[0] Gateway Error", "Warn", "#C1BD3A");
	} else if (event.code === 1000) {
		Hook.custom(bot.user.username, "[1000] Disconnected from Discord cleanly", "Info", "#59EADA");
	} else if (event.code === 4000) {
		logger.warn('Unknown Error');
		Hook.custom(bot.user.username, "[4000] Unknown Error", "Warn", "#C1BD3A");
	} else if (event.code === 4001) {
		logger.warn('Unknown Opcode');
		Hook.custom(bot.user.username, "[4001] Unknown Opcode", "Warn", "#C1BD3A");
	} else if (event.code === 4002) {
		logger.warn('Decode Error');
		Hook.custom(bot.user.username, "[4002] Decode Error", "Warn", "#C1BD3A");
	} else if (event.code === 4003) {
		logger.severe('Not Authenticated');
		Hook.custom(bot.user.username, "[4003] Not Authenticated", "Error", "#EF5350");
		process.exit(666);
	} else if (event.code === 4004) {
		// Force the user to reconfigure if their token is invalid
		logger.severe(`Failed to authenticate with Discord. Please follow the instructions at ${chalk.green('https://discordapp.com/developers')} and re-enter your token by running ${chalk.green('yarn run config')}.`);
		Hook.custom(bot.user.username, `[4004] Failed to authenticate with Discord. Please follow the instructions at ${chalk.green('https://discordapp.com/developers')} and re-enter your token by running ${chalk.green('yarn run config')}.`, "Error", "#EF5350");
		process.exit(666);
	} else if (event.code === 4005) {
		logger.info('Already Authenticated');
		Hook.custom(bot.user.username, "[4005] Already Authenticated", "Info", "#59EADA");
	} else if (event.code === 4006) {
		logger.severe('Session Not Valid');
		Hook.custom(bot.user.username, "[4006] Session Not Valid", "Error", "#EF5350");
		process.exit(666);
	} else if (event.code === 4007) {
		logger.warn('Invalid Sequence Number');
		Hook.custom(bot.user.username, "[4007] Invalid Sequence Number", "Warn", "#C1BD3A");
	} else if (event.code === 4008) {
		logger.info('Rate Limited');
		Hook.custom(bot.user.username, "[4008] Rate Limited", "Info", "#59EADA");
	} else if (event.code === 4009) {
		logger.severe('Session Timeout');
		Hook.custom(bot.user.username, "[4009] Session Timeout", "Error", "#EF5350");
		process.exit(666);
	} else if (event.code === 4010) {
		logger.warn('Invalid Shard');
		Hook.custom(bot.user.username, "[4010] Invalid Shard", "Warn", "#C1BD3A");
	} else {
		logger.warn(`Disconnected from Discord with code ${event.code}`);
		Hook.custom(bot.user.username, `Disconnected from Discord with code ${event.code}`, "Warn", "#C1BD3A");
	}
});

/*function consoleLoggerMsg(type, title, name, message, stack) {
	let col;
	if (type === "w") {
		col = 12696890;
	} else if (type === "e") {
		col = 15684432;
	}
	// description: `{stack}`
	bot.channels.get("415265475895754752").send({embed: ({
		color: col,
		timestamp: new Date(),
		title: `${title.toString()}`,
		author: {
			name: `Console Logger`
		}, fields: [
			{
				name: `__**Error Name**__`,
				value: name.toString() || `\`N/A\``
			}, {
				name: `__**Error Message**__`,
				value: message.toString() || `\`N/A\``
			}, {
				name: `__**Stack Trace**__`,
				value: stack.toString() || `\`N/A\``
			}
		],
	})});
	console.log("Console log successfully sent!");
}
*/

process.on('uncaughtException', (err) => {
	let errorMsg = (err ? err.stack || err : '').toString().replace(new RegExp(`${__dirname}\/`, 'g'), './');
	//	consoleLoggerMsg("e","Uncaught Exception",`${err.name}`,`${err.message}`,`${errorMsg}`);
	//console.error(`Uncaught Exception:\n${errorMsg}`);
	//Hook.custom(bot.user.username, `${errorMsg}`, "Uncaught Exception", "#EF5350");
	bot.channels.get("415265475895754752").send({
		embed: ({
			color: 15684432,
			timestamp: new Date(),
			title: `Uncaught Exception`,
			description: `${errorMsg}`
		})
	}); //.catch(console.error);
	logger.severe(errorMsg);
});

//process.on('warning', (wrn) => {
//consoleLoggerMsg("w", "Warning",`${wrn.name}`, `${wrn.message}`, `${wrn.stack}`);
//console.warn(`Warning:\n${wrn.stack}`);
//console.warn(warning.name);    // Print the warning name
//console.warn(warning.message); // Print the warning message
//console.warn(warning.stack);   // Print the stack trace
//});

process.on('unhandledRejection', (err) => {
	bot.channels.get("415265475895754752").send({
		embed: ({
			color: 15684432,
			timestamp: new Date(),
			title: `Unhandled Rejection | Uncaught Promise error:`,
			description: `${err.stack}`
		})
	});
	logger.severe(`Uncaught Promise error:\n${err.stack}`);
}); // `${err.name} - Unhandled Rejection`,

bot.config && bot.login(process.env.BOT_TOKEN, (error, token) => {
	// handle error and success
	if (error) throw error;
	if (token) console.log(token.toString());
});
