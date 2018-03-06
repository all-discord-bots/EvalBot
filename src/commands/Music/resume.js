exports.run = async (bot, msg) => {
	const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
	if (voiceConnection === null) return msg.channel.send(`<:redx:411978781226696705> No music is being played`).catch(console.error);
	const dispatcher = voiceConnection.player.dispatcher;
	if (!dispatcher) return msg.channel.send(`<:redx:411978781226696705> Playback is not paused!`).catch(console.error);
	if (!dispatcher.paused) return msg.channel.send(`<:redx:411978781226696705> Playback is not paused!`).catch(console.error);
	if (dispatcher.paused) {
		dispatcher.resume();
		msg.channel.send(`<:check:411976443522711552> Playback resumed.`);
	}
};

exports.info = {
	name: 'resume',
	usage: 'resume',
	description: 'Resume music playback.'
};
