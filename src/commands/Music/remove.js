require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	try {
		if (args.length <= 0) return msg.channel.send(`<:redx:411978781226696705> You must provide a song id to remove. To get the song id run the \`queue\` command!`).catch(err => console.error);
		if (!msg.member.voiceChannel) return msg.channel.send(`<:redx:411978781226696705> You must be in a voice channel!`).catch(err => console.error);
		if (!musicqueue[msg.guild.id] || !musicqueue[msg.guild.id]['music']) return msg.channel.send(`<:redx:411978781226696705> There are no audios in the queue!`).catch(err => console.error);
		if (parseInt(args[0]) <= 0) return msg.channel.send(`<:redx:411978781226696705> You can't remove the current playing item.`).catch(err => console.error);
		if (parseInt(args[0]) > musicqueue[msg.guild.id]['music'].length) return msg.channel.send(`<:redx:411978781226696705> You do not have that many songs in the queue!`).catch(err => console.error);
		const song = musicqueue[msg.guild.id]['music'].indexOf(musicqueue[msg.guild.id]['music'][parseInt(args[0])]);
		msg.channel.send(`<:check:411976443522711552> Removed \`${musicqueue[msg.guild.id]['music'][parseInt(args[0])]}\` from the queue.`);
		musicqueue[msg.guild.id]['music'].splice(song, 1);
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'remove',
	userPermissions: ['CONNECT'],
	clientPermissions: ['CONNECT'],
	aliases: ['removesong','removemusic'],
	examples: [
		'remove 1'
	],
	usage: 'remove <song id>',
	description: 'Remove a song from the queue. To get the song id run the \`queue\` command.'
};
