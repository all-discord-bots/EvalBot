exports.run = async (bot, msg) => {
    console.log("music playing!");
};

exports.info = {
  name: 'play',
  usage: 'play <url>|<search string>',
  description: 'Play a video/music. from (Youtube, Vimeo, YouKo, etc). You can also search using a string.'
};
