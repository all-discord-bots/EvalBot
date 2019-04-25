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
		if (!music_items[msg.guild.id].is_streaming) {
			const search = new YTSearcher({
				key: process.env.YOUTUBE_API_KEY,
				revealkey: true
			});
			let gsearch;
			if (args.length < 1) {
				if (!music_items[msg.guild.id] || music_items[msg.guild.id].queue.length <= 0) return msg.channel.send(`<:redx:411978781226696705> There are no items in the queue!`).catch(err => console.error);
				gsearch = music_items[msg.guild.id].queue[music_items[msg.guild.id].queue_position].title;
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
						s = Math.floor(parseInt(videoDuration - 1) / 1000); // - 1 is used to round the video to get the proper second count
						m = Math.floor(s / 60);
						s = s % 60;
						h = Math.floor(m / 60);
						m = m % 60;
						d = Math.floor(h / 24);
						h = h % 24;
						/*Format Duration*/
						/*Format Playtime*/
						let currenttime;
						if (msg.guild.voiceConnection) {
							if (args.length <= 0) {
								currenttime = msg.guild.voiceConnection.player.dispatcher.streamTime; //msg.guild.voiceConnection.player.dispatcher.time; //ms(parseInt(msg.guild.voiceConnection.player.dispatcher.time));
							} else {
								currenttime = 0;
							}
						} else if (!msg.guild.voiceConnection) {
							currenttime = `0`;
						}
						//let currentDuration = duration(`${currenttime.toString()}`);
						//let done, hone, mone, sone; // days, hours, minutes, seconds
						let currenttimepos = milliseconds.to(hours,minutes,seconds)(parseInt(currenttime));
						/*sone = Math.floor(currentDuration / 1000);
						mone = Math.floor(sone / 60);
						sone = sone % 60;
						hone = Math.floor(mone / 60);
						mone = mone % 60; // -1 here
						done = Math.floor(hone / 24);
						hone = hone % 24;*/
						/*Format Playtime*/
						// Begin adding leading zeros
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
						// End add leading zero
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
										value: `${moment.utc(new Date(result.publishedAt).getTime()).format("LLLL")} \`${result.publishedAt}\``
									},{
										name: `**__Description__**`,
										value: `${result.description ? result.description || 'N/A' : 'N/A'}`
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
										value: `\`${videoInfo.views.toLocaleString() || '0'}\``,
										inline: true
									},{
										name: `**__Comments__**`,
										value: `\`${videoInfo.commentCount.toLocaleString() || '0'}\``,
										inline: true
									},{
										name: `**__Regions Allowed__**`,
										value: `${videoInfo.regionsAllowed.toString()}`,
										inline: true
									},{
										name: `**__Likes/Dislikes__**`,
										value: `<:like:571086411353292824>\`${videoInfo.likeCount.toLocaleString() || '0'}\`\n<:dislike:571086411059429387>\`${videoInfo.dislikeCount.toLocaleString() || '0'}\``,
										inline: true
									}
								],
								timestamp: new Date()
							})
						});
						// ${ListRegionsAllowed.toString() || '`N/A`'}`,
					});
				} else {
					return msg.channel.send(`<:redx:411978781226696705> Could not get information on the current playing audio.`);
				}
				// https://developers.google.com/youtube/v3/docs/activities
			}).catch((err) => {
				return console.error(err.toString());
			});
		} else {
			let currenttime;
			if (msg.guild.voiceConnection) {
				currenttime = parseInt(msg.guild.voiceConnection.player.dispatcher.streamTime); //msg.guild.voiceConnection.player.dispatcher.time); //ms(parseInt(voiceConnection.player.dispatcher.time));
			} else if (!msg.guild.voiceConnection) {
				currenttime = `0`;
			}
			let streamingDuration = milliseconds.to(hours,minutes,seconds)(parseInt(currenttime));
			/*let currentDuration = duration(`${currenttime.toString()}`);
			let d, h, m, s; // days, hours, minutes, seconds
			s = Math.floor(currentDuration / 1000);
			m = Math.floor(s / 60);
			s = s % 60;
			h = Math.floor(m / 60);
			m = m % 60; // -1 here
			d = Math.floor(h / 24);
			h = h % 24;
			*/
			let seczero, minzero, hourzero;
			if (streamingDuration[2] < 10) {
				seczero = '0';
			} else if (streamingDuration[2] > 9) {
				seczero = '';
			}
			if (streamingDuration[1] < 10) {
				minzero = '0';
			} else if (streamingDuration[1] > 9) {
				minzero = '';
			}
			if (streamingDuration[0] < 10) {
				hourzero = '0';
			} else if (streamingDuration[0] > 9) {
				hourzero = '';
			}
			
			if (music_items[msg.guild.id].queue[0].playlist_api != null) {
				new Promise((resolve,reject) => {
					fetch(`${music_items[msg.guild.id].queue[0].playlist_api}`).then((res) => {
							resolve(res.json());
					}).catch((err) => {
						console.error(err.toString());
						reject();
					});
				}).then((res) => {
					msg.channel.send({
						embed: ({
							color: 3447003,
							title: `Streaming`,
							url: `${music_items[msg.guild.id].queue[0].url}`,
							description: `Streaming [${music_items[msg.guild.id].queue[0].title}](${music_items[msg.guild.id].queue[0].url}) for \`${hourzero}${streamingDuration[0]}:${minzero}${streamingDuration[1]}:${seczero}${streamingDuration[2]}\``,
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
						})
					});
				}).catch((err) => {
					console.error(err.toString());
					return msg.channel.send(`<:redx:411978781226696705> Could not get information on the current playing stream.`);
				});
			} else {
				msg.channel.send({
					embed: ({
						color: 3447003,
						title: `Streaming`,
						url: `${music_items[msg.guild.id].queue[0].url}`,
						description: `Streaming [${music_items[msg.guild.id].queue[0].title}](${music_items[msg.guild.id].queue[0].url}) for \`${hourzero}${streamingDuration[0]}:${minzero}${streamingDuration[1]}:${seczero}${streamingDuration[2]}\``,
						timestamp: new Date(),
					})
				});
			}
		}
	} catch (err) {
		console.error(err.toString());
	}
};

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
