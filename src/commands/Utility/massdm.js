exports.run = async (bot, msg, args) => {
	if (msg.author.id !== bot.config.botCreatorID) {
		if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.channel.send(`<:redx:411978781226696705> You are missing the permissions \`Administrator\`!`);
		}
		if (args.length < 1) return msg.channel.send(`<:redx:411978781226696705> Invalid arguments provided!`);
		let gmessage = args.join(' ');
		msg.guild.members.filter(user => user.user.username != msg.author.username).filter(user => user.user.id != bot.config.botCreatorID).forEach(user => user.sendMessage(`${gmessage}`));
		msg.channel.send(`<:check:411976443522711552> everyone has been successfully direct messaged.`);
};

exports.info = {
	name: 'massdm',
	aliases: ['mdm','massdirectmessage','masspm','massprivatemessage','mpm'],
	usage: 'massdm [message]',
	description: 'Message everyone in the server, except the user that invoked the command.'
};
