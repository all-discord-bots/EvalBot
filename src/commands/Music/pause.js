require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	try {
		const voice_channel = msg.member.voice.channel;
		const voice_connection = msg.guild.voice ? msg.guild.voice.connection : null;
		if (!voice_channel) return msg.channel.send('<:redx:411978781226696705> You must be in a voice channel!');
		if (!voice_connection) return msg.channel.send('<:redx:411978781226696705> No audio is being played');
		let fetched_queue = music_items[msg.guild.id];
		if (!fetched_queue) return msg.channel.send('<:redx:411978781226696705> There is no audios in the queue playing!');
		if (fetched_queue.is_streaming) return msg.channel.send('<:redx:411978781226696705> Streams cannot be paused.');
		if (voice_connection.dispatcher) {
			if (voice_connection.dispatcher.paused) return msg.channel.send('<:redx:411978781226696705> Playback already paused!');
			try {
				voice_connection.dispatcher.pause();
				msg.channel.send('<:check:411976443522711552> Playback paused.');
			} catch (e) {
				msg.channel.send('<:redx:411978781226696705> Failed to pause playback.');
			}
		}
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'pause',
	allowDM: false,
	userPermissions: ['CONNECT'],
	clientPermissions: ['CONNECT'],
	usage: 'pause',
	examples: [
		'pause'
	],
	description: 'Pause audio playback.'
};
