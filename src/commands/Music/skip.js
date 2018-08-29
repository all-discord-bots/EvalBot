require('../../conf/globals.js');
exports.run = async (bot, msg, args) => {
	try {
		if (!msg.member.voiceChannel) return msg.channel.send(`<:redx:411978781226696705> You must be in a voice channel!`).catch(err => console.error);
		const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null || !music_items[msg.guild.id] || music_items[msg.guild.id] && music_items[msg.guild.id].queue.length < 1) return msg.channel.send(`<:redx:411978781226696705> There is no audio being played.`);
		if (!music_items[msg.guild.id] || music_items[msg.guild.id].queue.length <= 0) return msg.channel.send(`<:redx:411978781226696705> There are no audios in the queue to loop!`);
		let skipped, s;
		if (!args[0]) {
			skipped = `1`;
			s = '';
		} else if (args[0]) {
			skipped = args[0];
			s = 's';
		}
		let toSkip = Math.min(parseInt(args[0]), music_items[msg.guild.id].queue.length);
		music_items[msg.guild.id].queue.splice(0, parseInt(toSkip) - 1);
		try {
			const dispatcher = voiceConnection.player.dispatcher;
			if (voiceConnection.paused) dispatcher.resume();
			dispatcher.end();
		} catch (err) {
			return msg.channel.send(`<:redx:411978781226696705> Error occoured!\n\`\`\`\n${err.toString().split(':')[0]}: ${err.toString().split(':')[1]}\n\`\`\``);
		};
		//console.log(`Skipped ${skipped} song${s}.`);
		msg.channel.send(`<:check:411976443522711552> Skipped ${skipped} song${s}.`);
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'skip',
	userPermissions: ['CONNECT'],
	clientPermissions: ['CONNECT'],
	usage: 'skip [number]',
	examples: [
		'skip',
		'skip 2'
	],
	description: 'Skip a song or multi songs.'
};
