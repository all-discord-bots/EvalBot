require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	try {
		let fetched_queue = music_items[msg.guild.id];
		if (!msg.member.voice.channel) return msg.channel.send('<:redx:411978781226696705> You must be in a voice channel!').catch((err) => console.error);
		if (args.length <= 0) return msg.channel.send('<:redx:411978781226696705> You must provide a track id to remove. To get the track id run the `queue` command!');
		if (!fetched_queue || !fetched_queue.queue) return msg.channel.send('<:redx:411978781226696705> There are no tracks in the queue!');
		if (parseInt(args[0]) <= 0) return msg.channel.send(`<:redx:411978781226696705> The positions range from \`1-${fetched_queue.queue.length}\`.`);
		if (parseInt(args[0]) === fetched_queue.queue_position) return msg.channel.send('<:redx:411978781226696705> You can\'t remove the current playing track.').catch((err) => console.error);
		if (parseInt(args[0]) > fetched_queue.queue.length) return msg.channel.send('<:redx:411978781226696705> You do not have that many tracks in the queue!');
		const audio = fetched_queue.queue.indexOf(fetched_queue.queue[parseInt(args[0]) - 0x1]);
		try {
			fetched_queue.queue.splice(audio, 1);
			msg.channel.send(`<:check:411976443522711552> Removed \`${fetched_queue.queue[parseInt(args[0])].title}\` from the queue.`);
		} catch (e) {
			msg.channel.send(`<:redx:411978781226696705> Failed to remove track at position \`${args[0]}\` from the queue.`);
		}
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'remove',
	guildOnly: true,
	userPermissions: ['CONNECT'],
	clientPermissions: ['CONNECT'],
	aliases: ['removesong','removemusic','removeaudio','removetrack','remove-song','remove-music','remove-audio','remove-track'],
	examples: [
		'remove 1'
	],
	usage: 'remove <track id>',
	description: 'Remove a track from the queue. To get the track id run the \`queue\` command.'
};
