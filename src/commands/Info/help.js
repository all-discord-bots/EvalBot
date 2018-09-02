const stripIndents = require('common-tags').stripIndents;

exports.run = async (bot, msg, args) => {
	try {
		let embed_title = `Modules`;
		let embed_header = undefined; // 'Commands List'
		let prefix = msg.guild && (bot.config[msg.guild.id] && bot.config[msg.guild.id].prefix) || bot.config.prefix;
		//let prefix = msg.guild ? (bot.config[msg.guild.id] ? (bot.config[msg.guild.id].prefix ? bot.config[msg.guild.id].prefix : bot.config.prefix) : bot.config.prefix) : bot.config.prefix;
		let commands = [];
		let aliases = [];
		let every_command = bot.commands.all().map((cmd) => `${cmd.info.name},${cmd.info.aliases}`).join(',').split(',').filter((cmd) => cmd != 'undefined');
		let modules = bot.commands.categories().sort();
		let modules_lowercase = modules.map((module) => `${module.toLowerCase()}`);
		
		/**
		* Check if the user typed the command like `help prefix` or `help module:music` or `help command:prefix`
		*/
		if (args.length === 1) {
			let command_args = args.join(' ').toLowerCase().replace(/^((module|command)[:])/,'');
			let find_command = bot.commands.get(command_args.toLowerCase());
			let command_name = ((find_command && find_command.info.name) || '<unknown command>');
			let command_aliases = ((find_command && find_command.info.aliases) || []);
			aliases.push(command_aliases);
			if (/^(all)$/.test(args.join(' ').toLowerCase())) {
				commands = bot.commands.all();
				embed_title = `All Commands`;
			} else if (/^((module[:])|())/.test(args.join(' ').toLowerCase()) && new RegExp(`^(${modules_lowercase.join('|').toLowerCase()})$`).test(command_args.toLowerCase())) {
				// /^((module[:])?)/
				if (bot.commands.all(command_args.toLowerCase()).length <= 0) return msg.channel.send(`<:redx:411978781226696705> no module \`${command_args.toLowerCase()}\` could be found!`);
				commands = bot.commands.all(command_args.toLowerCase());
				if (!/^((module[:])|())/.test(args.join(' ').toLowerCase()) && new RegExp(`^(${every_command.join('|').toLowerCase()})$`).test(command_args.toLowerCase())) return msg.channel.send(`<:redx:411978781226696705> there is both a command and module with the name of \`${command_args.toLowerCase()}\`. Try using \`command:\` or \`module:\` to specify the type you are searching for.`);
				embed_title = `\`${command_args.toLowerCase()}\` Commands`;
			} else if (/^((command[:])|())/.test(args.join(' ').toLowerCase()) && new RegExp(`^(${every_command.join('|').toLowerCase()})$`).test(command_args.toLowerCase())) {
				// /^((command[:]|)?)/ new RegExp(`^(${commands.join('|')}|${aliases.join('|')})$`)
				/*new RegExp(`^(${commands.join('|')}|${aliases.join('|')})$`).test(command_args.toLowerCase())*/
				if (!find_command) return msg.channel.send(`<:redx:411978781226696705> no command \`${command_args.toLowerCase()}\` could be found!`);
				if (find_command && msg.author.id != process.env.bot_owner && (('hidden' in find_command.info && find_command.info.hidden) || ('ownerOnly' in find_command.info && find_command.info.ownerOnly))) return msg.channel.send(`<:redx:411978781226696705> no command \`${command_args.toLowerCase()}\` could be found!`);
				commands = [find_command];
				if (!/^((command[:])|())/.test(args.join(' ').toLowerCase()) && new RegExp(`^(${modules_lowercase.join('|').toLowerCase()})$`).test(command_args.toLowerCase())) return msg.channel.send(`<:redx:411978781226696705> there is both a command and module with the name of \`${command_args.toLowerCase()}\`. Try using \`command:\` or \`module:\` to specify the type you are searching for.`);
				embed_title = `\`${find_command.info.category.toLowerCase()}:${command_name.toLowerCase()}\``;
			} else {
				return msg.channel.send(`<:redx:411978781226696705> I was unable to find that command or module in my database!`);
			}
		}
	
		if (commands.length > 0) {
			let fields;
			if (msg.author.id != process.env.bot_owner) {
				fields = commands.filter((cmd) => !cmd.info.hidden && !command.info.ownerOnly)
					.sort((a,b) => a.info.name.localeCompare(b.info.name))
					.map((cmd) => getHelp(bot,msg,cmd,commands.length === 1));
			} else {
				fields = commands.sort((a,b) => a.info.name.localeCompare(b.info.name))
					.map((cmd) => getHelp(bot,msg,cmd,commands.length === 1));
			}
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
			messages.map((embed) => embed.fields).forEach(async(fields) => {
				(await msg.channel.send({
					embed: bot.utils.embed(embed_title,embed_header,fields)
				}));
			});
		} else {
			msg.channel.send({
				embed: bot.utils.embed(embed_title, stripIndents`
				**Available modules:**
				${modules.map((module) => `- __${module}__`).join('\n')}

				**Usage:**
				Do \`${prefix}help module:<module>\` for a list of commands in a specific module.
				Do \`${prefix}help all\` for a list of every command.
				Do \`${prefix}help command:<command>\` for **extended** command help and command options.
				You may also do \`${prefix}help [command | module]\``)
			});
		}
	} catch (err) {
		console.error(err.stack ? err.stack : err.toString());
	}
};

