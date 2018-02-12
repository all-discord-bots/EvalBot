exports.run = async (bot, msg) => {
console.log("paused song");
};
let hide;
if (!bot.config.usemusic) {
  hide = true;
} else {
  hide = false;
}
exports.info = {
  name: 'pause',
  hidden: `${hide}`,
  usage: 'pause',
  description: 'Pause music playback.'
};
