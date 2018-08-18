exports.run = async (bot, msg, args) => {
  let user = bot.utils.getMembers(msg,args.join(' '));
  msg.channel.send(`${user}`);
};

exports.info = {
  name: 'testfinduser',
  hidden: true,
  usage: 'testfinduser <user>',
  description: 'Just another test command'
};
