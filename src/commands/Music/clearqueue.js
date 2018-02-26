exports.run = async (bot, msg) => {
	if (msg.author.id !== bot.config.botCreatorID) return;
	console.log('Cleared queue.');
};

exports.info = {
	hidden: true,
	name: 'clearqueue',
	usage: 'clearqueue',
	description: 'Clears the current queue.'
};
