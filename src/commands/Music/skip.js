exports.run = async (bot, msg) => {
  if (msg.author.id !== bot.config.botCreatorID) return;
  console.log("song skipped");
};

exports.info = {
  name: 'skip',
  hidden: true,
  usage: 'skip <number>',
  description: 'Skip song number of songs. Skips 1 song if a number is not specified.'
};
