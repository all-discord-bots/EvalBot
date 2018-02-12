exports.run = async (bot, msg) => {
  if (msg.author.id !== bot.config.botCreatorID) return;
  console.log("view queue");
};
exports.info = {
  name: 'queue',
  hidden: true,
  usage: 'queue',
  description: 'Display the current queue.'
};
