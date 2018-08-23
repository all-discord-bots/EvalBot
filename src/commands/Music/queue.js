const { YTSearcher } = require('ytsearcher');
require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	try {
		let i = 0;
		if (!musicqueue[msg.guild.id] || musicqueue[msg.guild.id]['music'].length <= 0) return msg.channel.send(`<:redx:411978781226696705> There are no items in the queue.`).catch(err => console.error);
		let gqueue = musicqueue[msg.guild.id]['music'];
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
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'queue',
	aliases: ['getqueue','musicqueue','songqueue','queuelist','listqueue','queued'],
	usage: 'queue',
	examples: [
		'queue'
	],
	description: 'Shows the current audio queue.'
};



/*const { YTSearcher } = require('ytsearcher');
require('../../conf/globals.js');
exports.run = async (bot, msg) => {
	if (!musicqueue[msg.guild.id] || musicqueue[msg.guild.id].length < 1) return msg.channel.send(`<:redx:411978781226696705> Queue is empty.`).catch(console.error);
	const search = new YTSearcher({
		key: process.env.YOUTUBE_API_KEY,
		revealkey: true
	});
	i = 0;
	let gqueue = musicqueue[msg.guild.id];
	gqueue.map(list => {
		search.search(list.toString(), { type: 'video' }).then(searchResult => {
			let result = searchResult.first;
			let hashtag;
			if (parseInt(i) == 0) {
				hashtag = '# ';
			} else {
				hashtag = '  ';
			}
			msg.channel.send(`\`\`\`md\n${hashtag}[${i}](${result.title})\`\`\``);
			i++;
			if (i == musicqueue[msg.guild.id].length) {
				msg.channel.send(`\`\`\`md\n  [${musicqueue[msg.guild.id].length}](Items in the queue)\`\`\``);
			}
		});
	})
	//}
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
/*
exports.info = {
	name: 'queue',
	aliases: ['getqueue','musicqueue','songqueue','queuelist','listqueue','queued'],
	usage: 'queue',
	description: 'Shows the current queue.'
};
*/
