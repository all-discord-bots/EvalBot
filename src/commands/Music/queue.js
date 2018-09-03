const fetchVideoInfo = require('youtube-info');
const duration = require('go-duration');
const { milliseconds, seconds, minutes, hours, days } = require('time-convert');
require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	try {
		if (!music_items[msg.guild.id] || music_items[msg.guild.id].queue.length <= 0) return msg.channel.send(`<:redx:411978781226696705> There are no items in the queue.`);
		let queue = '';
		for (let i = 0; i < music_items[msg.guild.id].queue.length; i++) {
			let hashtag = '  ';
			let video_duration = '';
			if (i == music_items[msg.guild.id].queue_position) {
				hashtag = '# ';
				fetchVideoInfo(music_items[msg.guild.id].queue[i].id, function (err, videoInfo) {
					if (err) console.error(`${err.toString()}`);
					if (videoInfo) {
						let videoDuration = duration(`${videoInfo.duration}s`);
						let d, h, m, s; // days, hours, minutes, seconds
						s = Math.floor(parseInt(videoDuration - 1) / 1000); // - 1 is used to round the video to get the proper second count
						m = Math.floor(s / 60);
						s = s % 60;
						h = Math.floor(m / 60);
						m = m % 60;
						d = Math.floor(h / 24);
						h = h % 24;
						const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
						let currenttime;
						if (voiceConnection) {
							if (args.length <= 0) {
								currenttime = voiceConnection.player.dispatcher.time;
							} else {
								currenttime = 0;
							}
						} else if (!voiceConnection) {
							currenttime = `0`;
						}
						let currenttimepos = milliseconds.to(hours,minutes,seconds)(parseInt(currenttime));
						let seczero, minzero, hourzero, seconezero, minonezero, houronezero;
						if (s < 10) {
							seczero = '0';
						} else if (s > 9) {
							seczero = '';
						}
						if (m < 10) {
							minzero = '0';
						} else if (m > 9) {
							minzero = '';
						}
						if (h < 10) {
							hourzero = '0';
						} else if (h > 9) {
							hourzero = '';
						}
						if (currenttimepos[2] < 10) {
							seconezero = '0';
						} else if (currenttimepos[2] > 9) {
							seconezero = '';
						}
						if (currenttimepos[1] < 10) {
							minonezero = '0';
						} else if (currenttimepos[1] > 9) {
							minonezero = '';
						}
						if (currenttimepos[0] < 10) {
							houronezero = '0';
						} else if (currenttimepos[0] > 9) {
							houronezero = '';
						}
						video_duration = ` ${houronezero}${currenttimepos[0]}:${minonezero}${currenttimepos[1]}:${seconezero}${currenttimepos[2]}/${hourzero}${h}:${minzero}${m}:${seczero}${s}`;
					}
				});
			}
			queue += `${hashtag}${i + 1}. ${music_items[msg.guild.id].queue[i].title || 'Failed to get title for this item!'}${video_duration}\n`;
			//queue += `${i + 1}. [${music_items[msg.guild.id].queue[i].title}](${music_items[msg.guild.id].queue[i].url})\n`;
		}
		msg.channel.send(`\`\`\`md\n${queue}\n\`\`\``);
		/*msg.channel.send({
			embed: ({
				description: queue,
				timestamp: new Date(),
				color: 6732650,
				footer: {
					icon_url: `${bot.user.displayAvatarURL`},
					text: `${msg.author.tag}`
				}
			})
		});*/
	//});
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'queue',
	aliases: ['getqueue','musicqueue','songqueue','queuelist','listqueue','queued'],
	usage: 'queue',
	examples: [
		'queue'
	],
	description: 'Shows the current audio queue.'
};
