require('../../conf/globals.js');
exports.run = async (bot, msg) => {
	if (!musicqueue[msg.guild.id]) return msg.channel.send(`<:redx:411978781226696705> Queue is empty.`).catch(console.error);
	let i = 0;
	let gqueue = musicqueue[msg.guild.id];
	gqueue.map(list => msg.channel.send(`\`\`\`${i++} - ${list.toString()}\n\`\`\``));
};

exports.info = {
	name: 'queue',
	usage: 'queue',
	description: 'Shows the current queue.'
};
