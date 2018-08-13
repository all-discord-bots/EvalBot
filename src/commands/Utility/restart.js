exports.run = async (bot, msg) => {
    if (msg.author.id !== bot.config.botCreatorID) return;
    (await msg.channel.send(`<:check:411976443522711552> Restarting bot...`).then((msg)=>{
      msg.edit(`<:check:411976443522711552> Successfully restarted bot.`);
    }));
    bot.shutdown(true);
};

exports.info = {
    name: 'restart',
    hidden: true,
    usage: 'restart',
    description: 'Resprings the bot.'
};
