exports.run = async (bot, msg) => {
    if (msg.author.id !== bot.config.botCreatorID) return;
    msg.channel.send(`<:check:411976443522711552> Rebooting bot.`);
    process.exit(1);
};

exports.info = {
    name: 'reboot',
    hidden: true,
    usage: 'reboot',
    description: 'Reboots the bot'
};
