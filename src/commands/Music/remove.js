require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	try {
		if (!msg.member.voice.channel) return msg.channel.send(`<:redx:411978781226696705> You must be in a voice channel!`).catch(err => console.error);
		if (args.length <= 0) return msg.channel.send(`<:redx:411978781226696705> You must provide a song id to remove. To get the song id run the \`queue\` command!`);
		if (!music_items[msg.guild.id] || !music_items[msg.guild.id].queue) return msg.channel.send(`<:redx:411978781226696705> There are no audios in the queue!`);
		if (parseInt(args[0]) <= 0) return msg.channel.send(`<:redx:411978781226696705> You can't remove the current playing item.`).catch(err => console.error);
		if (parseInt(args[0]) > music_items[msg.guild.id].queue.length) return msg.channel.send(`<:redx:411978781226696705> You do not have that many songs in the queue!`);
		const song = music_items[msg.guild.id].queue.indexOf(music_items[msg.guild.id].queue[parseInt(args[0])]);
		msg.channel.send(`<:check:411976443522711552> Removed \`${music_items[msg.guild.id].queue[parseInt(args[0])]}\` from the queue.`);
		music_items[msg.guild.id].queue.splice(song, 1);
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'remove',
	userPermissions: ['CONNECT'],
	clientPermissions: ['CONNECT'],
	aliases: ['removesong','removemusic','removeaudio','removetrack'],
	examples: [
		'remove 1'
	],
	usage: 'remove <track id>',
	description: 'Remove a song from the queue. To get the track id run the \`queue\` command.'
};
