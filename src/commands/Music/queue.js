require('../../src/conf/globals.js');
exports.run = async (bot, msg) => {
	if (musicqueue[msg.guild.id].length < 1) return msg.channel.send(`<:redx:411978781226696705> Queue is empty.`).catch(console.error);
	let i = 0;
	let queue = musicqueue[msg.guild.id].map(a => a.toString());
	msg.channel.send(`\`\`\`${i++} - ${queue}\n\`\`\``);
};

exports.info = {
	name: 'queue',
	usage: 'queue',
	description: 'Shows the current queue.'
};
