exports.run = async (bot, msg) => {
    console.log("music playing!");
};
let hide;
if (!bot.config.usemusic) {
  hide = true;
} else {
  hide = false;
}
exports.info = {
  name: 'play',
  hidden: `${hide}`,
  usage: 'play <url>|<search string>',
  description: 'Play a video/music. from (Youtube, Vimeo, YouKo, etc). You can also search using a string.'
};
