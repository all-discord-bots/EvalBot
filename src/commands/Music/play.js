exports.run = async (bot, msg, args) => {
	let arg = args.join(' ');
	console.log(`Playing music: ${arg}`);
};

exports.info = {
	name: 'play',
	usage: 'play <search|url>',
	description: 'Play audio from YouTube.'
};
