exports.run = async (bot, msg) => {
	if (msg.author.id !== bot.config.botCreatorID) return;
	console.log('Executed queue commands.');
};

exports.info = {
	hidden: true,
	name: 'queue',
	usage: 'queue',
	description: 'Shows the current queue.'
};
