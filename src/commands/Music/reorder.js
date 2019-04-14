require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	try {
		let fetched_queue = music_items[msg.guild.id];
		if (!msg.member.voice.channel) return msg.channel.send('<:redx:411978781226696705> You must be in a voice channel!');
		if (msg.guild.voiceConnection === null) return msg.channel.send('<:redx:411978781226696705> There is no tracks being played.');
		if (!fetched_queue || fetched_queue.queue.length < 1) return msg.channel.send('<:redx:411978781226696705> There are no tracks in the queue.');
		if (args.length !== 2) return msg.channel.send('<:redx:411978781226696705> Invalid arguments given!');
		if (args[0] === fetched_queue.queue_position) return msg.channel.send('<:redx:411978781226696705> You can\'t move the current playing track!');
		let queuepositions = (fetched_queue.queue.length <= 0) ? '!' : ` valid position are \`1 - ${fetched_queue.queue.length}\`!`;
		if (args[1] == fetched_queue.queue_position || args[1] > fetched_queue.queue.length) return msg.channel.send(`<:redx:411978781226696705> Could not move to position \`${args[1]}\`${queuepositions}`);
		let old_pos = parseInt(args[0]) - 1;
		let new_pos = parseInt(args[1]) - 1;
		if (new_pos >= fetched_queue.queue.length) {
			let pos = new_pos - fetched_queue.queue.length; //+ 1;
			while (pos--) {
				fetched_queue.queue.push(undefined);
			}
		}
		try {
			fetched_queue.queue.splice(new_pos, 0, fetched_queue.queue.splice(old_pos, 1)[0]);
			msg.channel.send(`<:check:411976443522711552> track \`${old_pos + 1}\` has been moved to position \`${new_pos + 1}\` in the queue.`);
		} catch (e) {
			msg.channel.send(`<:redx:411978781226696705> failed to move track \`${old_pos + 1}\` to position \`${new_pos + 1}\` in the queue.`);
		}
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'reorder',
	allowDM: false,
	userPermissions: ['CONNECT'],
	clientPermissions: ['CONNECT'],
	aliases: ['reorderqueue', 'reorder-queue'],
	usage: 'reorder <song id> <new position>',
	examples: [
		'reorder 1 3'
	],
	description: 'Changes the position of a track in the queue. You can use the `queue` command to get the track position id.'
};
