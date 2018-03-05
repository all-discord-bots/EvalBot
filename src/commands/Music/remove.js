require('../../conf/globals.js');
exports.run = async (bot, msg, args) => {
	if (args.length < 1) return msg.channel.send(`<:redx:411978781226696705> You must provide a song id to remove. To get the song id run the \`queue\` command!`).catch(console.error);
	if (!musicqueue[msg.guild.id]['music']) return msg.channel.send(`<:redx:411978781226696705> There are no songs in the queue!`).catch(console.error);
	if (parseInt(args[0]) < 1) return msg.channel.send(`<:redx:411978781226696705> You can't remove the current playing item.`).catch(console.error);
	if (parseInt(args[0]) > musicqueue[msg.guild.id]['music'].length) return msg.channel.send(`<:redx:411978781226696705> You do not have that many songs in the queue!`).catch(console.error);
	const song = musicqueue[msg.guild.id]['music'].indexOf(musicqueue[msg.guild.id]['music'][parseInt(args[0])]);
	msg.channel.send(`<:check:411976443522711552> Removed \`${musicqueue[msg.guild.id]['music'][parseInt(args[0])]}\` from the queue.`);
	musicqueue[msg.guild.id]['music'].splice(song, 1);
};

exports.info = {
	name: 'remove',
	aliases: ['removesong','removemusic'],
	usage: 'remove <song id>',
	description: 'Remove a song from the queue. To get the song id run the \`queue\` command.'
};
