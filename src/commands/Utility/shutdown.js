exports.run = async (bot, msg, args) => {
	try {
		(await msg.channel.send("Shutting down...").then((msg) => {
			msg.edit(`<:check:411976443522711552> Shutting down. Bye!`);
		}));
		bot.shutdown(false);
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'shutdown',
	ownerOnly: true,
	hidden: true,
	usage: 'shutdown',
	examples: [
		'shutdown'
	],
	description: 'Fully shuts the bot down'
};
