exports.run = async (bot, msg, args) => {
	//let arg = args.join(' ');
	let skipped;
	let s;
	if (!args[0]) {
		skipped = '1';
		s = '';
	} else if (args[0]) {
		skipped = args[0];
		s = 's';
	}
	console.log(`Skipped ${skipped} song${s}.`);
	//if (args[0] < 1) return msg.channel.send(`<:redx:411978781226696705> Invalid number to skip.`).catch(console.error);
};

exports.info = {
	name: 'skip',
	usage: 'skip [number]',
	description: 'Skip a song or multi songs.'
};
