exports.run = async (bot, msg, args) => {
	msg.channel.send({ embed: bot.utils.embed('', `${args.join(" ")}`) });
};

exports.info = {
	name: 'embed',
	description: 'Embeds some text.',
	usage: 'embed <text>'
};
