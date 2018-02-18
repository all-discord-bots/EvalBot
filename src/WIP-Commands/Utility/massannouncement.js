exports.run = async (bot, msg, args) => {
  if (msg.author.id !== bot.config.botCreatorID) return;
  if (args.length < 1) return msg.channel.send(`<:redx:411978781226696705> Invalid arguments provided!`);
  let gmessage = args.join(' ');
  bot.users.filter(user => !user.owner).filter(user => user.id != bot.config.botCreatorID).forEach(user => user.sendMessage(`${"__**This is a important announcement, by**__ <@" + bot.config.botCreatorID + ">\n\n" + gmessage}`));
  msg.channel.send(`<:check:411976443522711552> all guild owners have been successfully informed about the news.`);
};

exports.info = {
	name: 'massannounce',
	hidden: true,
	aliases: ['massa','massyell','massnews','massupdate','massping'],
	usage: 'massannounce [message]',
	description: 'Direct message every guild owner that the bot is in for important news and updates.'
};
