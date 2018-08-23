exports.run = async (bot, msg, args) => {
	try {
		if (!msg.member.voiceChannel) return msg.channel.send(`<:redx:411978781226696705> You must be in a voice channel!`).catch(err => console.error);
		const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send(`<:redx:411978781226696705> No music is being played`).catch(err => console.error);
		if (!musicqueue[msg.guild.id] || musicqueue[msg.guild.id]['music'].length <= 0) return msg.channel.send(`<:redx:411978781226696705> There are no audios in the queue to resume!`).catch(err => console.error);
		const dispatcher = voiceConnection.player.dispatcher;
		if (!dispatcher) return msg.channel.send(`<:redx:411978781226696705> Playback is not paused!`).catch(err => console.error);
		switch (dispatcher.paused) {
			case true:
				dispatcher.resume();
				msg.channel.send(`<:check:411976443522711552> Playback resumed.`).catch(err => console.error);
				break;
			default:
				msg.channel.send(`<:redx:411978781226696705> Playback is not paused!`).catch(err => console.error);
				break;
		}
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'resume',
	userPermissions: ['CONNECT'],
	clientPermissions: ['CONNECT'],
	usage: 'resume',
	examples: [
		'resume'
	],
	description: 'Resume audio playback.'
};
