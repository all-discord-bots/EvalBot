const { YTSearcher } = require('ytsearcher');
const Discord = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
const ms = require('ms');
const fetchVideoInfo = require('youtube-info');
const duration = require('go-duration');
const { milliseconds, seconds, minutes, hours, days } = require('time-convert');
require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	try {
		const search = new YTSearcher({
			key: process.env.YOUTUBE_API_KEY,
			revealkey: true
		});
		let gvid = args.join(' ');
		let gsearch;
		if (gvid.length < 1) {
			if (!music_items[msg.guild.id] || music_items[msg.guild.id].queue.length < 1) return msg.channel.send(`<:redx:411978781226696705> There are no items in the queue!`).catch(err => console.error);
			gsearch = music_items[msg.guild.id].queue[0];
		} else if (gvid.length > 0) {
			gsearch = gvid;
		}
		search.search(gsearch, { type: 'video' }).then((searchResult) => {
			let result = searchResult.first;
			//if (!result/* || !music_items[msg.guild.id]*/) return msg.channel.send(`<:redx:411978781226696705> Could not get the video.`).catch(err => console.error);
			//global.music_items.push(`${result.url}`); // result.id = video id // result.channelID = channel id // result.url = full video url // result.title = video name // result.description = video description
			if (result || !music_items[msg.guild.id] || music_items[msg.guild.id] && !music_items[msg.guild.id]['streaming']) { // message information about the video on playing the video
				fetchVideoInfo(result.id, function (err, videoInfo) {
					if (err) throw new Error(err);
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
					const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
					let currenttime;
					if (voiceConnection) {
						if (args.length <= 0) {
							currenttime = voiceConnection.player.dispatcher.time; //ms(parseInt(voiceConnection.player.dispatcher.time));
						} else {
							currenttime = 0;
						}
					} else if (!voiceConnection) {
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
					/*msg.channel.send({embed: ({
						color: 3447003,
						title: `${result.title}`,
						url: `${result.url}`,
						"thumbnail": {
							url: `${thumbnail}`
						}, fields: [
							{
								name: `**__Video__**`,
								value: `[${result.title}](${result.url}) \`${result.id}\``
							}, {
								name: `**__Channel__**`,
								value: `[${result.channelTitle}](https://www.youtube.com/channel/${result.channelId}) \`${result.channelId}\``
							}, {
								name: `**__Thumbnails__**`,
								value: `${dthumbnail}${mthumbnail}${hthumbnail}`
							}, {
								name: `**__Uploaded__**`,
								value: `${moment.utc(udate).format("LLLL")} \`${result.publishedAt}\``
							}, {
								name: `**__Description__**`,
								value: `${result.description}`
							}, {
								name: `**__Duration__**`,
								value: `\`${houronezero}${currenttimepos[0]}:${minonezero}${currenttimepos[1]}:${seconezero}${currenttimepos[2]}/${hourzero}${h}:${minzero}${m}:${seczero}${s}\``
							}, {
								name: `**__Genre__**`,
								value: `\`${videoInfo.genre || 'N/A'}\``,
								inline: true
							}, {
								name: `**__Paid__**`,
								value: `\`${videoInfo.paid}\``,
								inline: true
							}, {
								name: `**__Unlisted__**`,
								value: `\`${videoInfo.unlisted}\``,
								inline: true
							}, {
								name: `**__Family Friendly__**`,
								value: `\`${videoInfo.isFamilyFriendly}\``,
								inline: true
							}, {
								name: `**__Views__**`,
								value: `\`${videoInfo.views || '0'}\``,
								inline: true
							}, {
								name: `**__Comments__**`,
								value: `\`${videoInfo.commentCount || '0'}\``,
								inline: true
							}, {
								name: `**__Regions Allowed__**`,
								value: `${videoInfo.regionsAllowed.toString()}`,
								inline: true
							}, {
								name: `**__Likes/Dislikes__**`,
								value: `:thumbsup:\`${videoInfo.likeCount || '0'}\`\n:thumbsdown:\`${videoInfo.dislikeCount || '0'}\``,
								inline: true
							}
						],
						timestamp: new Date()
					})});*/
					msg.channel.send({embed: ({
						color: 3447003,
						title: `${result.title}`,
						url: `${result.url}`,
						"thumbnail": {
							url: `${thumbnail}`
						}, fields: [
							{
								name: `**__Video__**`,
								value: `[${result.title}](${result.url}) \`${result.id}\``
							}, {
								name: `**__Channel__**`,
								value: `[${result.channelTitle}](https://www.youtube.com/channel/${result.channelId}) \`${result.channelId}\``
							}, {
								name: `**__Thumbnails__**`,
								value: `${dthumbnail}${mthumbnail}${hthumbnail}`
							}, {
								name: `**__Uploaded__**`,
								value: `${moment.utc(new Date(result.publishedAt).getTime()).format("LLLL")} \`${result.publishedAt}\``
							}, {
								name: `**__Description__**`,
								value: `${result.description ? result.description || 'N/A' : 'N/A'}`
							}, {
								name: `**__Duration__**`,
								value: `\`${houronezero}${currenttimepos[0]}:${minonezero}${currenttimepos[1]}:${seconezero}${currenttimepos[2]}/${hourzero}${h}:${minzero}${m}:${seczero}${s}\``
							}, {
								name: `**__Genre__**`,
								value: `\`${videoInfo.genre || 'N/A'}\``,
								inline: true
							}, {
								name: `**__Paid__**`,
								value: `\`${videoInfo.paid}\``,
								inline: true
							}, {
								name: `**__Unlisted__**`,
								value: `\`${videoInfo.unlisted}\``,
								inline: true
							}, {
								name: `**__Family Friendly__**`,
								value: `\`${videoInfo.isFamilyFriendly}\``,
								inline: true
							}, {
								name: `**__Views__**`,
								value: `\`${videoInfo.views || '0'}\``,
								inline: true
							}, {
								name: `**__Comments__**`,
								value: `\`${videoInfo.commentCount || '0'}\``,
								inline: true
							}, {
								name: `**__Regions Allowed__**`,
								value: `${videoInfo.regionsAllowed.toString()}`,
								inline: true
							}, {
								name: `**__Likes/Dislikes__**`,
								value: `:thumbsup:\`${videoInfo.likeCount || '0'}\`\n:thumbsdown:\`${videoInfo.dislikeCount || '0'}\``,
								inline: true
							}
						],
						timestamp: new Date()
					})}).catch(err => console.error);
					// ${ListRegionsAllowed.toString() || '`N/A`'}`,
				});
				// https://developers.google.com/youtube/v3/docs/activities
			} else if (!result || music_items[msg.guild.id] && music_items[msg.guild.id]['streaming']) {
				const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
				let currenttime;
				if (voiceConnection) {
					currenttime = parseInt(voiceConnection.player.dispatcher.time); //ms(parseInt(voiceConnection.player.dispatcher.time));
				} else if (!voiceConnection) {
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
				msg.channel.send({embed: ({
					color: 3447003,
					title: `Streaming`,
					url: `${music_items[msg.guild.id].queue[0]}`,
					description: `Streaming [${music_items[msg.guild.id].queue[0]}](${music_items[msg.guild.id].queue[0]}) for \`${hourzero}${streamingDuration[0]}:${minzero}${streamingDuration[1]}:${seczero}${streamingDuration[2]}\``,
					timestamp: new Date()
				})});
			}
		}).catch(err => console.error(err.toString()));
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'nowplaying',
	clientPermissions: ['CONNECT'],
	aliases: ['np','searchvideo','searchvid','viddetails','videodetails'],
	examples: [
		'nowplaying',
		'nowplaying https://www.youtube.com/watch?v=FVovq9TGBw0',
		'nowplaying Ozzy Osbourne - Crazy Train'
	],
	usage: 'nowplaying [url | search]',
	description: 'Shows the currently playing song.'
};
