exports.run = async (bot, msg) => {
  if (msg.author.id !== bot.config.botCreatorID) return;
  console.log("paused song");
};

exports.info = {
  name: 'pause',
  hidden: true,
  usage: 'pause',
  description: 'Pause music playback.'
};
