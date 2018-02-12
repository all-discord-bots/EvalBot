exports.run = async (bot, msg) => {
    if (msg.author.id !== bot.config.botCreatorID) return;
    msg.channel.send(`<:check:411976443522711552> Restarting bot.`);
    process.exit(42);
};

exports.info = {
    name: 'restart',
    hidden: true,
    usage: 'restart',
    description: 'Resprings the bot.'
};
