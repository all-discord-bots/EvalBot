require('../../conf/globals.js');
exports.run = async (bot, msg, args) => {
	try {
		const voice_channel = msg.member.voice.channel;
		const voice_connection = msg.guild.voice.connection;
		if (!voice_channel) return msg.channel.send('<:redx:411978781226696705> You must be in a voice channel!').catch((err) => console.error);
		let fetched_queue = music_items[msg.guild.id];
		if ((!voice_connection || !fetched_queue) || (fetched_queue && fetched_queue.queue.length < 1)) return msg.channel.send('<:redx:411978781226696705> There is no audio being played.');
		//if (!fetched_queue || fetched_queue.queue.length <= 0) return msg.channel.send('<:redx:411978781226696705> There are no audios in the queue to loop!');
		let [skipped, s] = !args[0] ? ['1', ''] : [args[0], 's'];
		let toSkip = Math.min(parseInt(args[0]), fetched_queue.queue.length);
		fetched_queue.queue.splice(0, parseInt(toSkip) - 1);
		try {
			if (voice_connection && voice_connection.paused) voice_connection.player.dispatcher.resume();
			voice_connection.player.dispatcher.end();
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
	allowDM: false,
	userPermissions: ['CONNECT'],
	clientPermissions: ['CONNECT'],
	usage: 'skip [number]',
	examples: [
		'skip',
		'skip 2'
	],
	description: 'Skip one or more tracks.'
};
