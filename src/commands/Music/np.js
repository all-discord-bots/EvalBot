exports.run = async (bot, msg) => {
	if (msg.author.id !== bot.config.botCreatorID) return;
	console.log('Now Playing command executed.');
};

exports.info = {
	hidden: true,
	name: 'np',
	usage: 'np',
	description: 'Shows the currently playing song.'
};
