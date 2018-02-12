exports.run = async (bot, msg) => {
    if (msg.author.id !== bot.config.botCreatorID) return;
    (await msg.channel.send("Shutting down...").then((msg)=>{
        msg.edit(`<:check:411976443522711552> Shutting down. Bye!`);
    }));
    process.exit(666);
};

exports.info = {
    name: 'shutdown',
    hidden: true,
    usage: 'shutdown',
    description: 'Shuts the bot down'
};
