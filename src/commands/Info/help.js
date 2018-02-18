const stripIndents = require('common-tags').stripIndents;

exports.run = async (bot, msg, args) => {

    let commands = [];
    let title = 'Categories';

    if (args.length > 0) {
		let categories = bot.commands.categories().sort();
		let module = categories.map(c => `${c.toLowerCase()}`);
		let fcmd = bot.commands.get(args[0].toLowerCase());
		let aliases = ["NOTHING_HERE", "NOTHING_HERE_EITHER"];
		if (fcmd && fcmd.info.name) {
			aliases = fcmd.info.aliases;
		}
		let gcmd;
		let gali;
		if (fcmd) {
			gcmd = fcmd.info.name;
			if (fcmd.info.aliases) {
				gali = fcmd.info.aliases;
			} else {
				gali = "THIS_IS_A_FAKE_ALIASES_TO_FORCE_A_FALSE_STATEMENT";
			}
		} else {
			gcmd = "THIS_IS_A_FAKE_COMMAND_TO_FORCE_A_FALSE_STATEMENT";
			gali = "THIS_IS_A_FAKE_ALIASES_TO_FORCE_A_FALSE_STATEMENT";
		}
		if (args.length === 1 && new RegExp(module.join("|")).test(args[0].toLowerCase()) || /^category:|module:|type:/i.test(args[0].toLowerCase())) {
			if (new RegExp(module.join("|")).test(gcmd.toLowerCase()) === true || new RegExp(module.join("|")).test(gali.toLowerCase()) === true) {
				return msg.channel.send(` a command and module with the same name was found please use \`command:${args[0].toLowerCase()}\` or \`module:${args[0].toLowerCase()}\` or \`command ${args[0].toLowerCase()}!\`!`);
			}
        //if (/^category|module|type$/i.test(args[0])) {
            //if (args.length < 1) { // 2
            //    throw 'You must specify a module!';
            //}
			let getargs;
			if (/^category:|module:|type:/i.test(args[0].toLowerCase())) {
				getargs = args[0].replace(/^category:|module:|type:/gi, "");
			} else {
				getargs = args[0];
			}
            commands = bot.commands.all(getargs);
            title = `${getargs.toLowerCase()} Commands`;
        } else if (/^all|full|every$/i.test(args[0])) {
            commands = bot.commands.all();
            title = 'All Commands';
        } else if (args.length === 1 && new RegExp(commands.join("|")).test(args[0].toLowerCase()) === true || new RegExp(aliases.join("|")).test(args[0].toLowerCase()) === true || /^command:|cmd:/i.test(args[0].toLowerCase())) {
			//if (new RegExp(module.join("|")).test(gcmd.toLowerCase()) === true || new RegExp(module.join("|")).test(gali.toLowerCase()) === true) {
			//	return msg.channel.send(` a command and module with the same name was found please use \`command:${args[0].toLowerCase()}\` or \`module:${args[0].toLowerCase()}\`!`);
			//}
			let gargs;
			if (/^command:|cmd:/i.test(args[0].toLowerCase())) {
				gargs = args[0].replace(/^command:|cmd:/gi, "");
			} else {
				gargs = args[0];
			}
            let command = bot.commands.get(gargs);
            if (!command) {
                throw `The command '${args[0]}' does not exist!`;
            }

            commands = [command];
            title = `Help for \`${command.info.name.toLowerCase()}\``;
        } else if (/^command|cmd$/i.test(args[0]) && args.length > 1) {
			let command = bot.commands.get(args[1]);
			if (!command) {
				throw `The command '${args[1]}' does not exist!`;
			}
			commands = [command];
			title = `Help for \`${command.info.name.toLowerCase()}\``;
		} else {
			let command = bot.commands.get(args[0]);
			if (!command) {
				throw `The command '${args[0]}' does not exist!`;
			}
			commands = [command];
			title = `Help for \`${command.info.name.toLowerCase()}\``;
		}
	}

    if (commands.length > 0) {
        let fields = commands.filter(c => !c.info.hidden)
            .sort((a, b) => a.info.name.localeCompare(b.info.name))
            .map(c => getHelp(bot, c, commands.length === 1));

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

            messages.push({ fields: fields.splice(0, i) });
        }

        //msg.delete().catch(() => { });
        messages.map(m => m.fields).forEach(async fields => {
            (await msg.channel.send({
                embed: bot.utils.embed(title, 'Commands List', fields)
            }));
        });
    } else {
        let categories = bot.commands.categories().sort();
         msg.channel.send({
            embed: bot.utils.embed(title, stripIndents`
            **Available categories:**
            ${categories.map(c => `- __${c}__`).join('\n')}

            **Usage:**
            Do \`${bot.config.prefix}help module <name>\` or \`${bot.config.prefix}help [module:<name>]\` for a list of commands in a specific category.
            Do \`${bot.config.prefix}help all\` for a list of every command available in this bot.
            Do \`${bot.config.prefix}help <command>\` or \`${bot.config.prefix}help command <command>\` or \`${bot.config.prefix}help command:<command>\` for **extended** command help and command options.`)
        });
	}
};

const getHelp = (bot, command, single) => {
var aliasesstr = "," + command.info.aliases + ",";
var replacecomma = aliasesstr.replace(/,/g, "` `");
var replacecomma1 = replacecomma.replace("` ","") + "remove-this-string";
var replacecomma2 = replacecomma1.replace(" `remove-this-string","");
var finishedstr;
if (command.info.aliases === undefined || command.info.aliases == "") {
    finishedstr = "`<no aliases>`";
} else {
    finishedstr = replacecomma2;
}
    let description = stripIndents`
        **Usage:** \`${bot.config.prefix}${command.info.usage || command.info.name}\`
        **Aliases:** ${finishedstr}
        **Description:** ${command.info.description || '<no description>'}
        **Category:** __${command.info.category}__`;

    if (command.info.credits)
        description += `\n**Credits:** *${command.info.credits}*`;

    if (single && command.info.examples)
        description += `\n**Examples:**\n${command.info.examples.map(example => `\`${bot.config.prefix}${example}\``).join('\n')}`;

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
    usage: 'help all|[command]|[command <command>]|[module:<command>]|[command:<command>]',
    description: 'Shows you help for all commands or just a single command'
};
