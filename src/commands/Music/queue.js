const fetchVideoInfo = require('youtube-info');
const duration = require('go-duration');
const { milliseconds, seconds, minutes, hours, days } = require('time-convert');
require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	try {
		let playback_duration = '';
		let fetched_queue = music_items[msg.guild.id];
		if (fetched_queue.queue.length <= 0) playback_duration = '';
		if (!fetched_queue || fetched_queue.queue.length <= 0) return msg.channel.send(`<:redx:411978781226696705> There are no items in the queue.`);

		const queue = fetched_queue.queue.map((song, index, array) => {
			if (!fetched_queue.is_streaming) {
				//fetchVideoInfo(fetched_queue.queue[fetched_queue.queue_position].id, (err, videoInfo) => {
				fetchVideoInfo(song.id, (err, videoInfo) => {
					if (err) console.error(`${err.toString()}`);
					if (videoInfo) {
						let videoDuration = duration(`${videoInfo.duration}s`);
						let d, h, m, s; // days, hours, minutes, seconds
						s = Math.floor(parseInt(videoDuration - 0x1) / 0x3E8); // - 0x1 is used to round the video to get the proper second count
						m = Math.floor(s / 0x3C);
						s = s % 0x3C;
						h = Math.floor(m / 0x3C);
						m = m % 0x3C;
						d = Math.floor(h / 0x18);
						h = h % 0x18;
						s = s.toString().padStart(0x2, '0');
						m = m.toString().padStart(0x2, '0');
						h = m.toString().padStart(0x2, '0');
						let current_time = 0;
						if (msg.guild.voiceConnection) current_time = msg.guild.voiceConnection.player.dispatcher.streamTime;
						let [hrs, mins, secs] = milliseconds.to(hours, minutes, seconds)(parseInt(current_time));
						hrs = hrs.padStart(0x2, '0');
						mins = mins.padStart(0x2, '0');
						secs = secs.padStart(0x2, '0');
						const total_duration = (fetched_queue.queue_position === index) ? ` [${hrs}:${mins}:${secs}/${h}:${m}:${s}]` : ` [${h}:${m}:${s}]`;
						song.total_duration = total_duration;
						playback_duration = total_duration;
					}
				});
			} else {
				song.total_duration = '';
				playback_duration = '';
			}
			return `${(fetched_queue.queue_position === index) ? '#' : ' '} ${index + 0x1}. ${song.title || 'Failed to get title for this item!'}${(playback_duration !== '') ? playback_duration : ' [00:00:00]'}`;
		}).join('\n').replace(/(&quot;)/g, '"').replace(/(&amp)/g, '&').replace(/(&apos;)/g, '\'').replace(/(&gt;)/g, '>').replace(/(&lt;)/g, '<');
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
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'queue',
	aliases: ['getqueue','musicqueue','songqueue','queuelist','listqueue','queued','get-queue','music-queue','song-queue','queue-list','list-queue'],
	usage: 'queue',
	examples: [
		'queue'
	],
	description: 'Shows the current audio queue.'
};
