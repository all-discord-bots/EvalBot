require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	try {
		if (!msg.member.voiceChannel) return msg.channel.send(`<:redx:411978781226696705> You must be in a voice channel!`);
		const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send(`<:redx:411978781226696705> There is no audio being played.`);
		if (!music_items[msg.guild.id] || music_items[msg.guild.id].queue.length <= 0) return msg.channel.send(`<:redx:411978781226696705> There are no audios in the queue to loop!`).catch(err => console.error);
		let arg = args.join(' ').toLowerCase();
		if (arg === 'song' || arg === 'current' || arg === 'this' || arg === 'one' || arg === 'repeat') {
			if (!music_items[msg.guild.id].loop_song) {
				music_items[msg.guild.id].loop_song = true;
				music_items[msg.guild.id].loop_queue = false;
				return msg.channel.send(`Song Looping enabled! :repeat_one:`);
			} else if (music_items[msg.guild.id].loop_song) {
				music_items[msg.guild.id].loop_song = false;
				music_items[msg.guild.id].loop_queue = false;
				return msg.channel.send(`Song Looping disabled! :arrow_forward:`);
			}
		} else if (arg === 'queue' || arg === 'loopqueue' || arg === 'fullqueue' || arg === 'all' || arg.length <= 0) {
			if (!music_items[msg.guild.id].loop_queue) {
				music_items[msg.guild.id].loop_queue = true;
				music_items[msg.guild.id].loop_song = false;
				return msg.channel.send(`Queue Looping enabled! :repeat:`);
			} else if (music_items[msg.guild.id].loop_queue) {
				music_items[msg.guild.id].loop_queue = false;
				music_items[msg.guild.id].loop_song = false;
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
	usage: 'loop [queue | song]',
	examples: [
		'loop',
		'loop queue',
		'loop song'
	],
	description: 'Loop the current song or full queue.'
};
