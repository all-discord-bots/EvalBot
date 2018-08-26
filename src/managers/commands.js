const path = require('path');
const chalk = require('chalk');
const didYouMean = require('didyoumean2');

class CommandManager {
	constructor(bot) {
		this.bot = bot;
		this._commands = [];
		this._categories = [];
	}
	
	/**
	 * Validates the constructor parameters
	 * @param {CommandoClient} client - Client to validate
	 * @param {CommandInfo} info - Info to validate
	 * @private
	 */
	_validateCommand(object) {
		if (typeof object !== 'object') return 'command setup is invalid';
		if (typeof object.run !== 'function') return 'run function is missing';
		if (typeof object.info !== 'object') return 'info object is missing';
		if (typeof object.info.name !== 'string') return 'info object is missing a valid name field';
		/*if (object.info.name !== object.info.name.toLowerCase()) return 'command name object must be lowercase'; //throw new Error('Command name must be lowercase.');
		if (typeof object.info.description !== 'string') throw new TypeError('Command description must be a string.');
		if ('format' in object.info && typeof object.info.format !== 'string') throw new TypeError('Command format must be a string.');
		if ('details' in object.info && typeof object.info.details !== 'string') throw new TypeError('Command details must be a string.');
		if(object.info.aliases && object.info.aliases.some(ali => ali !== ali.toLowerCase())) {
			throw new Error('Command aliases must be lowercase.');
		}*/
		if (object.info.examples && (!Array.isArray(object.info.examples) || object.info.examples.some(ex => typeof ex !== 'string'))) {
			return 'command examples object must be an Array of strings'; //throw new TypeError('Command examples must be an Array of strings.');
		}
		if (object.info.clientPermissions) {
			if (!Array.isArray(object.info.clientPermissions)) {
				return 'command clientPermissions object must be an Array of permission key strings'; //throw new TypeError('Command clientPermissions must be an Array of permission key strings.');
			}
			for (const perm of object.info.clientPermissions) {
				if (!this.bot.utils.permissions[perm]) return `invalid command clientPermission object: ${perm}`; //throw new RangeError(`Invalid command clientPermission: ${perm}`);
			}
		}
		if (object.info.userPermissions) {
			if (!Array.isArray(object.info.userPermissions)) {
				return 'command userPermissions object must be an Array of permission key strings.'; //throw new TypeError('Command userPermissions must be an Array of permission key strings.');
			}
			for (const perm of object.info.userPermissions) {
				if (!this.bot.utils.permissions[perm]) return `invalid command userPermission object: ${perm}`; //throw new RangeError(`Invalid command userPermission: ${perm}`);
			}
		}
		/*if (object.info.throttling) {
			if (typeof object.info.throttling !== 'object') throw new TypeError('Command throttling must be an Object.');
			if (typeof object.info.throttling.usages !== 'number' || isNaN(object.info.throttling.usages)) {
				throw new TypeError('Command throttling usages must be a number.');
			}
			if (object.info.throttling.usages < 1) throw new RangeError('Command throttling usages must be at least 1.');
			if (typeof object.info.throttling.duration !== 'number' || isNaN(object.info.throttling.duration)) {
				throw new TypeError('Command throttling duration must be a number.');
			}
			if (object.info.throttling.duration < 1) throw new RangeError('Command throttling duration must be at least 1.');
		}*/
		/*if (object.info.args && !Array.isArray(object.info.args)) throw new TypeError('Command args must be an Array.');
		if ('argsPromptLimit' in object.info && typeof object.info.argsPromptLimit !== 'number') {
			throw new TypeError('Command argsPromptLimit must be a number.');
		}
		if ('argsPromptLimit' in object.info && object.info.argsPromptLimit < 0) {
			throw new RangeError('Command argsPromptLimit must be at least 0.');
		}
		if (object.info.argsType && !['single', 'multiple'].includes(object.info.argsType)) {
			throw new RangeError('Command argsType must be one of "single" or "multiple".');
		}
		if (object.info.argsType === 'multiple' && object.info.argsCount && object.info.argsCount < 2) {
			throw new RangeError('Command argsCount must be at least 2.');
		}*/
		/*if (object.info.patterns && (!Array.isArray(object.info.patterns) || object.info.patterns.some(pat => !(pat instanceof RegExp)))) {
			throw new TypeError('Command patterns must be an Array of regular expressions.');
		}*/
		return null;
	}

