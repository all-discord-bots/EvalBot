exports.run = async (bot, msg) => {
  if (msg.author.id !== bot.config.botCreatorID) return;
  console.log("stopped playing and left voice channel");
};
exports.info = {
  name: 'leave',
  hidden: true,
  usage: 'leave',
  description: 'Clears the song queue and leaves the channel.'
};
