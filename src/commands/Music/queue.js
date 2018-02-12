exports.run = async (bot, msg) => {
console.log("view queue");
};
let hide;
if (!bot.config.usemusic) {
  hide = true;
} else {
  hide = false;
}
exports.info = {
  name: 'queue',
  hidden: `${hide}`,
  usage: 'queue',
  description: 'Display the current queue.'
};
