const { YTSearcher } = require('ytsearcher');
const Discord = require('discord.js');
require('../../conf/globals.js');

exports.run = async (bot, msg) => {
	const search = new YTSearcher({
		key: process.env.YOUTUBE_API_KEY,
		revealkey: true
	});
	search.search(musicqueue[msg.guild.id][0], { type: 'video' }).then(searchResult => {
		let result = searchResult.first;
		if (!result) return msg.channel.send(`<:redx:411978781226696705> Could not find this video.`).catch(console.error);
		//global.musicqueue.push(`${result.url}`); // result.id = video id // result.channelID = channel id // result.url = full video url // result.title = video name // result.description = video description
		if (result.url) { // message information about the video on playing the video
			msg.channel.send({embed: ({
				color: 3447003,
				title: `${result.title}`,
				url: `${result.url}`,
				description: `${result.description}`,
				fields: [
					{
						name: `**__Video Name__**`,
						value: `[${result.title}](${result.url}) \`${result.id}\``
					}, {
						name: `**__Channnel__**`,
						value: `[result.channelTitle](https://www.youtube.com/channel/${result.channelId}) ${result.channelId}`
					}, {
						name: `**__Thumbnails__**`,
						value: `[Default](${result.thumbnails.default.url}) \`${result.thumbnails.default.width}×${result.thumbnails.default.height}\`\n[Medium](${result.thumbnails.medium.url}) \`${result.thumbnails.medium.width}×${result.thumbnails.medium.height}\`\n[High](${result.thumbnails.high.url}) \`${result.thumbnails.high.width}×${result.thumbnails.high.height}\``
					}, {
						name: `**__Uploaded__**`,
						value: `${result.publishedAt}`
					}, {
						name: `**__Description__**`,
						value: `${result.description}`
					}
				],
				timestamp: new Date()
			})});
			// https://developers.google.com/youtube/v3/docs/activities
		}
	}}).catch(console.error);
};

exports.info = {
	name: 'nowplaying',
	aliases: ['np'],
	usage: 'nowplaying',
	description: 'Shows the currently playing song.'
};
