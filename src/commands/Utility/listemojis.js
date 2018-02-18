exports.run = async (bot, msg) => {
  if (msg.author.id !== bot.config.botCreatorID) {
    if (!msg.member.hasPermission('MANAGE_SERVER')) return msg.channel.send(`<:redx:411978781226696705> you are missing permissions \`Manage Server\`!`);
  }
  
  const emojiList = msg.guild.emojis.map(e=>e.toString()).join(" ");
  if (emojiList.length < 1) return msg.channel.send(`<:redx:411978781226696705> This server does not have any emojis!`);
  if (emojiList.length > 1999) return msg.channel.send(`<:redx:411978781226696705> The message exceeds 2000 characters!`);
  msg.channel.send(emojiList);
};

exports.info = {
  name: 'listemojis',
  usage: 'listemojis',
  description: 'Displays all the emojis for the current server'
};
