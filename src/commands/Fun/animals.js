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

const endpoints = {
    cats: ['http://aws.random.cat/meow', 'https://nekos.life/api/v2/img/meow'],
    dogs: ['https://dog.ceo/api/breeds/image/random', 'http://random.dog/woof.json', 'https://nekos.life/api/v2/img/woof'],
    lizards: ['https://nekos.life/api/v2/img/lizard'],
    ducks: ['https://random-d.uk/api/v1/random']
}

const generated_number = {
    cats: 0,
    dogs: 0,
    lizards: 0,
    ducks: 0
};

function vote(category) {
    const generator = Math.floor(Math.random() * endpoints[category].length);
    generated_number[category] = generator;
    return endpoints[category][generator];
}

module.exports = [
    makeCommand('cat', vote('cats'), body => generated_number.cats >= 1 ? JSON.parse(body).file : JSON.parse(body).url),
    makeCommand('dog', vote('dogs'), body => generated_number.dogs >= 1 ? JSON.parse(body).url : JSON.parse(body).message),
    //makeCommand('dog', vote ? 'http://random.dog/woof' : 'https://nekos.life/api/v2/img/woof', body => vote ? `http://random.dog/${body}` : JSON.parse(body).url),
    makeCommand('lizard', vote('lizards'), body => JSON.parse(body).url),
    makeCommand('duck', vote('ducks'), body => JSON.parse(body).url)
];
