exports.run = async (bot, msg) => {
	if (msg.author.id !== bot.config.botCreatorID) return;
	console.log('Resumed song.');
};

exports.info = {
	hidden: true,
	name: 'resume',
	usage: 'resume',
	description: 'Resume music playback.'
};
