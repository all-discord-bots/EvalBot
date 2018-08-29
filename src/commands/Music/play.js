const stream = require('youtube-audio-stream');
const ytdl = require('ytdl-core');
const { YTSearcher } = require('ytsearcher');
const ypi = require('youtube-playlist-info');
const Discord = require('discord.js');
require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	try {
		switch (args.length) {
			case 0:
				return msg.channel.send(`<:redx:411978781226696705> You must provide a url or search string!`);
		}
		if (!msg.member.voiceChannel) return msg.channel.send(`<:redx:411978781226696705> You must be in a voice channel!`);
		const search = new YTSearcher({
			key: process.env.YOUTUBE_API_KEY,
			revealkey: true
		});
		search.search(args.join(' '), { type: 'video' }).then((searchResult) => {
			let result = searchResult.first;
			//if (!result) return msg.channel.send(`<:redx:411978781226696705> Could not find this video.`).catch(err => console.error)
			// result.id = video id // result.channelID = channel id // result.url = full video url // result.title = video name // result.description = video description
			music_items[msg.guild.id].queue.push({
				title: `${result.title || 'N/A'}`,
				url: `${result.url}`,
				requester: msg.author
			});
			if (music_items[msg.guild.id].queue.length === 1 || !bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id)) executeQueue(music_items[msg.guild.id].queue);
			if (result.url) { // message information about the video on playing the video
				let thumbnail;
				if (result.thumbnails.default.url && !result.thumbnails.medium.url && !result.thumbnails.high.url) {
					thumbnail = `${result.thumbnails.default.url}`;
				} else if (result.thumbnails.default.url && result.thumbnails.medium.url && !result.thumbnails.high.url) {
					thumbnail = `${result.thumbnails.medium.url}`;
				} else if (result.thumbnails.default.url && result.thumbnails.medium.url && result.thumbnails.high.url) {
					thumbnail = `${result.thumbnails.high.url}`;
				}
				msg.channel.send({
					embed: ({
						color: 3447003,
						title: `${result.title} by ${result.channelTitle}`,
						url: `${result.url}`,
						description: `${result.description}`,
						thumbnail: {
							url: `${thumbnail}`
						},
						timestamp: new Date()
					})
				});
			}
		}).catch(err => console.error);
		// console.log(`${music_items[msg.guild.id].queue.toString()}`);
		function executeQueue(queue) {
			// If the queue is empty, finish.
			if (queue.length <= 0) {
				msg.channel.send(`<:check:411976443522711552> Playback finished.`);
				// Leave the voice channel.
				const voiceConnection = bot.voiceConnections.get(msg.guild.id);
				if (voiceConnection !== null) return voiceConnection.disconnect();
			}
			new Promise((resolve, reject) => {
				// Join the voice channel if not already in one.
				const voiceConnection = bot.voiceConnections.get(msg.guild.id);
				if (!msg.member.voiceChannel) return msg.channel.send(`<:redx:411978781226696705> You must be in a voice channel!`).catch(err => console.error)
				if (voiceConnection === null) {
					// Check if the user is in a voice channel.
					if (msg.member.voiceChannel && msg.member.voiceChannel.joinable) {
						msg.member.voiceChannel.join().then((connection) => {
							resolve(connection);
						}).catch((error) => {
							console.error(error.toString());
						});
					} else if (!msg.member.voiceChannel.joinable) {
						msg.channel.send(`<:redx:411978781226696705> I do not have permission to join your voice channel!`);
						reject();
					} else {
						// Otherwise, clear the queue and do nothing.
						queue.splice(0, queue.length);
						reject();
					}
				} else {
					resolve(voiceConnection);
				}
			}).then((connection) => {
				// Get the first item in the queue.
				const video = queue[0].url;
				// Play the video.
				try {
					//if (!musicbot.global) {
					//  const lvid = musicbot.getLast(msg.guild.id);
					//  musicbot.setLast(msg.guild.id, video);
					//  if (lvid !== video) musicbot.np(msg);
					//};
					music_items[msg.guild.id].is_streaming = false;
					let dispatcher = music_items[msg.guild.id].stream_mode == 0 ? connection.playStream(ytdl(video.toString(), { filter: 'audioonly' }), { volume: (music_items[msg.guild.id].volume / 100) }) : connection.playStream(stream(video.toString()), { volume: (music_items[msg.guild.id].volume / 100) }); // YouTube, and Streams stream (1) is broken
					connection.on('error',(error) => {
						// Skip to the next song.
						console.error(`Dispatcher/connection: ${error.stack}`);
						if (msg && msg.channel) msg.channel.send(`<:redx:411978781226696705> Dispatcher error!\n\`${error}\``);
						queue.shift();
						executeQueue(music_items[msg.guild.id].queue);
					});
					dispatcher.on('error',(error) => {
						// Skip to the next song.
						console.error(`Dispatcher: ${error.stack}`);
						if (msg && msg.channel) msg.channel.send(`<:redx:411978781226696705> Dispatcher error!\n\`${error}\``);
						queue.shift();
						executeQueue(music_items[msg.guild.id].queue);
					});
					dispatcher.on('end',() => {
						// Wait a second.
						setTimeout(() => {
							if (music_items[msg.guild.id].loop_queue && !music_items[msg.guild.id].loop_song) {
								executeQueue(music_items[msg.guild.id].queue);
							} else if (!music_items[msg.guild.id].loop_queue && music_items[msg.guild.id].loop_song) {
								executeQueue(music_items[msg.guild.id].queue[0]); // do this until I have it remove the current playing item
							} else {
								if (queue.length > 0) {
									queue.shift(); // Remove the song from the queue
									executeQueue(music_items[msg.guild.id].queue); // Play the next song in the queue.
								}
							}
						}, 1000);
					});
				} catch (error) {
					console.error(error.toString());
				}
			}).catch((error) => {
				console.error(error.toString());
			});
		}
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'play',
	userPermissions: ['CONNECT'],
	clientPermissions: ['SPEAK','CONNECT'],
	usage: 'play <url | search>',
	examples: [
		'play Ozzy Osbourne - Crazy Train',
		'play Lamb of God - Blood of the Scribe',
		'play Nickleback - How you remind me'
	],
	description: 'Play audio from YouTube.'
};
