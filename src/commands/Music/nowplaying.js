const { YTSearcher } = require('ytsearcher');
const Discord = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	const search = new YTSearcher({
		key: process.env.YOUTUBE_API_KEY,
		revealkey: true
	});
	let gvid = args.join(' ');
	let gsearch;
	if (!args[0]) {
		if (musicqueue[msg.guild.id].length < 1) return msg.channel.send(`<:redx:411978781226696705> There are no videos queued!`).catch(console.error);
		gsearch = musicqueue[msg.guild.id][0];
	} else if (args[0]) {
		gsearch = gvid;
	}
	search.search(gsearch, { type: 'video' }).then(searchResult => {
		let result = searchResult.first;
		if (!result) return msg.channel.send(`<:redx:411978781226696705> Could not get the video.`).catch(console.error);
		//global.musicqueue.push(`${result.url}`); // result.id = video id // result.channelID = channel id // result.url = full video url // result.title = video name // result.description = video description
		if (result.url) { // message information about the video on playing the video
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
			msg.channel.send({embed: ({
				color: 3447003,
				title: `${result.title}`,
				url: `${result.url}`,
				"thumbnail": {
					url: `${result.thumbnails.default.url}`
				}, fields: [
					{
						name: `**__Video__**`,
						value: `[${result.title}](${result.url}) \`${result.id}\``
					}, {
						name: `**__Channel__**`,
						value: `[result.channelTitle](https://www.youtube.com/channel/${result.channelId}) \`${result.channelId}\``
					}, {
						name: `**__Thumbnails__**`,
						value: `${dthumbnail}${mthumbnail}${hthumbnail}`
					}, {
						name: `**__Uploaded__**`,
						value: `${moment.utc(udate).format("LLLL")} \`${result.publishedAt}\``
					}, {
						name: `**__Description__**`,
						value: `${result.description}`
					}
				],
				timestamp: new Date()
			})});
			// https://developers.google.com/youtube/v3/docs/activities
		}
	}).catch(console.error);
};

exports.info = {
	name: 'nowplaying',
	aliases: ['np','searchvideo','searchvid','viddetails','videodetails'],
	usage: 'nowplaying [url|search]',
	description: 'Shows the currently playing song.'
};
