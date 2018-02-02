exports.run = (bot, msg, args) => {
  if(!parseInt(args[0], 10)) {
    return msg.channel.send(`Please provide a number of messages to clean reactions from!`);
  }
  if (msg.author.id !== bot.config.botCreatorID) {
    if(!msg.member.hasPermission("MANAGE_MESSAGES")) {
      return msg.channel.send(`You are missing permissions \`Manage Messages\``);
    }
  }
  msg.channel.fetchMessages({limit: parseInt(args[0], 10)}).then(msglog => {
    msg.channel.send(`Clearing Reactions from this channel for ${args[0]} messages...`);
    msglog.forEach(message => {
      message.clearReactions();
    });
  });
};

exports.info = {
  name: 'clearreactions',
  hidden: true,
  aliases: ['cr'],
  description: 'Clears all reactions from given number of messages.',
  usage: 'clearreactions <message count>'
};
