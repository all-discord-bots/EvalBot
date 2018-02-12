exports.run = async (bot, msg) => {
  if (msg.author.id !== bot.config.botCreatorID) return;
  console.log("changed volume");
};

exports.info = {
  name: 'volume',
  hidden: true,
  usage: 'volume <number>',
  description: 'Adjust the playback volume between 1 and 200'
};
