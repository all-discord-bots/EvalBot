exports.run = async (bot, msg) => {
console.log("resumed song");
};
let hide;
if (!bot.config.usemusic) {
  hide = true;
} else {
  hide = false;
}
exports.info = {
  name: 'resume',
  hidden: `${hide}`,
  usage: 'resume',
  description: 'Resume music playback.'
};
