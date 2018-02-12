exports.run = async (bot, msg) => {
  if (msg.author.id !== bot.config.botCreatorID) return;
  console.log("cleared song queue");
};

exports.info = {
  name: 'clearqueue',
  hidden: true,
  usage: 'clearqueue',
  description: 'Clears the song queue.'
};
