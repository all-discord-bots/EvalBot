const path = require('path');
const chalk = require('chalk');
const didYouMean = require('didyoumean2');

class CommandManager {
	constructor(bot) {
		this.bot = bot;
		this._commands = [];
		this._categories = [];
	}

	_validateCommand(object) {
		if (typeof object !== 'object')
			return 'command setup is invalid';
		if (typeof object.run !== 'function')
			return 'run function is missing';
		if (typeof object.info !== 'object')
			return 'info object is missing';
		if (typeof object.info.name !== 'string')
			return 'info object is missing a valid name field';
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

	handleCommand(msg, input) {
		let prefix;
		if (msg.channel.type !== "dm") {
			if (this.bot.config[msg.guild.id] === undefined) {
				prefix = this.bot.config.prefix; // || `<@{this.bot.id}>`;
			} else if (this.bot.config[msg.guild.id] !== undefined) {
				prefix = this.bot.config[msg.guild.id].prefix; // || `<@${this.bot.id}>`;
			}
		} else {
			prefix = this.bot.config.prefix;
		}

		if (!input.startsWith(prefix)) return; // || !input.startsWith(`<@${this.bot.id}>`)) return;
		let split = input.substr(prefix.length).trim().split(' ');
		let split1 = input.substr(prefix).trim().split(' ');
		let spli = new RegExp(prefix, 'gi');
		// split1[0].match(spli).length;
		//if (spli > prefix.length || spli < prefix.length) return; //|| spli > `<@${this.bot.id}>`.length || spli < `<@${this.bot.id}>`.length) return; // do this if you input the prefix more than one time ex. >>help when the prefix is >help
		if (split1[0].match(spli).length !== prefix.length) return;
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
				let mprefix;
				if (msg.channel.type !== "dm") {
					if (!this.bot.config[msg.guild.id]) {
						mprefix = this.bot.config.prefix;
					} else if (this.bot.config[msg.guild.id]) {
						mprefix = this.bot.config[msg.guild.id].prefix;
					}
				} else {
					mprefix = this.bot.config.prefix;
				}
				return msg.channel.send(`:question: Did you mean \`${mprefix}${maybe}\`?`).then(m => m.delete(5000));
			} else {
				let nprefix;
				if (msg.channel.type !== "dm") {
					if (!this.bot.config[msg.guild.id]) {
						nprefix = this.bot.config.prefix;
					} else if (this.bot.config[msg.guild.id]) {
						nprefix = this.bot.config[msg.guild.id].prefix;
					}
				} else {
					nprefix = this.bot.config.prefix;
				}
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
			return await command.run(this.bot, msg, args);
		} catch (err) {
			msg.error(err);
			return null;
		}
	}
}

module.exports = CommandManager;


