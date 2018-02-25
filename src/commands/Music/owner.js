exports.run = async (bot, msg) => {
	if (msg.author.id !== bot.config.botCreatorID) return;
	console.log ('Owner commands executed');
};

exports.info = {
	name: 'owner',
	usage: 'owner',
	hidden: true,
	description: 'Owner commands and functions.'
};
