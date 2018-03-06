require('../../conf/globals.js');
exports.run = async (bot, msg) => {
	const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
	if (voiceConnection === null) return msg.channel.send(`<:redx:411978781226696705> No music is being played`).catch(console.error);
	if (musicqueue[msg.guild.id]['streaming']) return msg.channel.send(`<:redx:411978781226696705> Streams cannot be paused.`);
	const dispatcher = voiceConnection.player.dispatcher;
	if (dispatcher && dispatcher.paused) return msg.channel.send(`<:redx:411978781226696705> Playback already paused!`).catch(console.error);
	if (!dispatcher.paused) {
		dispatcher.pause();
		msg.channel.send(`<:check:411976443522711552> Playback paused.`);
	}
};

exports.info = {
	name: 'pause',
	usage: 'pause',
	description: 'Pause music playback.'
};