/**
* @todo - Make individual fields for each of the items
* @example - **Usage:** goes on it's own field like `unbelievaboat bot`, **Description** goes on it's own field as well... etc;
*/
const getHelp = (bot, msg, command, single) => {
	try {
		let aliasesstr = `,${command.info.aliases},`;
		let replacecomma = aliasesstr.replace(/,/g, "` `");
		let replacecomma1 = replacecomma.replace("` ","") + "remove-this-string";
		let replacecomma2 = replacecomma1.replace(" `remove-this-string","");
		let finishedstr;
		if (command.info.aliases === undefined || command.info.aliases == "") {
			finishedstr = `\`<no aliases>\``;
		} else {
			finishedstr = replacecomma2;
		}
		let prefix = msg.guild && (bot.config[msg.guild.id] && bot.config[msg.guild.id].prefix) || bot.config.prefix;
		// ${('aliases' in command.info && command.info.aliases.length > 0) ? command.info.aliases.map((alias) => `\`${alias.toLowerCase()}\``).join(` `) : `\`<no aliases>\``}
		let description = stripIndents`
			**Description:** ${'description' in command.info ? command.info.description : `\`<no description>\``}
			**Usage:** \`${prefix}${'usage' in command.info ? command.info.usage : command.info.name}\`
			**Aliases:** ${finishedstr}
			**Module:** \`${'category' in command.info ? command.info.category : `<unknown category>`}\``;

		if (command.info.credits)
			description += `\n**Credits:** \`${command.info.credits}\``;

		if (single && command.info.examples)
			description += `\n**Examples:**\n${command.info.examples.map((example) => `\`${prefix}${example}\``).join('\n')}`;

		if (single && command.info.options instanceof Array) {
			let options = command.info.options.map((option) => {
				return stripIndents`
				**${option.name}**
				┌ \t**Usage:** \`${option.usage || option.name}\`
				└ \t**Description:** ${option.description}
				`;
			});
			description += `\n**Options:**\n${options.join('\n\n')}`; // `\n**Options:**\n\n${options.join('\n\n')}`
		}
		
		return {
			name: single ? '\u200b' : command.info.name,
			value: description
		};
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'help',
	allowDM: true,
	usage: 'help [all | command | module]',
	examples: [
		'help',
		'help music',
		'help play',
		'help all',
		'help command:play',
		'help module:music'
	],
	description: 'Get help information on using commands.'
};
