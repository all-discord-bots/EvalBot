require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	try {
		if (!msg.member.voice.channel) return msg.channel.send(`<:redx:411978781226696705> You must be in a voice channel!`);
		if (!msg.guild.voiceConnection) return msg.channel.send(`<:redx:411978781226696705> No audio is being played`);
		if (!music_items[msg.guild.id]) return msg.channel.send(`<:redx:411978781226696705> There is no audios in the queue playing!`);
		if (music_items[msg.guild.id].is_streaming) return msg.channel.send(`<:redx:411978781226696705> Streams cannot be paused.`);
		if (msg.guild.voiceConnection.player.dispatcher) {
			if (!msg.guild.voiceConnection.player.dispatcher.pause) return msg.channel.send(`<:redx:411978781226696705> Playback already paused!`);
			msg.guild.voiceConnection.player.dispatcher.pause();
			msg.channel.send(`<:check:411976443522711552> Playback paused.`);
		}
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'pause',
	userPermissions: ['CONNECT'],
	clientPermissions: ['CONNECT'],
	usage: 'pause',
	examples: [
		'pause'
	],
	description: 'Pause audio playback.'
};
