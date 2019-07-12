require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	try {
		const voice_connection = msg.guild.voice.connection;
		//if (!msg.member.voiceChannel) return msg.channel.send('<:redx:411978781226696705> You must be in a voice channel!');
		if (!voice_connection) return msg.channel.send('<:redx:411978781226696705> There is no audio being played.');
		//if (!fetched_queue || fetched_queue.queue.length <= 0) return msg.channel.send('<:redx:411978781226696705> There are no audios in the queue to stop!').catch((err) => console.error);
		let fetched_queue = music_items[msg.guild.id];
		fetched_queue.loop = false;
		fetched_queue.repeat = false;
		fetched_queue.playback_duration = '';
		fetched_queue.queue_position = 0;
		try {
			if (fetched_queue.queue && fetched_queue.queue.length > 0) fetched_queue.queue.splice(0, fetched_queue.queue.length);
			if (voice_connection) return voice_connection.disconnect();
			msg.channel.send('<:check:411976443522711552> Successfully disconnected from voice channel!');
		} catch (e) {
			msg.channel.send('<:redx:411978781226696705> Failed to disconnected from voice channel!');
		}
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'stop',
	allowDM: false,
	userPermissions: ['CONNECT'],
	clientPermissions: ['CONNECT'],
	aliases: ['leave','disconnect'],
	usage: 'stop',
	examples: [
		'stop'
	],
	description: 'Makes the bot leave the voice channel and clear the queue.'
};
