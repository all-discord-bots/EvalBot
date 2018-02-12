exports.run = async (bot, msg) => {
console.log("cleared song queue");
};
let hide;
if (!bot.config.usemusic) {
  hide = true;
} else {
  hide = false;
}
exports.info = {
  name: 'clearqueue',
  hidden: hide,
  usage: 'clearqueue',
  description: 'Clears the song queue.'
};
