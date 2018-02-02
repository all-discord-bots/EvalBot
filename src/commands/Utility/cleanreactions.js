exports.run = (bot, msg, args) => {
  if(!parseInt(args[0], 10)) {
    return msg.edit(`Please provide a number of messages to clean reactions from!`).then(setTimeout(msg.delete.bind(msg), 1000));
  }
  if (msg.author.id !== bot.config.botCreatorID) {
    if(!msg.member.hasPermission("MANAGE_MESSAGES")) {
      return msg.channel.send(`You are missing permissions \`Manage Messages\``);
    }
  }
  msg.channel.messages.fetch({limit: parseInt(args[0], 10)}).then(msglog => {
    msg.channel.send(`Clearing Reactions from this channel for ${args[0]} messages...`);
    msglog.forEach(message => {
      message.clearReactions();
    });
  });
};

exports.info = {
  name: 'clearreactions',
  aliases: ['cr'],
  description: 'Clears all reactions from given number of messages.',
  usage: 'clearreactions <message count>'
};
