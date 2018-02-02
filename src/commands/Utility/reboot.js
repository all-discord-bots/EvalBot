exports.run = async (bot, msg) => {
    if (msg.author.id !== bot.config.botCreatorID) return;
    (await msg.channel.send("Rebooting Bot...").then((msg)=>{
        msg.edit('✅ Rebooting bot.');
    }));
    process.exit(1);
};

exports.info = {
    name: 'reboot',
    hidden: true,
    usage: 'reboot',
    description: 'Reboots the bot'
};
