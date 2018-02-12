exports.run = async (bot, msg) => {
  if (bot.config.nomusic) return;
console.log("stopped playing and left voice channel");
};
exports.info = {
  name: 'leave',
  hidden: `${bot.config.nomusic}`,
  usage: 'leave',
  description: 'Clears the song queue and leaves the channel.'
};
