exports.run = async (bot, msg) => {
	if (msg.author.id !== bot.config.botCreatorID) return;
	console.log('Paused Song.');
};

exports.info = {
	hidden: true,
	name: 'pause',
	usage: 'pause',
	description: 'Pause music playback.'
};
