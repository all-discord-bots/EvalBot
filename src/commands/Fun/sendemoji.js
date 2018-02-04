exports.run = async (bot, msg, args) => {
  if (msg.author.id !== bot.config.botCreatorID) {
    if (!msg.member.hasPermission('EXTERNAL_EMOJIS')) return msg.channel.send("You are missing the permission `External Emojis`!");
  }
  if (args.length < 1) {
    return msg.channel.send("Please provide a emoji ID!");
  }
  
  const emojis = bot.emojis.get(`${args[0]}`);
  msg.channel.send(`${emojis}`);
};

exports.info = {
  name: 'sendemoji',
  usage: 'sendemoji <emoji id>',
  description: 'Make the bot message an emoji from an emoji ID only if the bot is in the server.'
};
