exports.run = async (bot, msg, args) => {
	(await msg.channel.send(`<:check:411976443522711552> Restarting bot...`).then((msg) => {
		msg.edit(`<:check:411976443522711552> Successfully restarted bot.`);
	}));
	bot.shutdown(true);
};

exports.info = {
	name: 'restart',
	hidden: true,
	ownerOnly: true,
	usage: 'restart',
	examples: [
		'restart'
	],
	description: 'Restarts the bot.'
};
