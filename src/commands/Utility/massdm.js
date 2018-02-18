exports.run = async (bot, msg, args) => {
	let hide;
	if (msg.author.id !== bot.config.botCreatorID || msg.author.id !== "275314045702373377") {
		hide = true;
		return;
	} else {
		hide = false;
	}
	//if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.channel.send(`<:redx:411978781226696705> You are missing the permissions \`Administrator\`!`);
	if (args.length < 1) return msg.channel.send(`<:redx:411978781226696705> Invalid arguments provided!`);
	let gmessage = args.join(' ');
	msg.guild.members.filter(user => user.user.username !== msg.author.username).filter(user => user.user.id !== bot.config.botCreatorID).forEach(user => user.sendMessage(`${gmessage}`));
	msg.channel.send(`<:check:411976443522711552> successfully sent announcement to everyones direct messages.`);
};

exports.info = {
	name: 'massdm',
	hidden: this.hide,
	aliases: ['mdm','massdirectmessage','masspm','massprivatemessage','mpm'],
	usage: 'massdm [message]',
	description: 'Message everyone in the server, except the user that invoked the command. This command is used for major announcements.'
};
