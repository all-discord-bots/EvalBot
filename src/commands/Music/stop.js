require('../../conf/globals.js');
exports.run = async (bot, msg) => {
	const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
	if (voiceConnection === null) return msg.channel.send(`<:redx:411978781226696705> No music is being played.`).catch(console.error);
	if (musicqueue[msg.guild.id]['music'] && musicqueue[msg.guild.id]['music'].length > 0) {
		musicqueue[msg.guild.id]['music'].splice(0, musicqueue[msg.guild.id]['music'].length);
	}
	if (voiceConnection !== null) return voiceConnection.disconnect();
	msg.channel.send(`<:check:411976443522711552> Successfully disconnected from voice channel!`);
	
};

exports.info = {
	name: 'stop',
	aliases: ['leave'],
	usage: 'stop',
	description: 'Leave and clear the queue.'
};
