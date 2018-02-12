exports.run = async (bot, msg) => {
  if (msg.author.id !== bot.config.botCreatorID) return;
  console.log("resumed song");
};

exports.info = {
  name: 'resume',
  hidden: true,
  usage: 'resume',
  description: 'Resume music playback.'
};
