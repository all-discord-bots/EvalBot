const got = require('got');

function makeCommand(type, url, transformer) {
    return {
        run: async (bot, msg) => {
            //let gbot = msg.guild.members.get(bot.user.id);
            //if (!gbot.hasPermission(0x00008000)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Upload Files\`!`);
            //(await msg.channel.send("Loading animals...").then((msg)=>{
                //msg.edit(':arrows_counterclockwise:');
            //}));
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
            description: `Sends a random ${type} image`,
            clientPermissions: ["ATTACH_FILES"]
        }
    };
}

const vote = Math.floor(Math.random() * 2) >= 1 ? true : false;

module.exports = [
    makeCommand('cat', vote ? 'http://aws.random.cat/meow' : 'https://nekos.life/api/v2/img/meow', body => vote ? JSON.parse(body).file : JSON.parse(body).url),
    makeCommand('dog', vote ? 'http://random.dog/woof.json' : 'https://nekos.life/api/v2/img/woof', body => JSON.parse(body).url),
    //makeCommand('dog', vote ? 'http://random.dog/woof' : 'https://nekos.life/api/v2/img/woof', body => vote ? `http://random.dog/${body}` : JSON.parse(body).url),
    makeCommand('lizard', 'https://nekos.life/api/v2/img/lizard', body => JSON.parse(body).url),
    makeCommand('duck', 'https://random-d.uk/api/v1/random', body => JSON.parse(body).url)
];
