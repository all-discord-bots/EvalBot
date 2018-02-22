const got = require('got');

function makeCommand(type, url, transformer) {
    return {
        run: async (bot, msg, args) => {
            let gbot = msg.guild.members.get(bot.user.id);
            if (!gbot.hasPermission(0x00008000)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Attach Files\`!`).catch(console.error);
	    if (!msg.member.hasPermission('ATTACH_FILES')) return msg.channel.send(`<:redx:411978781226696705> You are missing the permissions \`Attach Files\`!`).catch(console.error);
	    if (!msg.channel.nsfw) return msg.channel.send(`<:redx:411978781226696705> This channel is not marked as NSFW!`).catch(console.error);
            const res = await got(url);

            let file;
            try {
                file = transformer(res.body);
            } catch (ignore) {
                return msg.error('Failed to transform image URL!');
            }

            //msg.delete();
            msg.channel.send({
                files: [
                    file
                ]
            });
        },
        info: {
            name: type,
            usage: type,
            description: `Sends a random ${type} image`
        }
    };
}

module.exports = [
    makeCommand('ass', 'http://api.obutts.ru/butts/0/1/random', body => `http://media.obutts.ru/${JSON.parse(body).preview}`),
    makeCommand('boobs', 'http://api.oboobs.ru/boobs/0/1/random', body => `http://media.obutts.ru/${JSON.parse(body).preview}`)
];
