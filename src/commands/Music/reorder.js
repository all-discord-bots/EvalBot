require('../../conf/globals.js');
exports.run = async (bot, msg, args) => {
	if (!musicqueue[msg.guild.id] || musicqueue[msg.guild.id]['music'].length < 1) return msg.channel.send(`<:redx:411978781226696705> The queue is empty.`).catch(console.error);
	if (args.length !== 2) return msg.channel.send(`<:redx:411978781226696705> Invalid arguments provided.`).catch(console.error);
	if (musicqueue[msg.guild.id]['music'].length < 1) return msg.channel.send(`<:redx:411978781226696705> There are no songs in the queue!`).catch(console.error);
	if (args[0] == 0) return msg.channel.send(`<:redx:411978781226696705> You can't move the current playing video!`).catch(console.error);
	if (args[1] < 1 || args[1] > musicqueue[msg.guild.id]['music'].length) return msg.channel.send(`<:redx:411978781226696705> Could not move to position \`${args[1]}\` valid position are \`1-${musicqueue[msg.guild.id].length}\`!`).catch(console.error);
	let old_pos = parseInt(args[0]);
	let new_pos = parseInt(args[1]);
	if (new_pos >= musicqueue[msg.guild.id]['music'].length) {
		let pos = new_pos - musicqueue[msg.guild.id]['music'].length + 1;
		while (pos--) {
			musicqueue[msg.guild.id]['music'].push(undefined);
		}
	}
	msg.channel.send(`<:check:411976443522711552> Position \`${old_pos}\` has been moved to position \`${new_pos}\` in the queue.`);
	musicqueue[msg.guild.id]['music'].splice(new_pos, 0, musicqueue[msg.guild.id]['music'].splice(old_pos, 1)[0]);
};

exports.info = {
	name: 'reorder',
	usage: 'reorder <song id> <new position>',
	description: 'Changes the position of a song in the queue. You can use the `queue` command to get the song position id.'
};
