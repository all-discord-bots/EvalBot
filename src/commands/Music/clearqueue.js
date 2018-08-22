require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	try {
		if (!msg.member.voiceChannel) return msg.channel.send(`<:redx:411978781226696705> You must be in a voice channel!`).catch(err => console.error);
		if (!musicqueue[msg.guild.id]) return msg.channel.send(`<:redx:411978781226696705> Queue is already empty!`).catch(err => console.error);
		musicqueue[msg.guild.id]['loopqueue'] = false;
		musicqueue[msg.guild.id]['loopsong'] = false;
		if (musicqueue[msg.guild.id]['music'].length > 0) {
			musicqueue[msg.guild.id]['music'].splice(0, musicqueue[msg.guild.id]['music'].length);
			msg.channel.send(`<:check:411976443522711552> Queue has been cleared!`);
		} else {
			msg.channel.send(`<:redx:411978781226696705> Queue is already empty!`);
		}
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'clearqueue',
	userPermissions: ['CONNECT'],
	clientPermissions: ['CONNECT'],
	usage: 'clearqueue',
	examples: [
		'clearqueue'
	],
	description: 'Clears the current queue.'
};
