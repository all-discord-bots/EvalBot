exports.run = async (bot, msg, args) => {
  if (msg.author.id !== bot.config.botCreatorID) {
    if (!msg.member.hasPermission('EXTERNAL_EMOJIS')) return msg.channel.send(`<:redx:411978781226696705> You are missing the permission \`External Emojis\`!`).catch(console.error);
  }
  if (args.length < 1) return msg.channel.send(`<:redx:411978781226696705> Please provide a emoji ID!`).catch(console.error);
  
  const emojis = bot.emojis.get(`${args[0]}`);
  if (!emojis || emojis == null) return msg.channel.send(`<:redx:411978781226696705> \`${args[0]}\` is not a valid emoji id!`).catch(console.error);
  msg.channel.send(`${emojis}`);
};

exports.info = {
  name: 'sendemoji',
  usage: 'sendemoji <emoji id>',
  description: 'Make the bot message an emoji from an emoji ID only if the bot is in the server.'
};
