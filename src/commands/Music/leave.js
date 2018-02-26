exports.run = async (bot, msg) => {
	const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
	if (voiceConnection !== null) return voiceConnection.disconnect();
};

exports.info = {
	name: 'leave',
	usage: 'leave',
	description: 'Leave and clear the queue.'
};
