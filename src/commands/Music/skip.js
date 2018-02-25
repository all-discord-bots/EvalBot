exports.run = async (bot, msg, args) => {
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
};

exports.info = {
	name: 'skip',
	usage: 'skip [number]',
	description: 'Skip a song or multi songs.'
};
