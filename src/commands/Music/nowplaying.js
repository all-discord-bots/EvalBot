const { YTSearcher } = require('ytsearcher');
const moment = require('moment');
require('moment-duration-format');
const ms = require('ms');
const fetchVideoInfo = require('youtube-info');
const duration = require('go-duration');
const { milliseconds, seconds, minutes, hours, days } = require('time-convert');
const fetch = require('node-fetch');
require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	try {
		const fetched_queue = music_items[msg.guild.id];
		if (!fetched_queue.is_streaming) {
			const search = new YTSearcher({
				key: process.env.YOUTUBE_API_KEY,
				revealkey: true
			});
			let gsearch;
			if (args.length < 1) {
				if (!fetched_queue || fetched_queue.queue.length <= 0) return msg.channel.send('<:redx:411978781226696705> There are no items in the queue!').catch((err) => console.error);
				gsearch = fetched_queue.queue[fetched_queue.queue_position].title;
			} else if (args.length > 0) {
				gsearch = args.join(' ');
			}
			search.search(gsearch, { type: 'video' }).then((searchResult) => {
				let result = searchResult.first;
				//if (!result/* || !music_items[msg.guild.id]*/) return msg.channel.send(`<:redx:411978781226696705> Could not get the video.`).catch(err => console.error);
				//global.music_items.push(`${result.url}`); // result.id = video id // result.channelID = channel id // result.url = full video url // result.title = video name // result.description = video description
				if (result) { // message information about the video on playing the video
					fetchVideoInfo(result.id, function(err, videoInfo) {
						if (err) console.error(err);
						let videoDuration = duration(`${videoInfo.duration}s`); // seconds --> miliseconds
						/*Format Duration*/
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
						h = h.toString().padStart(0x2, '0');
						let current_time = 0;
						if (msg.guild.voiceConnection) {
							if (args.length <= 0) {
								current_time = msg.guild.voiceConnection.player.dispatcher.streamTime;
							}
						}
						let [hrs, mins, secs] = milliseconds.to(hours, minutes, seconds)(parseInt(current_time));
						hrs = hrs.toString().padStart(0x2, '0');
						mins = mins.toString().padStart(0x2, '0');
						secs = secs.toString().padStart(0x2, '0');
						const total_duration = args.length ? `\`${hrs}:${mins}:${secs}/${h}:${m}:${s}\`` : `\`${h}:${m}:${s}\``;
						let thumbnail;
						if (result.thumbnails.default.url && !result.thumbnails.medium.url && !result.thumbnails.high.url) {
							thumbnail = `${result.thumbnails.default.url}`;
						} else if (result.thumbnails.default.url && result.thumbnails.medium.url && !result.thumbnails.high.url) {
							thumbnail = `${result.thumbnails.medium.url}`;
						} else if (result.thumbnails.default.url && result.thumbnails.medium.url && result.thumbnails.high.url) {
							thumbnail = `${result.thumbnails.high.url}`;
						}
						let dthumbnail;
						if (result.thumbnails.default.url) {
							dthumbnail = `- [Default](${result.thumbnails.default.url}) \`${result.thumbnails.default.width}×${result.thumbnails.default.height}\`\n`;
						} else {
							dthumbnail = '';
						}
						let mthumbnail;
						if (result.thumbnails.medium.url) {
							mthumbnail = `- [Medium](${result.thumbnails.medium.url}) \`${result.thumbnails.medium.width}×${result.thumbnails.medium.height}\`\n`;
						} else {
							mthumbnail = '';
						}
						let hthumbnail;
						if (result.thumbnails.high.url) {
							hthumbnail = `- [High](${result.thumbnails.high.url}) \`${result.thumbnails.high.width}×${result.thumbnails.high.height}\``;
						} else {
							hthumbnail = '';
						}
						//let GetRegionsAllowed = videoInfo.regionsAllowed.toString();
						//let regionsstr = "," + GetRegionsAllowed.toString() + ",";
						//let replacecomma = regionsstr.replace(/,/g, "` `");
						//let replacecomma1 = replacecomma.replace("` ","") + "remove-this-string";
						//let ListRegionsAllowed = replacecomma1.replace(" `remove-this-string","");
						// current time function was here
						// OLD ONE UNTIL FIX COMES OUT
						/*msg.channel.send({
							embed: ({
								color: 3447003,
								title: `${result.title}`,
								url: `${result.url}`,
								thumbnail: {
									url: `${thumbnail}`
								},
								fields: [
									{
										name: `**__Video__**`,
										value: `[${result.title}](${result.url}) \`${result.id}\``
									},{
										name: `**__Channel__**`,
										value: `[${result.channelTitle}](https://www.youtube.com/channel/${result.channelId}) \`${result.channelId}\``
									},{
										name: `**__Thumbnails__**`,
										value: `${dthumbnail}${mthumbnail}${hthumbnail}`
									},{
										name: `**__Uploaded__**`,
										value: `${moment.utc(udate).format("LLLL")} \`${result.publishedAt}\``
									},{
										name: `**__Description__**`,
										value: `${result.description}`
									},{
										name: `**__Duration__**`,
										value: `\`${houronezero}${currenttimepos[0]}:${minonezero}${currenttimepos[1]}:${seconezero}${currenttimepos[2]}/${hourzero}${h}:${minzero}${m}:${seczero}${s}\``
									},{
										name: `**__Genre__**`,
										value: `\`${videoInfo.genre || 'N/A'}\``,
										inline: true
									},{
										name: `**__Paid__**`,
										value: `\`${videoInfo.paid}\``,
										inline: true
									},{
										name: `**__Unlisted__**`,
										value: `\`${videoInfo.unlisted}\``,
										inline: true
									},{
										name: `**__Family Friendly__**`,
										value: `\`${videoInfo.isFamilyFriendly}\``,
										inline: true
									},{
										name: `**__Views__**`,
										value: `\`${videoInfo.views || '0'}\``,
										inline: true
									},{
										name: `**__Comments__**`,
										value: `\`${videoInfo.commentCount || '0'}\``,
										inline: true
									},{
										name: `**__Regions Allowed__**`,
										value: `${videoInfo.regionsAllowed.toString()}`,
										inline: true
									},{
										name: `**__Likes/Dislikes__**`,
										value: `:thumbsup:\`${videoInfo.likeCount || '0'}\`\n:thumbsdown:\`${videoInfo.dislikeCount || '0'}\``,
										inline: true
									}
								],
								timestamp: new Date()
							})
						});*/
						msg.channel.send({
							embed: {
								color: 3447003,
								title: result.title,
								url: result.url,
								thumbnail: {
									url: thumbnail
								},
								fields: [
									{
										name: '**__Video__**',
										value: `[${result.title}](${result.url}) \`${result.id}\``
									},{
										name: '**__Channel__**',
										value: `[${result.channelTitle}](https://www.youtube.com/channel/${result.channelId}) \`${result.channelId}\``
									},{
										name: '**__Thumbnails__**',
										value: `${dthumbnail}${mthumbnail}${hthumbnail}`
									},{
										name: '**__Uploaded__**',
										value: `${moment.utc(new Date(result.publishedAt).getTime()).format("LLLL")} \`${result.publishedAt}\``
									},{
										name: '**__Description__**',
										value: result.description ? result.description || 'N/A' : 'N/A'
									},{
										name: '**__Duration__**',
										value: total_duration
									},{
										name: '**__Genre__**',
										value: `\`${videoInfo.genre || 'N/A'}\``,
										inline: true
									},{
										name: '**__Paid__**',
										value: `\`${videoInfo.paid}\``,
										inline: true
									},{
										name: '**__Unlisted__**',
										value: `\`${videoInfo.unlisted}\``,
										inline: true
									},{
										name: '**__Family Friendly__**',
										value: `\`${videoInfo.isFamilyFriendly}\``,
										inline: true
									},{
										name: '**__Views__**',
										value: `\`${videoInfo.views.toLocaleString() || '0'}\``,
										inline: true
									},{
										name: '**__Comments__**',
										value: `\`${videoInfo.commentCount.toLocaleString() || '0'}\``,
										inline: true
									},{
										name: '**__Regions Allowed__**',
										value: videoInfo.regionsAllowed.toString(),
										inline: true
									},{
										name: '**__Likes/Dislikes__**',
										value: `<:like:571086411353292824>\`${abbrNum(videoInfo.likeCount, 1)/*.toLocaleString()*/ || '0'}\`\n<:dislike:571086411059429387>\`${abbrNum(videoInfo.dislikeCount, 1)/*.toLocaleString()*/ || '0'}\``,
										inline: true
									}
								],
								timestamp: new Date()
							}
						});
						// ${ListRegionsAllowed.toString() || '`N/A`'}`,
					});
				} else {
					return msg.channel.send('<:redx:411978781226696705> Could not get information on the current playing audio.');
				}
				// https://developers.google.com/youtube/v3/docs/activities
			}).catch((err) => {
				return console.error(err.toString());
			});
		} else {
			let current_time = 0;
			if (msg.guild.voiceConnection) current_time = parseInt(msg.guild.voiceConnection.player.dispatcher.streamTime);
			let [hrs, mins, secs] = milliseconds.to(hours,minutes,seconds)(parseInt(current_time));
			hrs = hrs.toString().padStart(0x2, '0');
			mins = mins.toString().padStart(0x2, '0');
			secs = secs.toString().padStart(0x2, '0');
			const total_duration = `\`${hrs}:${mins}:${secs}\``;
			if (fetched_queue.queue[0].playlist_api != null) {
				new Promise((resolve,reject) => {
					fetch(fetched_queue.queue[0].playlist_api).then((res) => {
							resolve(res.json());
					}).catch((err) => {
						console.error(err.toString());
						reject();
					});
				}).then((res) => {
					msg.channel.send({
						embed: {
							color: 3447003,
							title: 'Streaming',
							url: fetched_queue.queue[0].url,
							description: `Streaming [${fetched_queue.queue[0].title}](${fetched_queue.queue[0].url}) for ${total_duration}`,
							timestamp: new Date(),
							fields: [
								{
									name: 'Now Playing',
									value: `[${res.playlist[0].name.replace('\u0026','&') || 'N/A'}](https://onlineradiobox.com/track/${res.playlist[0].id}/ '${res.playlist[0].name.replace('\u0026','&')}') \`${res.playlist[0].created || 'N/A'}\``
								},{
									name: 'Last Played',
									value: `[${res.playlist[1].name.replace('\u0026','&') || 'N/A'}](https://onlineradiobox.com/track/${res.playlist[1].id}/ '${res.playlist[1].name.replace('\u0026','&')}') \`${res.playlist[1].created || 'N/A'}\``
								}
							]
						}
					});
				}).catch((err) => {
					console.error(err.toString());
					return msg.channel.send('<:redx:411978781226696705> Could not get information on the current playing stream.');
				});
			} else {
				msg.channel.send({
					embed: {
						color: 3447003,
						title: 'Streaming',
						url: fetched_queue.queue[0].url,
						description: `Streaming [${fetched_queue.queue[0].title}](${fetched_queue.queue[0].url}) for ${total_duration}`,
						timestamp: new Date()
					}
				});
			}
		}
	} catch (err) {
		console.error(err.toString());
	}
};

