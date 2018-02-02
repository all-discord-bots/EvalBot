exports.run = async (bot, msg) => {
console.log("stopped playing and left voice channel");
};

exports.info = {
  name: 'leave',
  usage: 'leave',
  description: 'Clears the song queue and leaves the channel.'
};
