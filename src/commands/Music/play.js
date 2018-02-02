exports.run = async (bot, msg, args) => {
  if (args.length < 1) {
    throw 'Please provide a url or search string to play music!';
  } else {
    console.log("music playing...");
  }
};

exports.info = {
  name: 'play',
  usage: 'play <url>|<search string>',
  description: 'Play music with a url or search string'
};