	loadCommands() {
		this._commands = [];
		this._categories = [];

		const bot = this.bot;

		const commandImports = bot.managers.dynamicImports.getImport('commands');
		Object.keys(commandImports).forEach(file => {
			let command = commandImports[file];
			let name = path.basename(file);

			if (command instanceof Array) {
				command.forEach((e, i) => this._validateAndLoad(e, file, `${name}.${i}`));
			} else {
				this._validateAndLoad(command, file, name);
			}
		});
	}

	_validateAndLoad(command, file, name) {
		let error = this._validateCommand(command);

		if (error) {
			return this.bot.logger.severe(`Failed to load '${name}': ${chalk.red(error)}`);
		}

		if (!command.category) {
			// TODO: Any better way to do this?
			let base = path.join(this.bot.managers.dynamicImports.base, 'commands');

			let category = 'Uncategorized';
			if (file.indexOf(path.sep) > -1) {
				category = path.dirname(path.relative(base, file))
					.replace(new RegExp(path.sep.replace('\\', '\\\\'), 'g'), '/');
			}

			command.info.category = category;

			if (this._categories.indexOf(category) === -1)
				this._categories.push(category);
		}

		if (typeof command.init === 'function') {
			try {
				command.init(this.bot);
			} catch (err) {
				return this.bot.logger.severe(`Failed to init '${name}':`, err);
			}
		}

		this._commands.push(command);
	}

	all(category) {
		return !category ? this._commands : this._commands.filter(c => c.info.category.toLowerCase() === category.toLowerCase());
	}

	categories() {
		return this._categories;
	}

	get(name) {
		return this.findBy('name', name) ||
			this._commands.find(command => command.info.aliases instanceof Array && command.info.aliases.indexOf(name) > -1);
	}

	findBy(key, value) {
		return this._commands.find(c => c.info[key] === value);
	}
	
	/**
	 * Sets variables used to check information
	 * @param {Variable} var - Used to get the variable
	 * @param {Info} command.info - The command object to obtain info from
	 */
	getInfo(variable,info) {
		switch (variable) {
			case 'ownerOnly':
				/**
				* Whether the command can only be used by an owner
				* @type {boolean}
				*/
				return Boolean(info.ownerOnly) || false;
			case 'guildOnly':
				/**
				* Whether the command can only be run in a guild channel
				* @type {boolean}
				*/
				return Boolean(info.guildOnly) || false;
			case 'clientPermissions':
				/**
				* Permissions required by the client to use the info.
				* @type {?PermissionResolvable[]}
				*/
				return info.clientPermissions || undefined; //null;
			case 'userPermissions':
				/**
				* Permissions required by the user to use the info.
				* @type {?PermissionResolvable[]}
				*/
				return info.userPermissions || undefined; //null;
			case 'nsfw':
				/**
				* Whether the command can only be used in NSFW channels
				* @type {boolean}
				*/
				return Boolean(info.nsfw) || false;
			case 'allowDM':
				/**
				* Whether the command can be run in the bots dm's
				* @type {boolean}
				*/
				return Boolean(info.allowDM) || false;
			case 'argsType':
				/**
				* How the arguments are split when passed to the command's run method
				* @type {string}
				*/
				return info.argsType || 'single';
			case 'argsCount':
				/**
				* Maximum number of arguments that will be split
				* @type {number}
				*/
				return info.argsCount || 0;
			case 'argsSingleQuotes':
				/**
				* Whether single quotes are allowed to encapsulate an argument
				* @type {boolean}
				*/
				return 'argsSingleQuotes' in info ? info.argsSingleQuotes : true;
			case 'patterns':
				/**
				* Regular expression triggers
				* @type {RegExp[]}
				*/
				return info.patterns || undefined; //null;
			case 'guarded':
				/**
				* Whether the command is protected from being disabled
				* @type {boolean}
				*/
				return Boolean(info.guarded) || false;
			case '_globalEnabled':
				/**
				* Whether the command is enabled globally
				* @type {boolean}
				* @private
				*/
				return Boolean(info._globalEnabled) || true;
		}
	}
	
