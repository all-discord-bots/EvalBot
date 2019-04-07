'use strict';

const fse = require('fs-extra');
const fetch = require('node-fetch');
const path = require('path');
const { Client, Collection } = require('discord.js');
const stripIndents = require('common-tags').stripIndents;
const chalk = require('chalk');
const Managers = require('./managers');
const DBL = require('dblapi.js');
const axios = require('axios');
const { Webhook } = require("webhook-discord");
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
		
		//const dbl = new DBL(process.env.DBL_TOKEN_AUTH, client);
		const dbl = new DBL(process.env.DBL_TOKEN_AUTH, { webhookPort: 5000, webhookAuth: process.env.DBL_WEBHOOK_AUTH });
		
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
		
		// Uploads bot stats to api's
		/*this.setInterval(() => {
			dbl.postStats(this.guilds.size);//, this.shard.id, this.shard.count); // Current shard data
			//dbl.postStats(results.toString()); // Upload server count per shard
			console.log('Uploaded Bot Stats!');
		}, 1800000);*/
		
		/*
		const Discord = require("discord.js");
		const client = new Discord.Client();
		const DBL = require("dblapi.js");
		const dbl = new DBL('Your discordbots.org token', client);
		
		// Optional events
		dbl.on('posted', () => {
			console.log('Server count posted!');
		})
		
		dbl.on('error', e => {
			console.log(`Oops! ${e}`);
		})
		*/
		
		dbl.webhook.on('ready', (hook) => {
			try {
				console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
			} catch (err) {
				console.error(err.toString());
			}
		});
		
		dbl.webhook.on('vote', (vote) => {
			try {
				console.log(`User with ID ${vote.user} just voted!`);
				this.channels.get("415255346710577162").send({
					embed: {
						color: 5892826,
						timestamp: new Date(),
						title: `User Upvoted!`,
						author: {
							name: `${this.users.get(vote.user).tag}`,
							icon_url: `${this.users.get(vote.user).displayAvatarURL()}`
						},
						fields: [
							{
								name: `Tag:`,
								value: `\`${this.users.get(vote.user).username}\``
							}, {
								name: `Username:`,
								value: `\`${this.users.get(vote.user).username}\``
							}, {
								name: `ID:`,
								value: `\`${vote.user}\``
							}
						]
					}
				});
			} catch (err) {
				console.error(err.toString());
			}
		});
		
		dbl.on('error', (err) => {
			let errorMsg = (err ? err.stack || err : '').toString().replace(new RegExp(`${__dirname}\/`, 'g'), './');
			console.log(`Oops! ${errorMsg}`);
			this.channels.get("415265475895754752").send({
				embed: {
					color: 15684432,
					timestamp: new Date(),
					title: `Uncaught Exception`,
					description: `\`\`\`\n${errorMsg}\n\`\`\``,
					fields: [
						{
							name: `Error Name:`,
							value: `\`${err.name || "N/A"}\``
						}, {
							name: `Error Message:`,
							value: `\`${err.message || "N/A"}\``
						}
					]
				}
			});
		})
		
		async function postDiscordStats(bot) {
			try {
				const discordBots = axios({
					method: 'post',
					url: `https://discordbots.org/api/bots/${bot.user.id}/stats`,
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `${process.env.DBL_TOKEN_AUTH}`
					},
					data: {
						server_count: bot.utils.client_information('guild_size'), // Type: Numbers or Array of numbers, The amount of servers the bot is in. If an array it acts like `shards`
						shards: bot.utils.client_information('guilds_per_shard'), // Type: Array of numbers, The amount of servers the bot is in per shard.
						shard_id: bot.shard.id, // Type: Number, The zero-indexed id of the shard posting. Makes server_count set the shard specific server count.
						shard_count: bot.shard.count // Type: Number, The amount of shards the bot has.
					}
				}).then(() => {
					console.log("Uploaded bot stats to discordbots.org!");
				}).catch(console.error);
				
				const discordBotList = axios({
					method: 'post',
					url: `https://discordbotlist.com/api/bots/${bot.user.id}/stats`,
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bot ${process.env.DBL_TOKEN}`
					},
					data: {
						shard_id: bot.shard.id,
						guilds: bot.utils.client_information('guild_size'),
						users: bot.utils.client_information('user_size'),
						voice_connections: bot.utils.client_information('voice_connections')
					}
				}).then(() => {
					console.log("Uploaded bot stats to discordbotlist.com!");
				}).catch(console.error);
				
				const botsForDiscord = axios({
					method: 'post',
					url: `https://botsfordiscord.com/api/bot/${bot.user.id}`,
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `${process.env.B4D_TOKEN}`
					},
					data: {
						server_count: bot.utils.client_information('guild_size')
					}
				}).then(() => {
					console.log("Uploaded bot stats to botsfordiscord.com!");
				}).catch(console.error);
				
				const discordsBestBots = axios({
					method: 'post',
					url: `https://discordsbestbots.xyz/api/bots/${bot.user.id}`,
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `${process.env.DBB_TOKEN}`
					},
					data: {
						guilds: bot.guilds.size,//bot.utils.client_information('guild_size'),
						shards: bot.shard.count
					}
				}).then(() => {
					console.log("Uploaded bot stats to discordsbestbots.xyz!");
				}).catch(console.error);
				/*
				const discordPw = axios({
					method: 'post',
					url: `https://bots.discord.pw/api/bots/${this.user.id}/stats`,
					headers: {
						Authorization: ''
					},
					data: {
						server_count: this.guilds.size
					}
				})*/
				const botlistSpace = axios({
					method: 'post',
					url: `https://botlist.space/api/bots/${bot.user.id}`,
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `${process.env.BOTLIST_SPACE_TOKEN_AUTH}`
					},
					data: {
						server_count: bot.utils.client_information('guild_size'),
						shards: bot.utils.client_information('guilds_per_shard') // - server count per shard
					}
				}).then(() => {
					console.log("Uploaded bot stats to botlist.space!");
				}).catch(console.error);
				/*const discordServices = axios({
					method: 'post',
					url: `https://discord.services/api/bots/${this.user.id}`,
					headers: {
						Authorization: ''
					},
					data: {
						server_count: this.guilds.size
					}
				})
				const listCord = axios({
					method: 'post',
					url: `https://listcord.com/api/bot/${this.user.id}/guilds`,
					headers: {
						Authorization: ''
					},
					data: {
						guilds: this.guilds.size
					}
				})
				const [dbres, dpwres, bspaceres, dservres, listres] = await Promise.all([discordBots, discordPw, botlistSpace, discordServices, listCord])
				console.log(dbres.res, dpwres.res, bspaceres.res, dservres.res, listres.res)
				*/
				const [discordbots, discordbotlist, botsfordiscord, botlistspace, discordsbestbots] = await Promise.all([discordBots, discordBotList, botsForDiscord, botlistSpace, discordsBestBots]);
				///console.log(dbres.toString());
			} catch (err) {
				console.error(err.stack ? err.stack : err.toString());
			}
		}
		
		this.setInterval(() => {
			try {
				postDiscordStats(this);
			} catch (err) {
				console.error(err.stack ? err.stack : err.toString());
			}
		}, 1800000);
		
		// Uncategorized
		this.loaded = false;
		this.shuttingDown = false;
		this.utils = global.utils = require('./utils');
		this.shards = global.shards = this.utils.shards;
		
		// Event listeners
		this.on('ready', () => {
			if (!this.user.bot) {
				logger.severe(`${this.user.tag} is a bot, but you entered a user token. Please follow the instructions at ${chalk.green('https://discordapp.com/developers')} and re-enter your token by running ${chalk.green('yarn run config')}.`);
				return this.shutdown(false);
			}
			
			/*let s = 's';
			if (this.guilds.size === 1) {
				s = '';
			}
			this.user.setPresence({ activity: { name: `${this.guilds.size} server${s}`, type: 3 }, status: 'online' }).then(() => {//(presence) => {
				console.log(`Successfully updated the bots presence.`); // ${presence.activity.name}
			}).catch((err) => {
				console.error(err.toString());
			});*/
			
			// Fix mobile notifications
			this.user.setAFK(true);
			
			commands.loadCommands();
			
			(title => {
				process.title = title;
				process.stdout.write(`\u001B]0;${title}\u0007`);
			})(`CripsBot - ${this.user.username}`);
			
			logger.info(stripIndents `Stats:
			- User: ${this.user.tag} <ID: ${this.user.id}>
			- Users: ${this.users.filter((user) => !user.bot).size.toLocaleString()}
			- Bots: ${this.users.filter((user) => user.bot).size.toLocaleString()}
			- Channels: ${this.channels.size.toLocaleString()}
			- Guilds: ${this.guilds.size.toLocaleString()}
			- Shards: ${this.shard.count || "undefined"}`
			);
			
			stats.set('start-time', process.hrtime());
			
			delete this.user.email;
			delete this.user.verified;
			
			console.info(`Connected user ${this.user.tag}`);
			logger.info('Bot loaded');
			
			this.loaded = true;
			
			if (this.loaded)
			{
				// Download config
				const merge = function() {
					let destination = {},
					sources = [].slice.call(arguments, 0);
					sources.forEach(function(source) {
						let prop;
						for (prop in source) {
							if (prop in destination && Array.isArray(destination[prop])) {
								// Concat Arrays
								destination[prop] = destination[prop].concat(source[prop]);
							} else if (prop in destination && typeof(destination[prop]) === "object") {
								// Merge Objects
								destination[prop] = merge(destination[prop], source[prop]);
							} else {
								// Set new values
								destination[prop] = source[prop];
							}
						}
					});
					return destination;
				};
				
				try {
					fetch('http://cripsbot.000webhostapp.com/database/read_json.php')
						.then((res) => res.json())
						.then((json) => fse.writeJsonSync(path.resolve(__dirname, '../data/configs/config.json'), merge(this.config,json))) //JSON.stringify(merge(this.config,json))))
						.catch((err) => console.error(err.toString()));
				} catch (err) {
					return console.error(err.toString());
				}
				this.storage.saveAll();
				console.log("Successfully set and saved the custom configuration data.");
			}
			
			let s = 's';
			if (this.guilds.size === 1) {
				s = '';
			}
			this.user.setPresence({ activity: { name: `${this.guilds.size.toLocaleString()} server${s}`, type: 3 }, status: 'online' }).then(() => {//(presence) => {
				console.log(`Successfully updated the bots presence.`); // ${presence.activity.name}
			}).catch((err) => {
				console.error(err.toString());
			});
			
			let readyTime = new Date(); // start recording ready time
			this.channels.get("409508147850379264").send({
				embed: {
					color: 6732650,
					title: 'Ready',
					timestamp: new Date(),
					description: `Ready in: \`${parseInt(readyTime - startTime)}ms\``
				}
			}).catch((err) => console.error);
		});
		
		this.on('message', (msg) => {
			if (msg.author.bot) return;
			if (msg.content === "") return;
			let gmsg = msg.content.toLowerCase().split(' ');
			/*if (msg.channel.type === "dm") {
				if (this.config.prefix === undefined)
				{
					if ((msg.content.length > 0 && gmsg[0].toString().startsWith(this.config.prefix)) || (msg.content.length > `<@${this.user.id}>`.length && gmsg[0].toString().startsWith(`<@${this.user.id}>`)) || (msg.content.length > `<@!${this.user.id}>`.length && gmsg[0].toString().startsWith(`<@!${this.user.id}>`))) return msg.channel.send(`<:redx:411978781226696705> This command can only be used in a server.`).catch(err => console.error);
				}
				else
				{
					if ((msg.content.length > this.config.prefix.length && gmsg[0].toString().startsWith(this.config.prefix)) || (msg.content.length > `<@${this.user.id}>`.length && gmsg[0].toString().startsWith(`<@${this.user.id}>`)) || (msg.content.length > `<@!${this.user.id}>`.length && gmsg[0].toString().startsWith(`<@!${this.user.id}>`))) return msg.channel.send(`<:redx:411978781226696705> This command can only be used in a server.`).catch(err => console.error);
				}
				return;
			}*/
			if (msg.channel.type !== 'dm')
			{
				// Create Music Queue
				try {
					if (music_items[msg.guild.id] === undefined)
					{
						music_items[msg.guild.id] = {
							queue: [],
							volume: 100,
							loop: false,
							repeat: false,
							is_streaming: false,
							stream_mode: 0,
							shuffle: false,
							queue_position: 0,
							playback_duration: ''
						}
					}
					if (songqueue[msg.guild.id] === undefined)
					{
						songqueue[msg.guild.id] = [];
					}
				} catch (err) {
					this.channels.get("415265475895754752").send({
						embed: {
							color: 15684432,
							timestamp: new Date(),
							title: `${err.toString()}`,
							description: `\`\`\`\n${err.stack ? err.stack : err.toString()}\n\`\`\``
						}
					}).catch(console.error);
				}
				
				// NO 'XD' messages
				if (msg.guild.id === this.config.botMainServerID && gmsg[0] === "xd" && gmsg.length === 1) {
					msg.delete().then((message) => {
						message.channel.send(`<:blobDerp:413114089225846785>`);
					}).catch((err) => {
						console.error(err.toString());
					});
				}
			}
			/*
			let gbot = msg.guild.members.get(this.user.id);
			let hascmd;
			let splitmsg = msg.content.split(' ');
			let joinmsg = splitmsg.join(' ');
			if (!this.config[msg.guild.id.toString()]) {
				hascmd = this.commands.all().map(n => this.config.prefix + n.info.name).filter(n => n === splitmsg[0]).length;
				if (!msg.content.startsWith(`<@${this.user.id}>`) && !msg.content.startsWith(`<@!${this.user.id}>`))
				{ // msg.content === this.config.prefix || 
					if (msg.content.replace(new RegExp(`[^${this.config.prefix}]+.+`,'gi'),'') !== this.config.prefix) return;
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
			} else if (this.config[msg.guild.id.toString()]) {
				hascmd = this.commands.all().map(n => this.config[msg.guild.id.toString()].prefix + n.info.name).filter(n => n === splitmsg[0]).length;
				//if (msg.content == this.config[msg.guild.id.toString()].prefix || msg.content == this.config[msg.guild.id.toString()].prefix + " " || msg.content == " " + this.config[msg.guild.id.toString()].prefix) return;
				if (!msg.content.startsWith(`<@${this.user.id}>`) && !msg.content.startsWith(`<@!${this.user.id}>`))
				{
					// msg.content.length === this.config[msg.guild.id.toString()].prefix || 
					if (msg.content.replace(new RegExp(`[^${this.config[msg.guild.id.toString()].prefix}]+.+`,'gi'),'') !== this.config[msg.guild.id.toString()].prefix) return;
				}
				if ((msg.content.startsWith(this.config[msg.guild.id.toString()].prefix) || msg.content.startsWith(`<@${this.user.id}>`) || msg.content.startsWith(`<@!${this.user.id}>`)) && hascmd > 0) {
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
			}*/
			stats.increment(`messages-${this.user.id === msg.author.id ? 'sent' : 'received'}`);
			//if (msg.isMentioned(this.user)) {
			//	stats.increment('mentions');
			//	console.log(`[MENTION] ${msg.author.username} | ${msg.guild ? msg.guild.name : '(DM)'} | #${msg.channel.name || 'N/A'}:\n${msg.cleanContent}`);
			//}
			// this.config.blacklistedServers.indexOf(msg.guild.id.toString()) > -1
			if (msg.guild && this.config.blacklistedServers && this.config.blacklistedServers.includes(msg.guild.id)) return;
			return this.commands.handleCommand(msg, msg.content);
		});
		
		this.on('messageUpdate', (oldMessage,newMessage) => {
			if (newMessage.author.bot) return;
			if (newMessage.content === "") return;
			let gmsg = newMessage.content.toLowerCase().split(' ');
			if (newMessage.channel.type !== 'dm') {
				try {
					if (music_items[newMessage.guild.id] === undefined)
					{
						music_items[newMessage.guild.id] = {
							queue: [],
							volume: 100,
							loop: false,
							repeat: false,
							is_streaming: false,
							stream_mode: 0,
							shuffle: false,
							queue_position: 0,
							playback_duration: ''
						}
					}
					if (songqueue[newMessage.guild.id] === undefined)
					{
						songqueue[newMessage.guild.id] = [];
					}
				} catch (err) {
					this.channels.get('415265475895754752').send({
						embed: {
							color: 15684432,
							timestamp: new Date(),
							title: `${err.toString()}`,
							description: `\`\`\`\n${err.stack ? err.stack : err.toString()}\n\`\`\``
						}
					}).catch((err) => {
						console.error(err.toString());
					});
				}
				if (newMessage.guild.id === this.config.botMainServerID && gmsg[0] === "xd" && gmsg.length === 1) {
					newMessage.delete().then((msg) => {
						msg.channel.send('<:blobDerp:413114089225846785>');
					}).catch((err) => {
						console.error(err.toString());
					});
				}
			}
			// this.config.blacklistedServers.indexOf(newMessage.guild.id.toString()) > -1
			if (newMessage.guild && this.config.blacklistedServers && this.config.blacklistedServers.includes(newMessage.guild.id)) return;
			return this.commands.handleCommand(newMessage, newMessage.content);
		});
		
		this.on('messageDelete', (msg) => {
			//Hookdelmsg.custom(this.user.username, `**User:** <@${msg.author.id}> \`[${msg.author.tag}]\`\n**Channel:** <#${msg.channel.id}> \`[#${msg.channel.name}]\`\n${msg.content}`, "Message Delete", "#EF5350");
			this.deleted.set(msg.author.id, msg);
		});
		
		this.once('guildUnavailable', (guild) => {
			if (guild.id !== this.config.botMainServerID) return;
			this.users.get(`${process.env.bot_owner}`).send(`<@${process.env.bot_owner}> \`${guild.name} [${guild.id}]\` is currently unavailable!`);
		});
		
		// Joined a server
		this.on('guildCreate', (guild) => {
			console.log(`Joined a new guild: ${guild.name}`);
			const gusers = guild.members.filter((user) => !user.user.bot).size; // get only users and exclude bots
			const gbots = guild.members.filter((user) => user.user.bot).size; // get all bots excluding users
			this.channels.get("409525042137792533").send({
				embed: {
					color: 6732650,
					title: 'Added',
					timestamp: new Date(),
					description: `${guild} (${guild.id})\n\`${gusers} members   -   ${gbots} bots  (${Math.floor((gbots/guild.memberCount)*100)}%)\`\n\nOwner: ${guild.owner}  \`[${guild.owner.user.tag}]\``
				}
			}).catch((err) => console.error(err.toString()));
			let s = 's';
			if (this.guilds.size == 1) {
				s = '';
			}
			this.user.setPresence({ activity: { name: `${this.guilds.size.toLocaleString()} server${s}`, type: 3 }, status: 'online' }).then(() => {//(presence) => {
				console.log(`Successfully updated the bots presence.`); // ${presence.activity.name}
			}).catch(console.error);
		});
		
		// Removed from a server
		this.on('guildDelete', (guild) => {
			console.log(`Left a guild: ${guild.name}`);
			const gusers = guild.members.filter((user) => !user.user.bot).size; // get only users and exclude bots
			const gbots = guild.members.filter((user) => user.user.bot).size - 1; // get all bots excluding users
			this.channels.get("409525042137792533").send({
				embed: {
					color: 15684432,
					title: 'Removed',
					timestamp: new Date(),
					description: `${guild} (${guild.id})\n\`${gusers} members   -   ${gbots} bots  (${Math.floor((gbots/guild.memberCount)*100)}%)\`\n\nOwner: ${guild.owner}  \`[${guild.owner.user.username}#${guild.owner.user.discriminator}]\``
				}
			}).catch((err) => console.error(err.toString()));
			let s = 's';
			if (this.guilds.size === 1) {
				s = '';
			}
			this.user.setPresence({ activity: { name: `${this.guilds.size.toLocaleString()} server${s}`, type: 3 }, status: 'online' }).then(() => {//(presence) => {
				console.log(`Successfully updated the bots presence.`); // ${presence.activity.name}
			}).catch(console.error);
		});
		
		this.on('guildMemberAdd', (member) => {
			if (member.guild.id !== this.config.botMainServerID) return;
			this.channels.get("413371120234921987").send({
				embed: {
					color: 6732650,
					timestamp: new Date(),
					description: `${member.user} \`[${member.user.tag}]\`\nWe now have **${member.guild.memberCount}** members`,
					author: {
						name: 'User Joined!',
						icon_url: `${member.user.displayAvatarURL()}`
					},
				}
			}).catch(console.error);
		});
		
		/*{member.mention} \`[{member.tag}]\`
		Account created **{member.created.duration}** ago
		We now have **{server.members}** members*/

		
		this.on('guildMemberRemove', (member) => {
			if (member.guild.id !== this.config.botMainServerID) return;
			this.channels.get("413371120234921987").send({
				embed: {
					color: 15684432,
					timestamp: new Date(),
					description: `${member.user} \`[${member.user.tag}]\`\nWe now have **${member.guild.memberCount}** members`,
					author: {
						name: 'User Left!',
						icon_url: `${member.user.displayAvatarURL()}`
					},
				}
			}).catch(console.error);
		});
		
		/*{member.mention} \`[{member.tag}]\`
		Joined the server **{member.joined.duration}** ago
		We now have **{server.members}** members*/
		
		this.on('error', (err) => {
			console.error(`${err}`);
			this.channels.get("415265475895754752").send({
				embed: {
					color: 15684432,
					timestamp: new Date(),
					title: `Error`,
					description: `\`${JSON.stringify(err)}\`` //description: `\`${err}\``
				}
			});
		});
		
		this.on('warn', (warning) => {
			console.warn(`${warning}`);
			this.channels.get("415265475895754752").send({
				embed: {
					color: 12696890,
					timestamp: new Date(),
					title: `Warn`,
					description: `\`${warning}\``
				}
			});
		});
		
		this.once('disconnect', (event) => {
			switch (event.code) {
				case 0:
					this.logger.severe("Gateway Error");
						this.channels.get("415265475895754752").send({
						embed: {
							color: 15684432,
							timestamp: new Date(),
							title: `Error`,
							description: `\`[${event.code}] Gateway Error\``
						}
					});
					break;
				case 1000:
					this.logger.info("Disconnected from Discord cleanly.");
					this.channels.get("415265475895754752").send({
						embed: {
							color: 5892826,
							timestamp: new Date(),
							title: `Info`,
							description: `\`[${event.code}] Disconnected from Discord cleanly.\``
						}
					});
					break;
				case 4000:
					this.logger.warn('Unknown Error');
					this.channels.get("415265475895754752").send({
						embed: {
							color: 12696890,
							timestamp: new Date(),
							title: `Warn`,
							description: `\`[${event.code}] Unknown Error\``
						}
					});
					break;
				case 4001:
					this.logger.warn('Unknown Opcode');
					this.channels.get("415265475895754752").send({
						embed: {
							color: 12696890,
							timestamp: new Date(),
							title: `Warn`,
							description: `\`[${event.code}] Unknown Opcode\``
						}
					});
					break;
				case 4002:
					this.logger.warn('Decode Error');
					this.channels.get("415265475895754752").send({
						embed: {
							color: 12696890,
							timestamp: new Date(),
							title: `Warn`,
							description: `\`[${event.code}] Decode Error\``
						}
					});
					break;
				case 4003:
					this.logger.severe('Not Authenticated');
					this.channels.get("415265475895754752").send({
						embed: {
							color: 15684432,
							timestamp: new Date(),
							title: `Error`,
							description: `\`[${event.code}] Not Authenticated\``
						}
					});
					return this.shutdown(false);
				case 4004:
					this.logger.severe(`Failed to authenticate with Discord. Please follow the instructions at ${chalk.green('https://discordapp.com/developers')} and re-enter your token by running ${chalk.green('yarn run config')}.`);
					this.channels.get("415265475895754752").send({
						embed: {
							color: 15684432,
							timestamp: new Date(),
							title: `Error`,
							description: `\`[${event.code}] Failed to authenticate with Discord. Please follow the instructions at ${chalk.green('https://discordapp.com/developers')} and re-enter your token by running ${chalk.green('yarn run config')}.\``
						}
					});
					return this.shutdown(false);
				case 4005:
					this.logger.info('Already Authenticated');
					this.channels.get("415265475895754752").send({
						embed: {
							color: 5892826,
							timestamp: new Date(),
							title: `Info`,
							description: `\`[${event.code}] Already Authenticated\``
						}
					});
					break;
				case 4006:
					this.logger.severe('Session Not Valid');
					this.channels.get("415265475895754752").send({
						embed: {
							color: 15684432,
							timestamp: new Date(),
							title: `Error`,
							description: `\`[${event.code}] Session Not Valid\``
						}
					});
					return this.shutdown(false);
				case 4007:
					this.logger.warn('Invalid Sequence Number');
					this.channels.get("415265475895754752").send({
						embed: {
							color: 12696890,
							timestamp: new Date(),
							title: `Warn`,
							description: `\`[${event.code}] Invalid Sequence Number\``
						}
					});
					break;
				case 4008:
					this.logger.info('Rate Limited');
					this.channels.get("415265475895754752").send({
						embed: {
							color: 5892826,
							timestamp: new Date(),
							title: `Info`,
							description: `\`[${event.code}] Rate Limited\``
						}
					});
					break;
				case 4009:
					this.logger.severe('Session Timeout');
					this.channels.get("415265475895754752").send({
						embed: {
							color: 15684432,
							timestamp: new Date(),
							title: `Error`,
							description: `\`[${event.code}] Session Timeout\``
						}
					});
					return this.shutdown(false);
				case 4010:
					this.logger.warn('Invalid Shard');
					this.channels.get("415265475895754752").send({
						embed: {
							color: 15684432,
							timestamp: new Date(),
							title: `Warn`,
							description: `\`[${event.code}] Invalid Shard\``
						}
					});
					break;
				case 4011:
					this.logger.severe('Sharding is required');
					this.channels.get("415265475895754752").send({
						embed: {
							color: 15684432,
							timestamp: new Date(),
							title: `Error`,
							description: `\`[${event.code}] Sharding is required!\``
						}
					});
					return this.shutdown(false);
				default:
					this.logger.warn(`Disconnected from Discord with code ${event.code}`);
					this.channels.get("415265475895754752").send({
						embed: {
							color: 12696890,
							timestamp: new Date(),
							title: `Warn`,
							description: `\`Disconnected from Discord with code ${event.code}\``
						}
					});
					break;
			}
			this.shutdown();
		});
		
		// Process handlers
		process.on('warning',(warning) => {
			this.channels.get("415265475895754752").send({
				embed: {
					color: 12696890,
					timestamp: new Date(),
					title: `Process Warning`,
					description: `\`\`\`\n${warning.stack || "N/A"}\n\`\`\``,
					fields: [
						{
							name: `Warning:`,
							value: `\`${warning.toString() || "N/A"}\``
						}, {
							name: `Warning Name:`,
							value: `\`${warning.name || "N/A"}\``
						}, {
							name: `Warning Message:`,
							value: `\`${warning.message || "N/A"}\``
						}
					]
				}
			});
		});
		
		process.on('exit',(code) => {
			this.logger.info(`Process exited with exit code ${code}`);
			this.channels.get("415265475895754752").send({
				embed: {
					color: 12696890,
					timestamp: new Date(),
					title: `Process Exited`,
					description: `\`Process exited with exit code ${code}\``
				}
			});
			this.shutdown();
		});
		
		process.on('uncaughtException', (err) => {
			try {
				let errorMsg = (err ? err.stack || err : '').toString().replace(new RegExp(`${__dirname}\/`, 'g'), './');
				this.logger.severe(errorMsg);
				this.channels.get("415265475895754752").send({
					embed: {
						color: 15684432,
						timestamp: new Date(),
						title: `Uncaught Exception`,
						description: `\`\`\`\n${errorMsg}\n\`\`\``,
						fields: [
							{
								name: `Error Name:`,
								value: `\`${err.name || "N/A"}\``
							}, {
								name: `Error Message:`,
								value: `\`${err.message || "N/A"}\``
							}
						]
					}
				}).catch(console.error);
			} catch (err) {
				console.error(err.toString());
			}
		});
		
		process.on('unhandledRejection', (err) => {
			this.logger.severe(`Uncaught Promise error:\n${err.stack || err.toString()}`);
			this.channels.get("415265475895754752").send({
				embed: {
					color: 15684432,
					timestamp: new Date(),
					title: `Unhandled Rejection | Uncaught Promise error:`,
					description: `\`\`\`\n${err.stack || err.toString()}\n\`\`\``,
					fields: [
						{
							name: `Error Message:`,
							value: `\`${err.message || 'N/A'}\``
						}
					]
				}
			});
		}); // `${err.name} - Unhandled Rejection`,
	}
	
/*	process.on('unhandledRejection', (reason,err) => {
			this.channels.get("415265475895754752").send({
				embed: {
					color: 15684432,
					timestamp: new Date(),
					title: `Unhandled Rejection:`,
					description: `\`${err.stack}\``,
					fields: [
						{
							name: `Error Message:`,
							value: `\`${err.message}\``
						}, {
							name: `Error Reason:`,
							value: `\`${reason}\``
						}
					]
				}
			});
			this.logger.severe(`Uncaught Promise error:\n${err.stack}`);
		}); // `${err.name} - Unhandled Rejection`,
	}*/
	
	start() {
		if (!this.config) return false;
		
		this.login(process.env.BOT_TOKEN)
			.then(console.log)
			.catch(console.error);
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
