exports.run = async (bot, msg) => {
  if (bot.config.nomusic) return;
console.log("cleared song queue");
};

exports.info = {
  name: 'clearqueue',
  hidden: `${bot.config.nomusic}`,
  usage: 'clearqueue',
  description: 'Clears the song queue.'
};
