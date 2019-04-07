require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	try {
		//if (!msg.member.voiceChannel) return msg.channel.send('<:redx:411978781226696705> You must be in a voice channel!');
		if (msg.guild.voiceConnection === null) return msg.channel.send('<:redx:411978781226696705> There is no audio being played.');
		//if (!fetched_queue || fetched_queue.queue.length <= 0) return msg.channel.send('<:redx:411978781226696705> There are no audios in the queue to stop!').catch((err) => console.error);
		let fetched_queue = music_items[msg.guild.id];
		fetched_queue.loop = false;
		fetched_queue.repeat = false;
		fetched_queue.playback_duration = '';
		try {
			if (fetched_queue.queue && fetched_queue.queue.length > 0) fetched_queue.queue.splice(0, fetched_queue.queue.length);
			if (msg.guild.voiceConnection !== null) return msg.guild.voiceConnection.disconnect();
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
	guildOnly: true,
	userPermissions: ['CONNECT'],
	clientPermissions: ['CONNECT'],
	aliases: ['leave'],
	usage: 'stop',
	examples: [
		'stop'
	],
	description: 'Makes the bot leave the voice channel and clear the queue.'
};
