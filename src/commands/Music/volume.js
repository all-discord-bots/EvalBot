exports.run = async (bot, msg) => {
console.log("changed volume");
};

exports.info = {
  name: 'volume',
  usage: 'volume <number>',
  description: 'Adjust the playback volume between 1 and 200'
};
