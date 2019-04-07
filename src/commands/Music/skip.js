require('../../conf/globals.js');
exports.run = async (bot, msg, args) => {
	try {
		if (!msg.member.voice.channel) return msg.channel.send('<:redx:411978781226696705> You must be in a voice channel!').catch((err) => console.error);
		let fetched_queue = music_items[msg.guild.id];
		if ((msg.guild.voiceConnection === null || !fetched_queue) || (fetched_queue && fetched_queue.queue.length < 1)) return msg.channel.send('<:redx:411978781226696705> There is no audio being played.');
		//if (!fetched_queue || fetched_queue.queue.length <= 0) return msg.channel.send('<:redx:411978781226696705> There are no audios in the queue to loop!');
		let [skipped, s] = !args[0] ? ['1', ''] : [args[0], 's'];
		let toSkip = Math.min(parseInt(args[0]), fetched_queue.queue.length);
		fetched_queue.queue.splice(0, parseInt(toSkip) - 1);
		try {
			if (msg.guild.voiceConnection && msg.guild.voiceConnection.paused) msg.guild.voiceConnection.player.dispatcher.resume();
			msg.guild.voiceConnection.player.dispatcher.end();
			msg.channel.send(`<:check:411976443522711552> Skipped ${skipped} tracks${s}.`);
		} catch (err) {
			msg.channel.send(`<:redx:411978781226696705> Error occurred!\n\`\`\`\n${err.toString().split(':')[0]}: ${err.toString().split(':')[1]}\n\`\`\``);
		}
		//console.log(`Skipped ${skipped} song${s}.`);
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'skip',
	guildOnly: true,
	userPermissions: ['CONNECT'],
	clientPermissions: ['CONNECT'],
	usage: 'skip [number]',
	examples: [
		'skip',
		'skip 2'
	],
	description: 'Skip one or more tracks.'
};
