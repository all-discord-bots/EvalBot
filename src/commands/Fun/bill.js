const got = require('got');

exports.run = async (bot, msg) => {
    let gbot = msg.guild.members.get(bot.user.id);
    if (!gbot.hasPermission(0x00008000)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Upload Files\`!`);
//    (await msg.channel.send("Loading message...").then((msg)=>{
//        msg.edit(':arrows_counterclockwise:');
//    }));
    const { body } = await got('http://belikebill.azurewebsites.net/billgen-API.php?default=1', { encoding: null });

    await msg.channel.send({
        file: {
            attachment: body,
            name: 'bill.jpg'
        }
    });

//    msg.delete();
};

exports.info = {
    name: 'bill',
    usage: 'bill',
    description: 'Be like Bill!'
};
