exports.run = async (bot, msg) => {
	const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
	const dispatcher = voiceConnection.player.dispatcher;
	if (dispatcher.paused) return msg.channel.send(`<:redx:411978781226696705> Music already paused!`).catch(console.error);
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
