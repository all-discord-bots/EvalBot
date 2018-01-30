exports.run = async (bot, msg) => {
    if (msg.author.id === "269247101697916939") {
      await msg.edit(':white_check_mark: Restarting all shards.');
      process.exit(42);
    }
};

exports.info = {
    name: 'restart',
    usage: 'restart',
    description: 'Restarts all shards'
};
