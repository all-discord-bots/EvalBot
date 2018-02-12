exports.run = async (bot, msg) => {
console.log("song skipped");
};
let hide;
if (!bot.config.usemusic) {
  hide = true;
} else {
  hide = false;
}
exports.info = {
  name: 'skip',
  hidden: `${hide}`,
  usage: 'skip <number>',
  description: 'Skip song number of songs. Skips 1 song if a number is not specified.'
};
