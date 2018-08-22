require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	try {
		if (!msg.member.voiceChannel) return msg.channel.send(`<:redx:411978781226696705> You must be in a voice channel!`).catch(err => console.error);
		const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send(`<:redx:411978781226696705> There is no audio being played.`).catch(err => console.error);
		if (!musicqueue[msg.guild.id] || musicqueue[msg.guild.id]['music'].length <= 0) return msg.channel.send(`<:redx:411978781226696705> There are no audios in the queue to loop!`).catch(err => console.error);
		let arg = args.join(' ').toLowerCase();
		if (arg === 'song' || arg === 'current' || arg === 'this' || arg === 'one' || arg === 'repeat') {
			if (!musicqueue[msg.guild.id]['loopsong']) {
				musicqueue[msg.guild.id]['loopsong'] = true;
				musicqueue[msg.guild.id]['loopqueue'] = false;
				return msg.channel.send(`Song Looping enabled! :repeat_one:`);
			} else if (musicqueue[msg.guild.id]['loopsong']) {
				musicqueue[msg.guild.id]['loopsong'] = false;
				musicqueue[msg.guild.id]['loopqueue'] = false;
				return msg.channel.send(`Song Looping disabled! :arrow_forward:`);
			}
		} else if (arg === 'queue' || arg === 'loopqueue' || arg === 'fullqueue' || arg === 'all' || arg.length <= 0) {
			if (!musicqueue[msg.guild.id]['loopqueue']) {
				musicqueue[msg.guild.id]['loopqueue'] = true;
				musicqueue[msg.guild.id]['loopsong'] = false;
				return msg.channel.send(`Queue Looping enabled! :repeat:`);
			} else if (musicqueue[msg.guild.id]['loopqueue']) {
				musicqueue[msg.guild.id]['loopqueue'] = false;
				musicqueue[msg.guild.id]['loopsong'] = false;
				return msg.channel.send(`Queue Looping disabled! :arrow_forward:`);
			}
		}
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'loop',
	userPermissions: ['CONNECT'],
	clientPermissions: ['CONNECT'],
	aliases: ['loopqueue', 'loopsong', 'loopone', 'loopcurrent', 'loopall'],
	usage: 'loop [queue|song]',
	examples: [
		'loop',
		'loop queue',
		'loop song'
	],
	description: 'Loop the current song or full queue.'
};