	/**
	 * Checks if the user has permission to use the command
	 * @param {Message} message - The triggering command message
	 * @param {Info} command.info - The command object to obtain info from
	 * @param {boolean} [ownerOverride=true] - Whether the bot owner(s) will always have permission
	 * @return {boolean|string} Whether the user has permission, or an error message to respond with if they don't
	 */
	checkUserPermissions(msg,info,ownerOverride = true) {
		if (info.userPermissions) {
			if (!this.getInfo("ownerOnly",info) && !this.getInfo("userPermissions",info)) return true;
			if (ownerOverride && msg.author.id == process.env.bot_owner) return true;
			if (this.getInfo("ownerOnly",info) && (ownerOverride || msg.author.id != process.env.bot_owner)) return false; // `The \`${info.name}\` command can only be used by the bot owner.`;
			if (msg.channel.type === "text" && this.getInfo("userPermissions",info)) {
				const missing = msg.channel.permissionsFor(msg.author).missing(this.getInfo("userPermissions",info));
				if (missing.length > 0) return `<:redx:411978781226696705> You do not have permission to use the \`${info.name}\` command.\n<:transparent:411703305467854889>Missing: \`${missing.map(perm => this.bot.utils.permissions[perm]).join("` `")}\``;
			}
		}
		return true;
	}
	
	/**
	 * Checks if the client has permission to use the command
	 * @param {Message} message - The triggering command message
	 * @param {Info} command.info - The command object to obtain info from
	 * @return {boolean|string} Whether the client has permission, or an error message to respond with if the bot doesn't
	 */
	checkClientPermissions(msg,info) {
		if (info.clientPermissions) {
			if (msg.channel.type !== "dm" && this.getInfo("clientPermissions",info)) {
				const missing = msg.channel.permissionsFor(this.bot.user).missing(this.getInfo("clientPermissions",info));
				if (missing.length > 0) return `<:redx:411978781226696705> I don't have enough permissions to execute that command.\n<:transparent:411703305467854889>Missing: \`${missing.map(perm => bot.utils.permissions[perm]).join("` `")}\``;
			}
		}
		return true;
	}
	
	/**
	 * Checks and returns the results of the user/client permissions
	 * @param {Message} message - The triggering command message
	 * @param {Info} command.info - The command object to obtain info from
	 * @return {boolean|string} Whether the user/client has permission, or an error message to respond with if they don't
	 */
	hasPermission(msg,info) {
		return ((typeof(this.checkClientPermissions(msg,info)) !== 'string') ? this.checkUserPermissions(msg,info) : this.checkClientPermissions(msg,info));
	}
	
	/**
	 * Checks if the command is usable for a message
	 * @param {?Message} msg - The message
	 * @param {Info} command.info - The command to get the information from
	 * @return {boolean}
	 */
	isUsable(msg,info) { //(message = null) {
		//if(!message) return this._globalEnabled;
		//if(this.guildOnly && message && !message.guild) return false;
		//const hasPermission = this.hasPermission(message);
		//return this.isEnabledIn(message.guild) && hasPermission && typeof hasPermission !== 'string';
		if (this.getInfo("ownerOnly",info) && msg.author.id != process.env.bot_owner) return false;
		if (this.getInfo("guildOnly",info) && msg.guild.id != process.env.main_bot_guild) return false;
		if (!this.getInfo("allowDM",info) && msg.channel.type === 'dm') return `<:redx:411978781226696705> This command can only be used in a server.`;
		if (this.getInfo("allowDM",info) && msg.channel.type === 'dm') return true;
		if (this.getInfo("nsfw",info) && !msg.channel.nsfw) return `<:redx:411978781226696705> This command can only be used in NSFW marked channels.`;
		return this.hasPermission(msg,info);
	}

