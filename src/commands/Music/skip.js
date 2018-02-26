exports.run = async (bot, msg, args) => {
	if (msg.author.id !== bot.config.botCreatorID) return;
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
	hidden: true,
	name: 'skip',
	usage: 'skip [number]',
	description: 'Skip a song or multi songs.'
};
