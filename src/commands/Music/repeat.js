require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	try {
		if (!msg.member.voice.channel) return msg.channel.send(`<:redx:411978781226696705> You must be in a voice channel!`);
		if (msg.guild.voiceConnection === null) return msg.channel.send(`<:redx:411978781226696705> There is no audio being played.`);
		let fetched_queue = music_items[msg.guild.id];
		if (!fetched_queue || fetched_queue.queue.length <= 0) return msg.channel.send(`<:redx:411978781226696705> There are no audios in the queue to loop!`).catch((err) => console.error);
		fetched_queue.repeat = !fetched_queue.repeat;
		fetched_queue.loop = false;
		return msg.channel.send(`<:check:411976443522711552> Song repeat ${!fetched_queue.repeat ? 'enabled! :repeat_one:' : 'disabled! :arrow_forward:'}`);
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'repeat',
	userPermissions: ['CONNECT'],
	clientPermissions: ['CONNECT'],
	aliases: ['repeat','repeatsong','repeat-song','songrepeat','song-repeat'],
	usage: 'repeat',
	examples: [
		'repeat'
	],
	description: 'Repeat the current song.'
};
