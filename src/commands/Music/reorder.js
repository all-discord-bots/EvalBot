require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	try {
		if (!msg.member.voiceChannel) return msg.channel.send(`<:redx:411978781226696705> You must be in a voice channel!`).catch(err => console.error);
		const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send(`<:redx:411978781226696705> There is no audio being played.`).catch(err => console.error);
		if (!musicqueue[msg.guild.id] || musicqueue[msg.guild.id]['music'].length < 1) return msg.channel.send(`<:redx:411978781226696705> There are no items in the queue.`).catch(err => console.error);
		if (args.length !== 2) return msg.channel.send(`<:redx:411978781226696705> Invalid arguments provided.`).catch(err => console.error);
		if (args[0] <= 0) return msg.channel.send(`<:redx:411978781226696705> You can't move the current playing item!`).catch(err => console.error);
		let queuepositions;
		if (musicqueue[msg.guild.id].length <= 0) {
			queuepositions = `!`;
		} else {
			queuepositions = ` valid position are \`1 - ${musicqueue[msg.guild.id].length}\`!`;
		}
		if (args[1] <= 0 || args[1] > musicqueue[msg.guild.id]['music'].length) return msg.channel.send(`<:redx:411978781226696705> Could not move to position \`${args[1]}\`${queuepositions}`).catch(err => console.error);
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
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'reorder',
	userPermissions: ['CONNECT'],
	clientPermissions: ['CONNECT'],
	aliases: ['reorderqueue'],
	usage: 'reorder <song id> <new position>',
	examples: [
		'reorder 1 3'
	],
	description: 'Changes the position of a song in the queue. You can use the `queue` command to get the song position id.'
};
