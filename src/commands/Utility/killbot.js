exports.run = async (bot, msg) => {
    if (msg.author.id !== bot.config.botCreatorID) return;
    (await msg.channel.send("Killing processes...").then((msg)=>{
        msg.edit(`<:check:411976443522711552> Killing all processes.`);
    }));
    bot.shutdown(false);
};

exports.info = {
    name: 'killbot',
    aliases: ['kill-bot','powerdown'],
    hidden: true,
    usage: 'killbot',
    description: 'Fully kills the bots processes.'
};
