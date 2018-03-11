const { YTSearcher } = require('ytsearcher');
const Discord = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
const ms = require('ms');
const fetchVideoInfo = require('youtube-info');
const duration = require('go-duration');
require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	const search = new YTSearcher({
		key: process.env.YOUTUBE_API_KEY,
		revealkey: true
	});
	let gvid = args.join(' ');
	let gsearch;
	if (gvid.length < 1) {
		if (!musicqueue[msg.guild.id] || musicqueue[msg.guild.id]['music'].length < 1) return msg.channel.send(`<:redx:411978781226696705> There are no items in the queue!`).catch(console.error);
		gsearch = musicqueue[msg.guild.id]['music'][0];
	} else if (gvid.length > 0) {
		gsearch = gvid;
	}
	search.search(gsearch, { type: 'video' }).then(searchResult => {
		let result = searchResult.first;
		if (!result/* || !musicqueue[msg.guild.id]*/) return msg.channel.send(`<:redx:411978781226696705> Could not get the video.`).catch(console.error);
		//global.musicqueue.push(`${result.url}`); // result.id = video id // result.channelID = channel id // result.url = full video url // result.title = video name // result.description = video description
		if (result.url || !musicqueue[msg.guild.id] || musicqueue[msg.guild.id] && !musicqueue[msg.guild.id]['streaming']) { // message information about the video on playing the video
			fetchVideoInfo(`${result.id}`, function (err, videoInfo) {
				if (err) throw new Error(err);
				let videoDuration = duration(`${videoInfo.duration}s`); // seconds --> miliseconds
				/*Format Duration*/
				let d, h, m, s; // days, hours, minutes, seconds
				s = Math.floor(videoDuration / 1000);
				m = Math.floor(s / 60);
				s = s % 60;
				h = Math.floor(m / 60);
				m = m % 60; // -1 here
				d = Math.floor(h / 24);
				h = h % 24;
				/*Format Duration*/
				/*Format Playtime*/
				const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
				let currenttime;
				if (voiceConnection) {
					currenttime = ms(parseInt(voiceConnection.player.dispatcher.time));
				} else if (!voiceConnection) {
					currenttime = `0s`;
				}
				let currentDuration = duration(`${currenttime.toString()}`);
				let done, hone, mone, sone; // days, hours, minutes, seconds
				sone = Math.floor(currentDuration / 1000);
				mone = Math.floor(sone / 60);
				sone = sone % 60;
				hone = Math.floor(mone / 60);
				mone = mone % 60; // -1 here
				done = Math.floor(hone / 24);
				hone = hone % 24;
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
				if (sone < 10) {
					seconezero = '0';
				} else if (sone > 9) {
					seconezero = '';
				}
				if (mone < 10) {
					minonezero = '0';
				} else if (mone > 9) {
					minonezero = '';
				}
				if (hone < 10) {
					houronezero = '0';
				} else if (hone > 9) {
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
				let udate = new Date(result.publishedAt).getTime();
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
				let GetRegionsAllowed = videoInfo.regionsAllowed.toString();
				let regionsstr = "," + GetRegionsAllowed.toString() + ",";
				let replacecomma = regionsstr.replace(/,/g, "` `");
				let replacecomma1 = replacecomma.replace("` ","") + "remove-this-string";
				let ListRegionsAllowed = replacecomma1.replace(" `remove-this-string","");
				// current time function was here
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
							value: `${moment.utc(udate).format("LLLL")} \`${result.publishedAt}\``
						}, {
							name: `**__Description__**`,
							value: `${result.description}`
						}, {
							name: `**__Duration__**`,
							value: `\`${houronezero}${hone}:${minonezero}${mone}:${seconezero}${sone}/${hourzero}${h}:${minzero}${m}:${seczero}${s}\``
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
							value: `${ListRegionsAllowed.toString() || '`N/A`'}`,
							inline: true
						}, {
							name: `**__Likes/Dislikes__**`,
							value: `:thumbsup:\`${videoInfo.likeCount || '0'}\`\n:thumbsdown:\`${videoInfo.dislikeCount || '0'}\``,
							inline: true
						}
					],
					timestamp: new Date()
				})});
			});
			// https://developers.google.com/youtube/v3/docs/activities
		} else if (result.url || musicqueue[msg.guild.id] && musicqueue[msg.guild.id]['streaming']) {
			const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
			let currenttime;
			if (voiceConnection) {
				currenttime = ms(parseInt(voiceConnection.player.dispatcher.time));
			} else if (!voiceConnection) {
				currenttime = `0s`;
			}
			let currentDuration = duration(`${currenttime.toString()}`);
			let d, h, m, s; // days, hours, minutes, seconds
			s = Math.floor(currentDuration / 1000);
			m = Math.floor(s / 60);
			s = s % 60;
			h = Math.floor(m / 60);
			m = m % 60; // -1 here
			d = Math.floor(h / 24);
			h = h % 24;
			let seczero, minzero, hourzero;
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
			msg.channel.send({embed: ({
				color: 3447003,
				title: `Streaming`,
				url: `${musicqueue[msg.guild.id]['music'][0]}`,
				description: `Streaming [${musicqueue[msg.guild.id]['music'][0]}](${musicqueue[msg.guild.id]['music'][0]}) for \`${hourzero}${h}:${minzero}${m}:${seczero}${s}\``,
				timestamp: new Date()
			})});
		}
	}).catch(console.error);
};

exports.info = {
	name: 'nowplaying',
	aliases: ['np','searchvideo','searchvid','viddetails','videodetails'],
	usage: 'nowplaying [url|search]',
	description: 'Shows the currently playing song.'
};
