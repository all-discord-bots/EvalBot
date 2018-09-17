require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	try {
		if (!msg.member.voice.channel) return msg.channel.send(`<:redx:411978781226696705> You must be in a voice channel!`);
		if (!music_items[msg.guild.id]) return msg.channel.send(`<:redx:411978781226696705> Queue is already empty!`);
		if (args.length <= 0) {
			music_items[msg.guild.id].loop_queue = false;
			music_items[msg.guild.id].loop_song = false;
			if (music_items[msg.guild.id].queue.length > 0) {
				music_items[msg.guild.id].queue.splice(0, music_items[msg.guild.id].queue.length);
				if (msg.guild.voiceConnection !== null) {
					try {
						if (msg.guild.voiceConnection.paused) msg.guild.voiceConnection.player.dispatcher.resume();
						msg.guild.voiceConnection.player.dispatcher.end();
					} catch (err) {
						return msg.channel.send(`<:redx:411978781226696705> Error occoured!\n\`\`\`\n${err.toString().split(':')[0]}: ${err.toString().split(':')[1]}\n\`\`\``);
					}
				}
				return msg.channel.send(`<:check:411976443522711552> Queue has been cleared!`);
			} else {
				return msg.channel.send(`<:redx:411978781226696705> Queue is already empty!`);
			}
		}  else if (args.length > 0) {
			if (music_items[msg.guild.id].queue.length > 0) {
				let user = bot.utils.getMembers(msg,args[0]);
				if (!user) return msg.channel.send(`<:redx:411978781226696705> I could not find that user.`);
				if (user.toString().includes("I could not find that user.")) return;
				if (!msg.guild.members.get(`${user.id}`)) return msg.channel.send(`<:redx:411978781226696705> I could not find that user.`);
				if (music_items[msg.guild.id].queue.filter((song) => song.requester === user.user).length <= 0) return msg.channel.send(`<:redx:411978781226696705> That user does not have any audios in the queue.`);
				music_items[msg.guild.id].queue.forEach((value,index) => {
					if (value.requester === user.user) {
						music_items[msg.guild.id].queue.splice(index,1);
						if (index == 0) {
							if (msg.guild.voiceConnection !== null) {
								try {
									if (msg.guild.voiceConnection.paused) msg.guild.voiceConnection.player.dispatcher.resume();
									msg.guild.voiceConnection.player.dispatcher.end();
								} catch (err) {
									return msg.channel.send(`<:redx:411978781226696705> Error occoured!\n\`\`\`\n${err.toString().split(':')[0]}: ${err.toString().split(':')[1]}\n\`\`\``);
								}
							}
						}
					}
				});
				return msg.channel.send(`<:check:411976443522711552> All audios requested by <@${user.id}> have been cleared.`);
			} else {
				return msg.channel.send(`<:redx:411978781226696705> Queue is already empty!`);
			}
		}
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'clearqueue',
	userPermissions: ['CONNECT'],
	clientPermissions: ['CONNECT'],
	aliases: ['clear-queue'],
	usage: 'clearqueue [user]',
	examples: [
		'clearqueue',
		'clearqueue BannerBomb'
	],
	description: 'Clears the entire playback queue or all of a users queues audios.'
};
