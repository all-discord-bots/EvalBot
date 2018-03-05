require('../../src/conf/globals.js');
exports.run = async (bot, msg) => {
	const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
	if (voiceConnection === null) return msg.channel.send(`No music is being played.`).catch(console.error);
	const looping = musicqueue[msg.guild.id]['looped'];
	if (!musicqueue[msg.guild.id]['looped']) {
		musicqueue[msg.guild.id]['looped'] = true;
		return msg.channel.send(`Looping enabled! :repeat_one:`);
	} else if (musicqueue[msg.guild.id]['looped']) {
		musicqueue[msg.guild.id]['looped'] = false;
		return msg.channel.send(`Looping disabled! :arrow_forward:`);
	}
};

exports.info = {
	name: 'loop',
	aliases: ['loopqueue'],
	usage: 'loop',
	description: 'Changes the loop state.'
};
