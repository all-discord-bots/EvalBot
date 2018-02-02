exports.run = async (bot, msg) => {
console.log("song skipped");
};

exports.info = {
  name: 'skip',
  usage: 'skip <number>',
  description: 'Skip song number of songs. Skips 1 song if a number is not specified.'
};
