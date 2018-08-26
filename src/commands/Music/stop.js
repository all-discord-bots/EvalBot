require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	try {
		if (!msg.member.voiceChannel) return msg.channel.send(`<:redx:411978781226696705> You must be in a voice channel!`).catch((err) => console.error);
		const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send(`<:redx:411978781226696705> There is no audio being played.`).catch((err) => console.error);
		//if (!musicqueue[msg.guild.id] || musicqueue[msg.guild.id]['music'].length <= 0) return msg.channel.send(`<:redx:411978781226696705> There are no audios in the queue to stop!`).catch(err => console.error);
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
	userPermissions: ['CONNECT'],
	clientPermissions: ['CONNECT'],
	aliases: ['leave'],
	usage: 'stop',
	examples: [
		'stop'
	],
	description: 'Makes the bot leave the voice channel and clear the queue.'
};
