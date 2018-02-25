exports.run = async (bot, msg, args) => {
	let arg = args.join(' ');
	if (!arg) return;
	console.log(`Searching for song: '${arg}'`);
};

exports.info = {
	name: 'search',
	usage: 'search <string>',
	description: 'Searches for up to 10 results.'
};
