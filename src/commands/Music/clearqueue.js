require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	try {
		if (!msg.member.voiceChannel) return msg.channel.send(`<:redx:411978781226696705> You must be in a voice channel!`).catch(err => console.error);
		if (!music_items[msg.guild.id]) return msg.channel.send(`<:redx:411978781226696705> Queue is already empty!`).catch(err => console.error);
		music_items[msg.guild.id].loop_queue = false;
		music_items[msg.guild.id].loop_song = false;
		if (music_items[msg.guild.id].queue.length > 0) {
			music_items[msg.guild.id].queue.splice(0, music_items[msg.guild.id].queue.length);
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
	description: 'Clears the current audio queue.'
};