	handleCommand(msg, input) {
		let prefix;
		if (!input.startsWith(`<@${this.bot.user.id}>`)) { //&& !input.startsWith(`<@!${this.bot.user.id}>`)) {
			prefix = msg.guild && (this.bot.config[msg.guild.id.toString()] && this.bot.config[msg.guild.id.toString()].prefix) || this.bot.config.prefix;
		} else {
			prefix = `<@${this.bot.user.id}>`;
		}
		
		if (!input.startsWith(prefix)) return; // || !input.startsWith(`<@${this.bot.id}>`)) return;
		let split = input.substr(prefix.length).trim().split(' ');
		let split1 = input.substr(prefix).trim().split(' ');
		let spli;
		if (prefix !== `<@${this.bot.user.id}>`)
		{
			let escaped_prefix = prefix.split('');
			//spli = new RegExp(`[\\${escaped_prefix.join('\\')}]`, 'gi');
			spli = new RegExp(`\\${escaped_prefix.join('\\')}`, 'gi');
		}
		else
		{
			spli = new RegExp(prefix,'gi');
		}
		// split1[0].match(spli).length;
		//if (spli > prefix.length || spli < prefix.length) return; //|| spli > `<@${this.bot.id}>`.length || spli < `<@${this.bot.id}>`.length) return; // do this if you input the prefix more than one time ex. >>help when the prefix is >help
		if (split1[0].match(spli).length !== 1 || split1[0].match(spli)[0].length !== prefix.length) return;
		let base = split[0].toLowerCase();
		let args = split.slice(1);

		// Try to find a built in command first
		let command = this.get(base);

		if (command) {
			return this.execute(msg, command, args);
		} else {
			return this._handleShortcuts(msg, base, args);
		}

		// Temporarily disabled
	}

	_handleShortcuts(msg, name, shortcutArgs) {
		// If that fails, look for a shortcut
		const shortcut = this.bot.storage('shortcuts').get(name);

		if (!shortcut) {
			// If no shortcuts could be found either, try finding the closest command
			const maybe = didYouMean(name, this.all().filter(c => !c.info.hidden).map(c => c.info.name), { //didYouMean(name, this.all().map(c => c.info.name), {
				// the filter should not suggest hidden commands
				threshold: 5,
				thresholdType: 'edit-distance'
			});

			if (maybe) {
				/*let mprefix;
				if (msg.channel.type !== "dm") {
					if (!this.bot.config[msg.guild.id.toString()]) {
						mprefix = this.bot.config.prefix;
					} else if (this.bot.config[msg.guild.id.toString()]) {
						mprefix = this.bot.config[msg.guild.id.toString()].prefix;
					}
				} else {
					mprefix = this.bot.config.prefix;
				}*/
				//let mprefix = msg.guild && (this.bot.config[msg.guild.id.toString()] && this.bot.config[msg.guild.id.toString()].prefix) || this.bot.config.prefix;
				return; //msg.channel.send(`:question: Did you mean \`${mprefix}${maybe}\`?`).then(m => m.delete(5000));
			} else {
				/*let nprefix;
				if (msg.channel.type !== "dm") {
					if (!this.bot.config[msg.guild.id.toString()]) {
						nprefix = this.bot.config.prefix;
					} else if (this.bot.config[msg.guild.id.toString()]) {
						nprefix = this.bot.config[msg.guild.id.toString()].prefix;
					}
				} else {
					nprefix = this.bot.config.prefix;
				}*/
				//let nprefix = msg.guild && (this.bot.config[msg.guild.id.toString()] && this.bot.config[msg.guild.id.toString()].prefix) || this.bot.config.prefix;
				return; //msg.channel.send(`:no_entry_sign: No commands were found that were similar to \`${nprefix}${name}\``);
				//.then(m => m.delete(5000));
			}
		}

		const commands = shortcut.command.split(';;');

		return Promise.all(
			commands.map(c => c.trim()).filter(c => c.length > 0).map(commandString => {
				const base = commandString.split(' ')[0].toLowerCase();
				const args = commandString.split(' ').splice(1).concat(shortcutArgs);

				const command = this.get(base);

				if (command) {
					return this.execute(msg, command, args);
				} else {
					return msg.channel.send(`<:redx:411978781226696705> The shortcut \`${shortcut.name}\` is improperly set up!`);
					//return msg.channel.send(`:no_entry_sign: The shortcut \`${shortcut.name}\` is improperly set up!`);
					//.then(m => m.delete(2000));
				}
			})
		);
	}

