exports.run = async (bot, msg) => {
    if (msg.author.id !== bot.config.botCreatorID) return;
    (await msg.channel.send("Restarting Bot...").then((msg)=>{
        msg.edit(':white_check_mark: Restarting all shards.');
    }));
    process.exit(42);
};

exports.info = {
    name: 'restart',
    hidden: true,
    usage: 'restart',
    description: 'Restarts all shards'
};
