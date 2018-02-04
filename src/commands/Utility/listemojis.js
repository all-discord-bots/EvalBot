exports.run = async (bot, msg) => {
  if (msg.author.id !== bot.config.botCreatorID) {
    if (!msg.member.hasPermission('ADMINISTRATOR') || !msg.member.hasPermission('manageServer')) return;
  }
  
  const emojiList = msg.guild.emojis.map(e=>e.toString()).join(" ");
  msg.channel.send(emojiList);
};

exports.info = {
  name: 'listemojis',
  usage: 'listemojis',
  description: 'Displays all the emojis for the current server'
};