	async execute(msg, command, args) {
		msg.error = ((message, delay) => {
			if (message.message === 'Not Found') {
				// Kinda sick of these :\
				return;
			}

			let displayMessage = message.message || message;

			this.bot.logger.severe(message);

			const discordOutput = `<:redx:411978781226696705> ${displayMessage || 'Something failed!'}`;

			msg.channel.send(discordOutput)
				.then(m => m.delete(delay || 2000))
				.catch(() => {
					msg.channel.send(discordOutput)
						.then(m => m.delete(delay || 2000))
						.catch(() => { /* We can't even show the error, so what now? */ });
				});
		}).bind(msg);

		try {
			if ((msg.channel.type === 'dm' && msg.author.id != process.env.bot_owner) || (msg.channel.type !== 'dm' && msg.channel.id != "345551930459684866")) {
				this.bot.channels.get("415682448794451998").send({
					embed: ({
						color: 15684432,
						timestamp: new Date(),
						description: `\`\`\`\n${msg.content.toString()}\n\`\`\``,
						author: {
							name: `${msg.author.tag} - ${msg.author.id} | ${msg.guild.name || msg.channel.type} - ${msg.guild.id || msg.channel.type}`,
							icon_url: `${msg.author.displayAvatarURL}`
						}
					})
				}).catch(err => console.error(err.toString));
			}
			const isUsable = this.isUsable(msg, command.info);
			if (typeof(isUsable) === 'boolean' && !isUsable) return;
			if (typeof(isUsable) === 'string') return msg.channel.send({ embed: ({ description: `${isUsable}`, color: 15684432, timestamp: new Date(), author: { name: `${msg.author.tag}`, icon_url: `${msg.author.displayAvatarURL}` }})});
			return await command.run(this.bot, msg, args);
		} catch (err) {
			this.bot.channels.get("415265475895754752").send({
				embed: ({
					color: 15684432,
					timestamp: new Date(),
					title: `${err.name || "Unknown Error"}`,
					author: {
						name: `${msg.author.tag}`,
						icon_url: `${msg.author.displayAvatarURL}`
					},
					footer: {
						text: `${err.toString() || "N/A"}`
					},
					description: `\`\`\`\n${err.stack || "N/A"}\n\`\`\``,
					fields: [
						{
							name: "Extra Information:",
							value: "​"
						}, {
							name: "Error:",
							value: `\`${err.toString() || "N/A"}\``
						}, {
							name: "Error Name:",
							value: `\`${err.name || "N/A"}\``
						}, {
							name: "Error Message:",
							value: `\`${err.message || "N/A"}\``
						}, {
							name: "Command:",
							value: `\`${command.info.name || "Unknown Command"}\``
						}, {
							name: "Message Content:",
							value: `\`${msg.content.toString() || "N/A"}\``
						}
					]
				})
			}).catch(err => console.error(err.toString));
			msg.error(err);
			return null;
		}
	}
}

module.exports = CommandManager;
