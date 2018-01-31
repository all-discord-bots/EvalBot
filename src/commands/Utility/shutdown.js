exports.run = async (bot, msg) => {
    if (msg.author.id !== bot.config.botCreatorID) return;
    (await msg.channel.send("Shutting down...").then((msg)=>{
        msg.edit(':white_check_mark: Shutting down. Bye!');
    }));
    process.exit(666);
};

exports.info = {
    name: 'shutdown',
    usage: 'shutdown',
    description: 'Fully shuts the bot down'
};
