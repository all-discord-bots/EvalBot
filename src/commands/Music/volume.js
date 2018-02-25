exports.run = async (bot, msg, args) => {
	let newvolume;
	if (!args[0] || args[0] < 1) {
		newvolume = '0';
	} else if (args[0]) {
		newvolume = args[0];
	}
	console.log(`Changed volume to ${newvolume}.`);
};

exports.info = {
	name: 'volume',
	usage: 'volume <number>',
	description: 'Adjusts the volume of the bot.'
};
