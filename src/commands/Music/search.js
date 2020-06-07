exports.run = async (bot, msg, args) => {
	if (msg.author.id !== bot.config.botCreatorID) return;
	let arg = args.join(' ');
	if (!arg) return;
	console.log(`Searching for song: '${arg}'`);
};

exports.info = {
	hidden: true,
	name: 'search',
	usage: 'search <string>',
	description: 'Searches for up to 10 results.'
};
