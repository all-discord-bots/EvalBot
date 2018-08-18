exports.run = async (bot, msg, args) => {
  msg.channel.send(`${bot.utils.getMembers(msg,args.join(' '))}`);
};

exports.info = {
  name: 'testfinduser',
  hidden: true,
  usage: 'testfinduser <user>',
  description: 'Just another test command'
};
