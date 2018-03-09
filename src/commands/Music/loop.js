require('../../conf/globals.js');
exports.run = async (bot, msg, args) => {
	const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
	if (voiceConnection === null) return msg.channel.send(`<:redx:411978781226696705> There is no audio being played.`).catch(console.error);
	let arg = args.join(' ');
	if (arg === 'song' || arg === 'current' || arg === 'this' || arg === 'one' || arg === 'repeat') {
		if (musicqueue['msg.guild.id'] && !musicqueue['msg.guild.id']['loopone']) {
			musicqueue[msg.guild.id]['loopone'] = true;
			musicqueue[msg.guild.id]['looped'] = false;
			return msg.channnel.send(`Song Looping enabled! :repeat_one:`);
		} else if (musicqueue[msg.guild.id] && musicqueue['msg.guild.id']['loopone']) {
			musicqueue['msg.guild.id']['loopone'] = false;
			musicqueue['msg.guild.id']['looped'] = false;
			return msg.channnel.send(`Song Looping disabled! :arrow_forward:`);
		}
	} else if (arg === 'queue' || arg === 'loopqueue' || arg === 'fullqueue' || arg === 'all' || arg.length < 1) {
		if (musicqueue[msg.guild.id] && !musicqueue[msg.guild.id]['looped']) {
			musicqueue[msg.guild.id]['looped'] = true;
			musicqueue[msg.guild.id]['loopone'] = false;
			return msg.channel.send(`Queue Looping enabled! :repeat:`);
		} else if (musicqueue[msg.guild.id] && musicqueue[msg.guild.id]['looped']) {
			musicqueue[msg.guild.id]['looped'] = false;
			musicqueue[msg.guild.id]['loopone'] = false;
			return msg.channel.send(`Queue Looping disabled! :arrow_forward:`);
		}
	}
};

exports.info = {
	name: 'loop',
	aliases: ['loopqueue','loopone'],
	usage: 'loop [queue|song]',
	description: 'Loop the current song or full queue.'
};
