exports.run = async (bot, msg) => {
    if (msg.author.id === "269247101697916939") {
      await msg.edit(':white_check_mark: Shutting down. Bye!');
      process.exit(666);
    }
};

exports.info = {
    name: 'shutdown',
    usage: 'shutdown',
    description: 'Fully shuts the bot down'
};
