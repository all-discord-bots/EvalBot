exports.run = async (bot, msg, args) => {
	if (msg.author.id !== bot.config.botCreatorID) return;
	if (args.length < 1) return;
	console.log('Executed the \'Set\' command');
};

exports.info = {
	name: 'set',
	usage: 'set <option> <new value>',
	hidden: true,
	description: 'Changes settings for the server. Use without specifing a setting to see valid settings.'
};
