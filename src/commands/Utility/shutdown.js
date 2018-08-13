exports.run = async (bot, msg) => {
	if (msg.author.id !== bot.config.botCreatorID) return;
	(await msg.channel.send("Shutting down...").then((msg) => {
		msg.edit(`<:check:411976443522711552> Shutting down. Bye!`);
	}));
	bot.shutdown(false);
};

exports.info = {
	name: 'shutdown',
	hidden: true,
	usage: 'shutdown',
	description: 'Fully shuts the bot down'
};
