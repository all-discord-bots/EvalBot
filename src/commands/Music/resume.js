exports.run = async (bot, msg, args) => {
	try {
		if (!msg.member.voice.channel) return msg.channel.send('<:redx:411978781226696705> You must be in a voice channel!');
		if (msg.guild.voiceConnection === null) return msg.channel.send('<:redx:411978781226696705> No music is being played');
		let fetched_queue = music_items[msg.guild.id];
		if (!fetched_queue || fetched_queue.queue.length <= 0) return msg.channel.send('<:redx:411978781226696705> There are no audios in the queue to resume!');
		if ((!msg.guild.voiceConnection.player.dispatcher) || (msg.guild.voiceConnection.player.dispatcher && !msg.guild.voiceConnection.player.dispatcher.paused)) return msg.channel.send('<:redx:411978781226696705> Playback is not paused!');
		try {
			msg.guild.voiceConnection.player.dispatcher.resume();
			msg.channel.send('<:check:411976443522711552> Playback resumed.');
		} catch (e) {
			msg.channel.send('<:redx:411978781226696705> Failed to resume playback.');
		}
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'resume',
	allowDM: false,
	userPermissions: ['CONNECT'],
	clientPermissions: ['CONNECT'],
	usage: 'resume',
	examples: [
		'resume'
	],
	description: 'Resume audio playback.'
};
