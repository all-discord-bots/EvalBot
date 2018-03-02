require('../../../src/commands/Music/play.js');
exports.run = async (bot, msg) => {
	let i = 0;
	let queue = musicqueue.map(a => a.toString());
	 msg.channel.send(`\`\`\`${i++} - ${queue}\n\`\`\``);
};

exports.info = {
	hidden: true,
	name: 'queue',
	usage: 'queue',
	description: 'Shows the current queue.'
};
