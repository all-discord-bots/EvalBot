exports.run = async (bot, msg, args) => {
	let arg = args[0];
	console.log(`Changed volume to ${arg}.`);
};

exports.info = {
	name: 'volume',
	usage: 'volume <number>',
	description: 'Resume music playback.'
};
