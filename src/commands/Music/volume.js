exports.run = async (bot, msg) => {
console.log("changed volume");
};
let hide;
if (!bot.config.usemusic) {
  hide = true;
} else {
  hide = false;
}
exports.info = {
  name: 'volume',
  hidden: `${hide}`,
  usage: 'volume <number>',
  description: 'Adjust the playback volume between 1 and 200'
};
