require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	try {
		if (!msg.member.voiceChannel) return msg.channel.send(`<:redx:411978781226696705> You must be in a voice channel!`);
		const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send(`<:redx:411978781226696705> There is no audio being played.`);
		//if (!music_items[msg.guild.id] || music_items[msg.guild.id].queue.length <= 0) return msg.channel.send(`<:redx:411978781226696705> There are no audios in the queue to stop!`).catch(err => console.error);
		music_items[msg.guild.id].loop_queue = false;
		music_items[msg.guild.id].loop_song = false;
		if (music_items[msg.guild.id].queue && music_items[msg.guild.id].queue.length > 0) {
			music_items[msg.guild.id].queue.splice(0, music_items[msg.guild.id].queue.length);
		}
		msg.channel.send(`<:check:411976443522711552> Successfully disconnected from voice channel!`);
		if (voiceConnection !== null) return voiceConnection.disconnect();
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'stop',
	userPermissions: ['CONNECT'],
	clientPermissions: ['CONNECT'],
	aliases: ['leave'],
	usage: 'stop',
	examples: [
		'stop'
	],
	description: 'Makes the bot leave the voice channel and clear the queue.'
};
