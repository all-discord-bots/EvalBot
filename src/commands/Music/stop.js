require('../../conf/globals.js');
exports.run = async (bot, msg) => {
	try {
		const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send(`<:redx:411978781226696705> There is no audio being played.`).catch(err => console.error);
		musicqueue[msg.guild.id]['loopqueue'] = false;
		musicqueue[msg.guild.id]['loopsong'] = false;
		if (musicqueue[msg.guild.id]['music'] && musicqueue[msg.guild.id]['music'].length > 0) {
			musicqueue[msg.guild.id]['music'].splice(0, musicqueue[msg.guild.id]['music'].length);
		}
		msg.channel.send(`<:check:411976443522711552> Successfully disconnected from voice channel!`);
		if (voiceConnection !== null) return voiceConnection.disconnect();
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'stop',
	clientPermissions: ['CONNECT'],
	aliases: ['leave'],
	usage: 'stop',
	description: 'Leave and clear the queue.'
};
