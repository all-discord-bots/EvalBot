exports.run = async (bot, msg) => {
console.log("stopped playing and left voice channel");
};
let hide;
if (!bot.config.usemusic) {
  hide = true;
} else {
  hide = false;
}
exports.info = {
  name: 'leave',
  hidden: `${hide}`,
  usage: 'leave',
  description: 'Clears the song queue and leaves the channel.'
};