/*
const path = require('path');
const chalk = require('chalk');
const didYouMean = require('didyoumean2');

class CommandManager {
	constructor(bot) {
		this.bot = bot;
		this._commands = [];
		this._categories = [];
	}

	_validateCommand(object) {
		if (typeof object !== 'object') return 'command setup is invalid';
		if (typeof object.run !== 'function') return 'run function is missing';
		if (typeof object.info !== 'object') return 'info object is missing';
		if (typeof object.info.name !== 'string') return 'info object is missing a valid name field';
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

	handleCommand(msg, input) {
		let prefix;
		if (msg.channel.type !== "dm") {
			if (this.bot.config[msg.guild.id] === undefined) {
				prefix = this.bot.config.prefix; // || `<@{this.bot.id}>`;
			} else if (this.bot.config[msg.guild.id] !== undefined) {
				prefix = this.bot.config[msg.guild.id].prefix; // || `<@${this.bot.id}>`;
			}
		} else {
			prefix = this.bot.config.prefix;
		}

		if (!input.startsWith(prefix) || !input.startsWith(`<@${this.bot.id}>`) || !input.startsWith(`<@!${this.bot.id}>`)) return; // || !input.startsWith(`<@${this.bot.id}>`)) return;
		let split, split1, spli, base, args;
		if (split1[0].match(spli).length != prefix.length || split1[0].match(spli).length != `<@${this.bot.id}>`.length || split1[0].match(spli).length != `<@!${this.bot.id}>`.length)
		if (input.startsWith(prefix)) {
			split = input.substr(prefix.length).trim().split(' ');
			split1 = input.substr(prefix).trim().split(' ');
			spli = new RegExp(prefix, 'gi');
			// split1[0].match(spli).length;
			// if (spli > prefix.length || spli < prefix.length) return; //|| spli > `<@${this.bot.id}>`.length || spli < `<@${this.bot.id}>`.length) return; // do this if you input the prefix more than one time ex. >>help when the prefix is >help
		} else if (input.startsWith(`<@${this.bot.id}>`) || input.startsWith(`<@!${this.bot.id}>`)) {
			if (input.startsWith(`<@${this.bot.id}>`)) {
				split = input.substr(`<@${this.bot.id}>`.length).trim().split(' ');
				split1 = input.substr(`<@${this.bot.id}>`).trim().split(' ');
				spli = new RegExp(`<@${this.bot.id}>`, 'gi');
			} else if (input.startsWith(`<@!${this.bot.id}>`)) {
				split = input.substr(`<@!${this.bot.id}>`);
				split1 = input.substr(`<@!${this.bot.id}>`).trim().split(' ');
				spli = new RegExp(`<@!${this.bot.id}>`, 'gi');
			}
			//split1[0].match(spli).length;
		} else {
			return; // console.warn(`No valid prefix provided`);
		}
		base = split[0].toLowerCase();
		args = split.slice(1);

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
				let mprefix;
				if (msg.channel.type !== "dm") {
					if (!this.bot.config[msg.guild.id]) {
						mprefix = this.bot.config.prefix;
					} else if (this.bot.config[msg.guild.id]) {
						mprefix = this.bot.config[msg.guild.id].prefix;
					}
				} else {
					mprefix = this.bot.config.prefix;
				}
				return msg.channel.send(`:question: Did you mean \`${mprefix}${maybe}\`?`).then(m => m.delete(5000));
			} else {
				let nprefix;
				if (msg.channel.type !== "dm") {
					if (!this.bot.config[msg.guild.id]) {
						nprefix = this.bot.config.prefix;
					} else if (this.bot.config[msg.guild.id]) {
						nprefix = this.bot.config[msg.guild.id].prefix;
					}
				} else {
					nprefix = this.bot.config.prefix;
				}
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
						.catch(() => { /* We can't even show the error, so what now? */ //});
/*				});
		}).bind(msg);

		try {
			return await command.run(this.bot, msg, args);
			// return command.run(this.bot, msg, args);
		} catch (err) {
			msg.error(err);
			return null;
		}
	}
}

module.exports = CommandManager;
*/







Successfully launched shard 0
2018-04-19T23:28:16.113569+00:00 app[worker.1]: /app/src/managers/commands.js:457
2018-04-19T23:28:16.113609+00:00 app[worker.1]: });
2018-04-19T23:28:16.113611+00:00 app[worker.1]: ^
2018-04-19T23:28:16.113613+00:00 app[worker.1]: 
2018-04-19T23:28:16.113616+00:00 app[worker.1]: SyntaxError: Unexpected token }
2018-04-19T23:28:16.113618+00:00 app[worker.1]:     at createScript (vm.js:80:10)
2018-04-19T23:28:16.113619+00:00 app[worker.1]:     at Object.runInThisContext (vm.js:139:10)
2018-04-19T23:28:16.113621+00:00 app[worker.1]:     at Module._compile (module.js:616:28)
2018-04-19T23:28:16.113624+00:00 app[worker.1]:     at Object.Module._extensions..js (module.js:663:10)
2018-04-19T23:28:16.113625+00:00 app[worker.1]:     at Module.load (module.js:565:32)
2018-04-19T23:28:16.113627+00:00 app[worker.1]:     at tryModuleLoad (module.js:505:12)
2018-04-19T23:28:16.113629+00:00 app[worker.1]:     at Function.Module._load (module.js:497:3)
2018-04-19T23:28:16.113630+00:00 app[worker.1]:     at Module.require (module.js:596:17)
2018-04-19T23:28:16.113631+00:00 app[worker.1]:     at require (internal/module.js:11:18)
2018-04-19T23:28:16.113633+00:00 app[worker.1]:     at Object.<anonymous> (/app/src/managers/index.js:2:21)
