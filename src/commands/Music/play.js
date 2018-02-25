exports.run = async (bot, msg, args) => {
	let arg = args.join(' ');
	if (arg.length < 1) return msg.channel.send(`<:redx:411978781226696705> Please provide a search string or url.`).catch(console.error);
};

exports.info = {
	name: 'play',
	usage: 'play <search|url>',
	description: 'Play audio from YouTube.'
};
