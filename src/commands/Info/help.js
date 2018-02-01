const stripIndents = require('common-tags').stripIndents;

exports.run = async (bot, msg, args) => {

    let commands = [];
    let title = 'Categories';

    if (args.length > 0) {
        if (/^category|module|type$/i.test(args[0])) {
            if (args.length < 2) {
                throw 'You must specify a category!';
            }

            commands = bot.commands.all(args[1]);
            title = `${args[1]} Commands`;
        } else if (/^all|full|every$/i.test(args[0])) {
            commands = bot.commands.all();
            title = 'All Commands';
        } else {
            let command = bot.commands.get(args[0]);
            if (!command) {
                throw `The command '${args[0]}' does not exist!`;
            }

            commands = [command];
            title = `Help for \`${command.info.name}\``;
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
        await(msg.channel.send("Loading...").then((msg)=>{
         msg.edit({
            embed: bot.utils.embed(title, stripIndents`
            **Available categories:**
            ${categories.map(c => `- __${c}__`).join('\n')}

            **Usage:**
            Do \`${bot.config.prefix}help category <name>\` for a list of commands in a specific category.
            Do \`${bot.config.prefix}help all\` for a list of every command available in this bot.
            Do \`${bot.config.prefix}help <command>\` for **extended** command help and command options.`)
        });
      }));
    }
};

const getHelp = (bot, command, single) => {
var aliasesstr = "," + command.info.aliases.toString() + ",";
var replacecomma = aliasesstr.replace(/,/g, "` `");
var replacecomma1 = replacecomma.replace("` ","") + "remove-this-string";
var replacecomma2 = replacecomma1.replace(" `remove-this-string","");

    let description = stripIndents`
        **Usage:** \`${bot.config.prefix}${command.info.usage || command.info.name}\`
        **Aliases:** ${replacecomma2 || '`<no aliases>`'}
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
    usage: 'help all|[command]|[category <name>]',
    description: 'Shows you help for all commands or just a single command'
};
