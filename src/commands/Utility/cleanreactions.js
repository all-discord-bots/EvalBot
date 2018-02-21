exports.run = (bot, msg, args) => {
  if(!parseInt(args[0], 10)) {
    return msg.channel.send(`Please provide a number of messages to clean reactions from!`);
  }
  let gbot = msg.guild.members.get(bot.user.id);
  if (!gbot.hasPermission(0x00002000)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Manage Messages\`!`).catch(console.error);
  if (msg.author.id !== bot.config.botCreatorID) {
    if(!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send(`<:redx:411978781226696705> You are missing the permissions \`Manage Messages\``).catch(console.error);
  }
  msg.channel.fetchMessages({limit: parseInt(args[0], 10)}).then(msglog => {
    msg.channel.send(`Clearing Reactions from this channel for ${args[0]} messages...`);
    msglog.forEach(message => {
      message.clearReactions();
    }).catch(console.error);
  }).catch(console.error);
};

exports.info = {
  name: 'clearreactions',
  hidden: true,
  aliases: ['cr'],
  description: 'Clears all reactions from given number of messages.',
  usage: 'clearreactions <message count>'
};
