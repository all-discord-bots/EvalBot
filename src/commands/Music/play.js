exports.run = async (bot, msg) => {
    if (msg.author.id !== bot.config.botCreatorID) return;
    console.log("music playing!");
};

exports.info = {
  name: 'play',
  hidden: true,,
  usage: 'play <url>|<search string>',
  description: 'Play a video/music. from (Youtube, Vimeo, YouKo, etc). You can also search using a string.'
};
