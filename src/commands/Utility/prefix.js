exports.run = (bot, msg, args) => {
    if (msg.author.id !== bot.config.botCreatorID) return;
    if (args.length < 1) {
        throw 'Please provide a prefix to set!';
    }
    
    const prefix = args.join(' ');
    bot.managers.config.set('prefix', prefix);
    // No point trying to delete this message, the bot will be
    // rebooting before we have a chance to.
    (await msg.channel.send("Setting Prefix...").then((msg)=>{
        msg.edit('Prefix set, rebooting! :ok_hand:');
    }));
};

exports.info = {
    name: 'prefix',
    usage: 'prefix <new prefix>',
    description: 'Sets the bot prefix'
};
