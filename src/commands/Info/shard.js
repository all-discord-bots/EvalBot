exports.run = async (bot, msg) => {
  msg.channel.send(`This server is on shard **${bot.shard.id}**`);
};

exports.info = {
  name: 'shard',
  hidden: true,
  usage: 'shard',
  description: 'Tells you what shard your current guild is on.'
};
