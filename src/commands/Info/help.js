const stripIndents = require('common-tags').stripIndents;

exports.run = async (bot, msg, args) => {
	let title = 'Categories';
	let prefix = msg.guild && (bot.config[msg.guild.id.toString()] && bot.config[msg.guild.id.toString()].prefix) || bot.config.prefix;
	let commands = [];
	let aliases = [];
	let modules = bot.commands.categories().sort();
	let modules_lowercase = modules.map(module => `${module.toLowerCase()}`);
	
	if (args.length > 0) {
		/**
		* Check if the user typed the command like `help prefix` or `help module:music` or `help command:prefix`
		*/
		if (args.length === 1) {
			let command_args = args[0].toLowerCase().replace(/^(module:|command:)/gi,'');
			let find_command = bot.commands.get(command_args.toLowerCase());
			let command_name = ((find_command && find_command.info.name) || "<unknown command>");
			let command_aliases = ((find_command && find_command.info.aliases) || []);
			aliases = [command_aliases];
			if (/^(all)$/i.test(args[0].toLowerCase())) {
				commands = bot.commands.all();
				title = 'All Commands';
			} else if (/^(module:)/i.test(args[0].toLowerCase()) && (new RegExp(modules_lowercase.join('|')).test(command_args.toLowerCase()))) {
				if (!bot.commands.all(command_args.toLowerCase())) return msg.channel.send(`<:redx:411978781226696705> The module '${command_args.toLowerCase()}' does not exist!`).catch(err => console.error);
				commands = bot.commands.all(command_args.toLowerCase());
				title = `\`${command_args.toLowerCase()}\` Commands`;
			} else if (/^(command:)/i.test(args[0].toLowerCase()) && (new RegExp(commands.join("|")).test(command_args.toLowerCase()) || new RegExp(aliases.join("|")).test(command_args.toLowerCase()))) {
				if (!find_command) return msg.channel.send(`<:redx:411978781226696705> The command \`${command_args.toLowerCase()}\` does not exist!`).catch(err => console.error);
				commands =  [find_command];
				title = `Help for \`${command_name.toLowerCase()}\``;
			} else {
				if (new RegExp(modules_lowercase.join('|')).test(command_args)) {
					commands = bot.commands.all(command_args.toLowerCase());
					title = `${command_args.toLowerCase()} Commands`;
				} else if (find_command) {
					commands = [find_command];
					title = `Help for \`${command_name.toLowerCase()}\``;
				} else {
					return msg.channel.send(`<:redx:411978781226696705> No command or module \`${args[0].toLowerCase()}\` exists!`).catch(err => console.error);
				}
				// if (new RegExp(modules_lowercase('|')).test(args[0].toLowerCase())) return msg.channel.send(`<:redx:411978781226696705> a command and module with the same name was found please use \`command:${args[0].toLowerCase()}\` or \`module:${args[0].toLowerCase()}\`!`);
				//commands = [find_command];
			}
			/**
			* Checks if the user typed the command like `help command prefix` or `help module music`
			*/
		} else if (args.length > 1) {
			let find_command = bot.commands.get(args[1].toLowerCase());
			let command_name = ((find_command && find_command.info.name) || "Unknown Command");
			if (/^(command)$/i.test(args[0].toLowerCase())) {
				if (!find_command) return msg.channel.send(`<:redx:411978781226696705> The command \`${args[1].toLowerCase()}\` does not exist!`).catch(err => console.error);
				commands = [find_command];
				title = `Help for \`${command_name.toLowerCase()}\``;
			} else if (/^(module)$/i.test(args[0].toLowerCase())) {
				if (!bot.commands.all(args[1].toLowerCase())) return msg.channel.send(`<:redx:411978781226696705> The module \`${args[0].toLowerCase()}\` does not exist!`).catch(err => console.error);
				commands = bot.commands.all(args[1].toLowerCase());
				title = `${args[1].toLowerCase()} Commands`;
			}
		}
	}
	
	if (commands.length > 0) {
		let fields = commands.filter(cmd => !cmd.info.hidden)
			.sort((a,b) => a.info.name.localeCompare(b.info.name))
			.map(cmd => getHelp(bot,msg,cmd,commands.length === 1));
		
		// Temporary workaround for the 2k char limit
		let maxLength = 1900;
		let messages = [];
		
		while (fields.length > 0) {
			let len = 0;
			let i = 0;
			while (len < maxLength) {
				if (i >= fields.length) {
					break;
				}
				let field = fields[i];
				len += field.name.length + field.value.length;
				if (len >= maxLength) {
					break;
				}
				i++;
			}
			messages.push({ fields: fields.splice(0,i) });
		}
		
		messages.map(m => m.fields).forEach(async fields => {
			(await msg.channel.send({
				embed: bot.utils.embed(title,'Commands List',fields)
			}));
		});
	} else {
		msg.channel.send({
			embed: bot.utils.embed(title, stripIndents`
			**Available categories:**
			${modules.map(module => `- __${module}__`).join('\n')}

			**Usage:**
			Do \`${prefix}help module <name>\` or \`${prefix}help [module:<name>]\` for a list of commands in a specific category.
			Do \`${prefix}help all\` for a list of every command available.
			Do \`${prefix}help <command>\` or \`${prefix}help command <command>\` or \`${prefix}help command:<command>\` for **extended** command help and command options.`)
		});
	}
};

/**
* @todo - Make individual fields for each of the items
* @example - **Usage:** goes on it's own field like `unbelievaboat bot`, **Description** goes on it's own field as well... etc;
*/
const getHelp = (bot, msg, command, single) => {
	let prefix = msg.guild && (bot.config[msg.guild.id.toString()] && bot.config[msg.guild.id.toString()].prefix) || bot.config.prefix;
	let description = stripIndents`
		**Usage:** \`${prefix}${command.info.usage || command.info.name}\`
		**Aliases:** \`${(command.info.aliases && command.info.aliases.join('` `')) || '<no aliases>'}\`
		**Description:** \`${command.info.description || '<no description>'}\`
		**Category:** \`${command.info.category || '<unknown category>'}\``;

	if (command.info.credits)
		description += `\n**Credits:** *${command.info.credits}*`;

	if (single && command.info.examples)
		description += `\n**Examples:**\n${command.info.examples.map(example => `\`${prefix}${example}\``).join('\n')}`;

	if (single && command.info.options instanceof Array) {
		let options = command.info.options.map(option => {
			return stripIndents`
			**${option.name}**
			*Usage:* \`${option.usage || option.name}\`
			*Description:* ${option.description}
			`;
		});
		description += `\n**Options:**\n\n${options.join('\n\n')}`;
	}

	return {
		name: single ? '\u200b' : command.info.name,
		value: description
	};
};

exports.info = {
	name: 'help',
	usage: 'help [all | command | module]',
	allowDM: true,
	examples: [
		'help',
		'help music',
		'help play',
		'help all',
		'help command:play',
		'help command play',
		'help module:music',
		'help module music'
	],
	description: 'Shows you help for all commands, commands in a module or just a single command'
};
