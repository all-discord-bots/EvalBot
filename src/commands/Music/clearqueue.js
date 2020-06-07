require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	let fetched_queue = music_items[msg.guild.id];
	try {
		const voice_channel = msg.member.voice.channel;
		const voice_connection = msg.guild.voice.connection;
		if (!voice_channel) return msg.channel.send('<:redx:411978781226696705> You must be in a voice channel!');
		if (!fetched_queue) return msg.channel.send('<:redx:411978781226696705> Queue is already empty!');
		if (args.length <= 0) {
			fetched_queue.loop = false;
			fetched_queue.repeat = false;
			fetched_queue.queue_position = 0;
			if (fetched_queue.queue.length > 0) {
				fetched_queue.queue.splice(0, fetched_queue.queue.length);
				if (!voice_connection) {
					try {
						if (voice_connection.paused) voice_connection.player.dispatcher.resume();
						voice_connection.player.dispatcher.end();
					} catch (err) {
						return msg.channel.send(`<:redx:411978781226696705> Error occoured!\n\`\`\`\n${err.toString().split(':')[0]}: ${err.toString().split(':')[1]}\n\`\`\``);
					}
				}
				return msg.channel.send('<:check:411976443522711552> Queue has been cleared!');
			} else {
				return msg.channel.send('<:redx:411978781226696705> Queue is already empty!');
			}
		}  else if (args.length > 0) {
			if (fetched_queue.queue.length > 0) {
				let user = bot.utils.getMembers(msg, args[0]);
				if (!user) return msg.channel.send('<:redx:411978781226696705> I could not find that user.');
				if (user.toString().includes('I could not find that user.')) return;
				if (!msg.guild.members.get(`${user.id}`)) return msg.channel.send('<:redx:411978781226696705> I could not find that user.');
				if (fetched_queue.queue.filter((song) => song.requester === user.user).length <= 0) return msg.channel.send('<:redx:411978781226696705> That user does not have any audios in the queue.');
				fetched_queue.queue.forEach((value,index) => {
					if (value.requester === user.user) {
						fetched_queue.queue.splice(index,1);
						if (!index) {
							if (!voice_connection) {
								try {
									if (voice_connection.paused) voice_connection.player.dispatcher.resume();
									voice_connection.player.dispatcher.end();
								} catch (err) {
									return msg.channel.send(`<:redx:411978781226696705> Error occoured!\n\`\`\`\n${err.toString().split(':')[0]}: ${err.toString().split(':')[1]}\n\`\`\``);
								}
							}
						}
					}
				});
				return msg.channel.send(`<:check:411976443522711552> All audios requested by <@${user.id}> have been cleared.`);
			} else {
				return msg.channel.send('<:redx:411978781226696705> Queue is already empty!');
			}
		}
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'clearqueue',
	allowDM: false,
	userPermissions: ['CONNECT'],
	clientPermissions: ['CONNECT'],
	aliases: ['clear-queue'],
	usage: 'clearqueue [user]',
	examples: [
		'clearqueue',
		'clearqueue BannerBomb'
	],
	description: 'Clears the entire playback queue or all of a users queued audios.'
};
