exports.run = async (bot, msg) => {
	if (msg.author.id !== bot.config.botCreatorID) return;
	console.log('Looping song');
};

exports.info = {
	hidden: true,
	name: 'loop',
	usage: 'loop',
	description: 'Changes the loop state.'
};