const abbrNum = (number, decPlaces = 0) => {
	// 2 decimal places => 100, 3 => 1000, etc
	decPlaces = Math.pow(10, decPlaces);

	// Enumerate number abbreviations
	let abbrev = ["K", "M", "B", "T"];

	// Go through the array backwards, so we do the largest first
	for (let i = abbrev.length - 1; i >= 0; i--) {

		// Convert array index to "1000", "1000000", etc
		let size = Math.pow(10, (i + 1) * 3);

		// If the number is bigger or equal do the abbreviation
		if (size <= number) {
			// Here, we multiply by decPlaces, round, and then divide by decPlaces.
			// This gives us nice rounding to a particular decimal place.
			number = Math.floor(number * decPlaces / size) / decPlaces; // Math.round rounds the number

			// Add the letter for the abbreviation
			number += abbrev[i];

			// We are done... stop
			break;
		}
	}

	return number;
}

exports.info = {
	name: 'nowplaying',
	allowDM: false,
	clientPermissions: ['CONNECT'],
	aliases: ['np','searchvideo','searchvid','viddetails','videodetails'],
	examples: [
		'nowplaying',
		'nowplaying https://www.youtube.com/watch?v=FVovq9TGBw0',
		'nowplaying Ozzy Osbourne - Crazy Train'
	],
	usage: 'nowplaying [url | search]',
	description: 'Shows info on the currently playing audio.'
};
