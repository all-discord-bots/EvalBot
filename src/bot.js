'use strict';

const fse = require('fs-extra');
const { Client, Collection } = require('discord.js');
const stripIndents = require('common-tags').stripIndents;
const chalk = require('chalk');
const Managers = require('./managers');
const DBL = require("dblapi.js");
const Webhook = require("webhook-discord");
const Hook = new Webhook(process.env.WEBHOOK_CONSOLE_LOGGER);
require('./conf/globals.js'); // load global variables file

class CripsBot extends Client {
	constructor(config = {}) {
		super();
		
		// Make the client
		const client = new Client({
			autoReconnect: true,
			internalSharding: false,
		});
		
		let startTime = new Date(); // start recording time of boot
		
		const dbl = new DBL(process.env.DB_TOKEN, client);
		
		global.bot = this;
		
		// Settings
		const settings = global.settings;
		
		if (!fse.existsSync(settings.dataFolder)) fse.mkdirpSync(settings.dataFolder);
		if (!fse.existsSync(settings.configsFolder)) fse.mkdirpSync(settings.configsFolder);
		
		// Managers
		this.managers = {};
		
		// Logger
		const logger = this.logger = new Managers.Logger(this);
		logger.inject();
		
		// Dynamic imports
		this.managers.dynamicImports = new Managers.DynamicImports(this, __dirname);
		this.managers.dynamicImports.init();
		
		// Config
		this.managers.config = new Managers.Config(this, __dirname, this.managers.dynamicImports, config);
		this.config = global.config = this.managers.config.load();
		
		// Prevent any further loading if we're prompting them.
		if (!this.config) return;

		 // Plugins
		this.plugins = this.managers.pluginManager = new Managers.Plugins(this);
		this.plugins.loadPlugins();
		
		// Storage
		this.storage = new Managers.Storage();
		
		// Notifications
		this.managers.notifications = new Managers.Notifications(this);
		
		// Commands
		const commands = this.commands = new Managers.CommandManager(this);
		
		// Stats
		const stats = this.managers.stats = new Managers.Stats(this);
		
		Managers.Migrator.migrate(this);
		
		// Deleted message record handler
		this.deleted = new Collection();
		this.setInterval(() => {
			this.deleted.clear();
		}, 7200000);
		
		// Discord Bot List Stats Upload
		this.setInterval(() => {
			dbl.postStats(this.guilds.size);//, this.shard.id, this.shard.count); // Current shard data
			//dbl.postStats(results.toString()); // Upload server count per shard
			console.log('Uploaded Bot Stats!');
		}, 1800000);
		
		// Uncategorized
		this.loaded = false;
		this.shuttingDown = false;
		this.utils = global.utils = require('./utils');
		
		// Event listeners
		this.on ('ready', () => {
			if (!this.user.bot) {
				logger.severe(`${this.user.username} is a bot, but you entered a user token. Please follow the instructions at ${chalk.green('https://discordapp.com/developers')} and re-enter your token by running ${chalk.green('yarn run config')}.`);
				return this.shutdown(false);
			}
			
			let s;
			if (this.guilds.size === 1) {
				s = '';
			} else {
				s = 's';
			}
			this.user.setPresence({ game: { name: `${this.guilds.size} server${s}`, type: 3 } });
			
			// Fix mobile notifications
			this.user.setAFK(true);
			
			commands.loadCommands();
			
			(title => {
				process.title = title;
				process.stdout.write(`\u001B]0;${title}\u0007`);
			})(`CripsBot - ${this.user.username}`);
			
			logger.info(stripIndents `Stats:
			- User: ${this.user.tag} <ID: ${this.user.id}>
			- Users: ${this.users.filter(user => !user.bot).size}
			- Bots: ${this.users.filter(user => user.bot).size}
			- Channels: ${this.channels.size}
			- Guilds: ${this.guilds.size}`); // - Shards: ${this.shard.count}
			
			stats.set('start-time', process.hrtime());
			
			delete this.user.email;
			delete this.user.verified;
			
			console.info(`Connected user ${this.user.username}`);
			logger.info('Bot loaded');
			
			this.loaded = true;
			
			let readyTime = new Date(); // start recording ready time
			this.channels.get("409508147850379264").send({
				embed: ({
					color: 6732650,
					title: 'Ready',
					timestamp: new Date(),
					description: `Ready in: \`${parseInt(readyTime - startTime)}ms\``
				})
			}).catch(err => console.error);
		});
		
		this.on('message', (msg) => {
			if (msg.author.bot) return;
			if (msg.content === "") return;
			let gmsg = msg.content.toLowerCase().split(' ');
			
			if ((gmsg.length > this.config.prefix.length || gmsg.length > `<@${this.user.id}>`.length || gmsg.length > `<@!${this.user.id}>`.length) && (gmsg[0].toString().startsWith(this.config.prefix) || gmsg[0].toString().startsWith(`<@${this.user.id}>`) || gmsg[0].toString().startsWith(`<@!${this.user.id}>`)) && msg.channel.type === "dm") return msg.channel.send(`<:redx:411978781226696705> This command can only be used in a server.`).catch(err => console.error);
			
			// Create Music Queue
			try {
				if (musicqueue[msg.guild.id] === undefined)
				{
					musicqueue[msg.guild.id] = {
						music: [],
						loopqueue: false,
						loopsong: false,
						streaming: false,
						shuffle: false
					}
				}
				if (songqueue[msg.guild.id] === undefined)
				{
					songqueue[msg.guild.id] = []
				}
			} catch (err) {
				this.channels.get("415265475895754752").send({
					embed: ({
						color: 15684432,
						timestamp: new Date(),
						title: `${err.toString()}`,
						description: `\`\`\`\n${err.stack}\n\`\`\``
					})
				}).catch(err => console.error);
			}
			
			// NO 'XD' messages
			if (msg.guild.id === this.config.botMainServerID && gmsg[0] === "xd" && gmsg.length === 1) {
				msg.delete().then(msg => {
					msg.channel.send(`<:blobDerp:413114089225846785>`);
				}).catch(err => console.error);
			}
			
			let gbot = msg.guild.members.get(this.user.id);
			let hascmd;
			let splitmsg = msg.content.split(' ');
			let joinmsg = splitmsg.join(' ');
			if (!this.config[msg.guild.id]) {
				hascmd = this.commands.all().map(n => this.config.prefix + n.info.name).filter(n => n === splitmsg[0]).length;
				if (!msg.content.startsWith(`<@${this.user.id}>`) && !msg.content.startsWith(`<@!${this.user.id}>`))
				{
					if (msg.content === this.config.prefix || msg.content.replace(new RegExp(`[^${this.config.prefix}]+.+`,'gi'),'') !== this.config.prefix) return;
				}
				//if (msg.content == this.config.prefix || msg.content == this.config.prefix + " " || msg.content == " " + this.config.prefix) return;
				if ((msg.content.startsWith(this.config.prefix) || msg.content.startsWith(`<@${this.user.id}>`) || msg.content.startsWith(`<@!${this.user.id}>`)) && hascmd > 0) {
					//if (msg.channel.type === "dm") return msg.channel.send(`<:redx:411978781226696705> This command can only be used in a server.`).catch(err => console.error);
					// Begin debugging messages log for errors
					if (msg.channel.id !== "345551930459684866") {
						this.channels.get("415682448794451998").send({
							embed: ({
								color: 15684432,
								timestamp: new Date(),
								description: `${joinmsg}`,
								author: {
									name: `${msg.author.tag} - ${msg.author.id} | ${msg.guild.name} - ${msg.guild.id}`,
								},
							})
						}).catch(err => console.error);
					}
					if (!gbot.hasPermission(0x00040000)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Use External Emojis\`!`).catch(err => console.error);
					if (!gbot.hasPermission(0x00004000)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Embed Links\`!`).catch(err => console.error);
				}
			} else if (this.config[msg.guild.id]) {
				hascmd = this.commands.all().map(n => this.config[msg.guild.id].prefix + n.info.name).filter(n => n === splitmsg[0]).length;
				//if (msg.content == this.config[msg.guild.id].prefix || msg.content == this.config[msg.guild.id].prefix + " " || msg.content == " " + this.config[msg.guild.id].prefix) return;
				if (!msg.content.startsWith(`<@${this.user.id}>`) && !msg.content.startsWith(`<@!${this.user.id}>`))
				{
					if (msg.content === this.config[msg.guild.id].prefix || msg.content.replace(new RegExp(`[^${this.config[msg.guild.id].prefix}]+.+`,'gi'),'') !== this.config[msg.guild.id].prefix) return;
				}
				if ((msg.content.startsWith(this.config[msg.guild.id].prefix) || msg.content.startsWith(`<@${this.user.id}>`) || msg.content.startsWith(`<@!${this.user.id}>`)) && hascmd > 0) {
					//if (msg.channel.type === "dm") return msg.channel.send(`<:redx:411978781226696705> This command can only be used in a server.`).catch(err => console.error);
					// Begin debugging messages log for errors
					if (msg.channel.id !== "345551930459684866") {
						this.channels.get("415682448794451998").send({
							embed: ({
								color: 15684432,
								timestamp: new Date(),
								description: `${joinmsg}`,
								author: {
									name: `${msg.author.tag} - ${msg.author.id} | ${msg.guild.name} - ${msg.guild.id}`,
								},
							})
						}).catch(err => console.error);
					}
					if (!gbot.hasPermission(0x00040000)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Use External Emojis\`!`).catch(err => console.error);
					if (!gbot.hasPermission(0x00004000)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Embed Links\`!`).catch(err => console.error);
				}
			}
			stats.increment(`messages-${this.user.id === msg.author.id ? 'sent' : 'received'}`);
			//if (msg.isMentioned(this.user)) {
			//	stats.increment('mentions');
			//	console.log(`[MENTION] ${msg.author.username} | ${msg.guild ? msg.guild.name : '(DM)'} | #${msg.channel.name || 'N/A'}:\n${msg.cleanContent}`);
			//}
			
			if (msg.guild && this.config.blacklistedServers && this.config.blacklistedServers.indexOf(msg.guild.id.toString()) > -1) {
				return;
			}
			return this.commands.handleCommand(msg, msg.content);
		});
		
		this.on('messageDelete', (msg) => {
			//Hookdelmsg.custom(this.user.username, `**User:** <@${msg.author.id}> \`[${msg.author.tag}]\`\n**Channel:** <#${msg.channel.id}> \`[#${msg.channel.name}]\`\n${msg.content}`, "Message Delete", "#EF5350");
			this.deleted.set(msg.author.id, msg);
		});
		
		this.once("guildUnavailable", (guild) => {
			if (guild.id !== this.config.botMainServerID) return;
			this.users.filter(user => user.id === this.config.botCreatorID).forEach(user => user.sendMessage(`<@${this.config.botCreatorID}> \`${guild.name} [${guild.id}]\` is currently unavailable!`));
		});
		
		// Joined a server
		this.on("guildCreate", (guild) => {
			console.log(`Joined a new guild: ${guild.name}`);
			let gusers = guild.members.filter(user => !user.user.bot).size; // get only users and exclude bots
			let gtotal = guild.members.filter(user => user.user).size; // get all users and bots
			let gbots = guild.members.filter(user => user.user.bot).size; // get all bots excluding users
			let gpercent = `${gtotal}%`; // total users and bots to percentage
			let gparsepercent = parseFloat(gpercent); // parses the percentage
			let gdecimal = gparsepercent / 100; // percentage to decimal
			this.channels.get("409525042137792533").send({
				embed: ({
					color: 6732650,
					title: 'Added',
					timestamp: new Date(),
					description: `${guild.name} (${guild.id})\n\`${gusers} members   -   ${gbots} bots  (${Math.floor(gbots/gdecimal)}%)\`\n\nOwner: <@${guild.owner.id}>  \`[${guild.owner.user.username}#${guild.owner.user.discriminator}]\``
				})
			}).catch(err => console.error);
			let s;
			if (this.guilds.size === 1) {
				s = "";
			} else {
				s = "s";
			}
			this.user.setPresence({ game: { name: `${this.guilds.size} server${s}`, type: 3 } });
		});
		
		// Removed from a server
		this.on("guildDelete", (guild) => {
			console.log(`Left a guild: ${guild.name}`);
			let gusers = guild.members.filter(user => !user.user.bot).size; // get only users and exclude bots
			let gtotal = guild.members.filter(user => user.user).size; // get all users and bots
			let gbots = guild.members.filter(user => user.user.bot).size; // get all bots excluding users
			let gpercent = `${gtotal}%`; // total users and bots to percentage
			let gparsepercent = parseFloat(gpercent); // parses the percentage
			let gdecimal = gparsepercent / 100; // percentage to decimal
			this.channels.get("409525042137792533").send({
				embed: ({
					color: 15684432,
					title: 'Removed',
					timestamp: new Date(),
					description: `${guild.name} (${guild.id})\n\`${gusers} members   -   ${gbots} bots  (${Math.floor(gbots/gdecimal)}%)\`\n\nOwner: <@${guild.owner.id}>  \`[${guild.owner.user.username}#${guild.owner.user.discriminator}]\``
				})
			}).catch(err => console.error);
			let s;
			if (this.guilds.size == 1) {
				s = "";
			} else {
				s = "s";
			}
			this.user.setPresence({ game: { name: `${this.guilds.size} server${s}`, type: 3 } });
		});
		
		this.on("guildMemberAdd", (member) => {
			let guild = member.guild;
			if (guild.id !== this.config.botMainServerID) return;
			this.channels.get("413371120234921987").send({
				embed: ({
					color: 6732650,
					timestamp: new Date(),
					description: `<@${member.user.id}> \`[${member.user.tag}]\``,
					author: {
						name: 'User Joined!',
						icon_url: `${member.user.displayAvatarURL}`
					},
				})
			}).catch(err => console.error);
		});
		
		this.on("guildMemberRemove", (member) => {
			let guild = member.guild;
			if (guild.id !== this.config.botMainServerID) return;
			this.channels.get("413371120234921987").send({
				embed: ({
					color: 15684432,
					timestamp: new Date(),
					description: `<@${member.user.id}> \`[${member.user.tag}]\``,
					author: {
						name: 'User Left!',
						icon_url: `${member.user.displayAvatarURL}`
					},
				})
			}).catch(err => console.error);
		});
		
		this.on('error', (e) => {
			this.channels.get("415265475895754752").send({
				embed: ({
					color: 15684432,
					timestamp: new Date(),
					title: `Error`,
					description: `${e}`
				})
			});
			console.error;
		});
		
		this.on('warn', (w) => {
			this.channels.get("415265475895754752").send({
				embed: ({
					color: 12696890,
					timestamp: new Date(),
					title: `Warn`,
					description: `${w}`
				})
			});
			console.warn;
		});
		
		this.once('disconnect', (event) => {
			if (event.code === 0) {
				this.logger.warn("Gateway Error");
				Hook.custom(this.user.username, "[0] Gateway Error", "Warn", "#C1BD3A");
			} else if (event.code === 1000) {
				this.logger.warn("Disconnected from Discord cleanly.");
				Hook.custom(this.user.username, "[1000] Disconnected from Discord cleanly", "Info", "#59EADA");
			} else if (event.code === 4000) {
				this.logger.warn('Unknown Error');
				Hook.custom(this.user.username, "[4000] Unknown Error", "Warn", "#C1BD3A");
			} else if (event.code === 4001) {
				this.logger.warn('Unknown Opcode');
				Hook.custom(this.user.username, "[4001] Unknown Opcode", "Warn", "#C1BD3A");
			} else if (event.code === 4002) {
				this.logger.warn('Decode Error');
				Hook.custom(this.user.username, "[4002] Decode Error", "Warn", "#C1BD3A");
			} else if (event.code === 4003) {
				this.logger.severe('Not Authenticated');
				Hook.custom(this.user.username, "[4003] Not Authenticated", "Error", "#EF5350");
				return this.shutdown(false);
			} else if (event.code === 4004) {
				// Force the user to reconfigure if their token is invalid
				this.logger.severe(`Failed to authenticate with Discord. Please follow the instructions at ${chalk.green('https://discordapp.com/developers')} and re-enter your token by running ${chalk.green('yarn run config')}.`);
				Hook.custom(this.user.username, `[4004] Failed to authenticate with Discord. Please follow the instructions at ${chalk.green('https://discordapp.com/developers')} and re-enter your token by running ${chalk.green('yarn run config')}.`, "Error", "#EF5350");
				return this.shutdown(false);
			} else if (event.code === 4005) {
				this.logger.info('Already Authenticated');
				Hook.custom(this.user.username, "[4005] Already Authenticated", "Info", "#59EADA");
			} else if (event.code === 4006) {
				this.logger.severe('Session Not Valid');
				Hook.custom(this.user.username, "[4006] Session Not Valid", "Error", "#EF5350");
				return this.shutdown(false);
			} else if (event.code === 4007) {
				this.logger.warn('Invalid Sequence Number');
				Hook.custom(this.user.username, "[4007] Invalid Sequence Number", "Warn", "#C1BD3A");
			} else if (event.code === 4008) {
				this.logger.info('Rate Limited');
				Hook.custom(this.user.username, "[4008] Rate Limited", "Info", "#59EADA");
			} else if (event.code === 4009) {
				this.logger.severe('Session Timeout');
				Hook.custom(this.user.username, "[4009] Session Timeout", "Error", "#EF5350");
				return this.shutdown(false);
			} else if (event.code === 4010) {
				this.logger.warn('Invalid Shard');
				Hook.custom(this.user.username, "[4010] Invalid Shard", "Warn", "#C1BD3A");
			} else {
				this.logger.warn(`Disconnected from Discord with code ${event.code}`);
				Hook.custom(this.user.username, `Disconnected from Discord with code ${event.code}`, "Warn", "#C1BD3A");
			}
			
			this.shutdown();
		});
		
		// Process handlers
		process.on('exit', (code) => {
			console.log(`Exited with exit code ${code}`);
			this.shutdown();
		});
		
		process.on('uncaughtException', (err) => {
			let errorMsg = (err ? err.stack || err : '').toString().replace(new RegExp(`${__dirname}\/`, 'g'), './');
			this.channels.get("415265475895754752").send({
				embed: ({
					color: 15684432,
					timestamp: new Date(),
					title: `Uncaught Exception`,
					description: `${errorMsg}`
				})
			}); //.catch(err => console.error);
			this.logger.severe(errorMsg);
		});
		
		process.on('unhandledRejection', (err) => {
			this.channels.get("415265475895754752").send({
				embed: ({
					color: 15684432,
					timestamp: new Date(),
					title: `Unhandled Rejection | Uncaught Promise error:`,
					description: `${err.stack}`
				})
			});
			this.logger.severe(`Uncaught Promise error:\n${err.stack}`);
		}); // `${err.name} - Unhandled Rejection`,
	}
	
	start() {
		if (!this.config) return false;
		
		this.login(process.env.BOT_TOKEN, (error, token) => {
			if (error) throw error;
			if (token) console.log(token.toString());
		});
		
		return true;
	}
	
	async shutdown(restart = true) {
		if (this.shuttingDown) return;
		this.shuttingDown = true;
		this.logger.uninject();
		
		if (this.loaded) {
			this.storage.saveAll();
			await this.destroy();
		}
		
		this.emit('cripsbot-shutdown', restart);
	}
}

module.exports = CripsBot;
