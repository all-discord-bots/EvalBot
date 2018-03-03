require('../../conf/globals.js');
exports.run = async (bot, msg) => {
	if (musicqueue[msg.guild.id].length < 1 || !musicqueue[msg.guild.id]) return msg.channel.send(`<:redx:411978781226696705> Queue is empty.`).catch(console.error);
	let i = 0;
	let gqueue = musicqueue[msg.guild.id];
	gqueue.map(list => {
		let hashtag;
		if (i == 0){
			hashtag = '# ';
		} else {
			hashtag = '';
		}
		msg.channel.send(`\`\`\`md\n${hashtag}${i} - ${list.toString()}\n\`\`\``);
		i++;
	});
};

exports.info = {
	name: 'queue',
	usage: 'queue',
	description: 'Shows the current queue.'
};
