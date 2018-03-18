exports.run = async (bot, msg, args) => {
	let desc;
	//let argzero = args[0].join(' ');
	let arg = args.join(' ');
	if (arg.length > 0) {
		desc = `${arg.toString()}`;
	} else {
		desc = ` `;
	}
	//let gchannel;
	//if (!msg.guild.channel.find(`id`, `${args[0].toString()}`)) {
	//	gchannel = msg.channel.send(
	//}
	msg.channel.send({embed: ({
		desc,
		timestamp: new Date()
	})});
};

exports.info = {
	name: 'say',
	description: 'Tell the bot to say something',
	usage: 'say [channel] <message>'
};
