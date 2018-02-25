exports.run = async (bot, msg) => {
	console.log('Bot left voice channel.');
};

exports.info = {
	name: 'leave',
	usage: 'leave',
	hidden: true, // because this command is broken atm
	description: 'Leave and clear the queue.'
};
