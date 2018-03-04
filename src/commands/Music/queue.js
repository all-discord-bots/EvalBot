const { YTSearcher } = require('ytsearcher');
require('../../conf/globals.js');
exports.run = async (bot, msg) => {
	if (!musicqueue[msg.guild.id] || musicqueue[msg.guild.id].length < 1) return msg.channel.send(`<:redx:411978781226696705> Queue is empty.`).catch(console.error);
	const search = new YTSearcher({
		key: process.env.YOUTUBE_API_KEY,
		revealkey: true
	});
	i = 0;
	search.search(musicqueue[msg.guild.id][i], { type: 'video' }).then(searchResult => {
		let result = searchResult.first;
		let gqueue = "";
		while (parseInt(i) < musicqueue[msg.guild.id].length) {
			let hashtag;
			if (parseInt(i) == 0) {
				hashtag = '# ';
			} else {
				hashtag = '  ';
			}
			//gqueue += `${hashtag}${i} - ${musicqueue[msg.guild.id][i]}\n`;
			gqueue += `${hashtag}[${i}](${result.title})\n`;
			i++;
		}
		msg.channel.send(`\`\`\`md\n${gqueue.toString()}\n\n  [${musicqueue[msg.guild.id].length}](Items in the queue)\`\`\``);
	});
};

/*	msg.channel.send(`${count}`);
	let gqueue = musicqueue[msg.guild.id];
	gqueue.map(list => {
		let hashtag;
		if (i == 0){
			hashtag = '# ';
		} else {
			hashtag = '  ';
		}
		msg.channel.send(`\`\`\`md\n${hashtag}${i} - ${list.toString()}\n\`\`\``);
		i++;
	});
};
*/

exports.info = {
	name: 'queue',
	aliases: ['getqueue','musicqueue','songqueue','queuelist','listqueue','queued'],
	usage: 'queue',
	description: 'Shows the current queue.'
};
