const stream = require('youtube-audio-stream');
const ytdl = require('ytdl-core');
const { YTSearcher } = require('ytsearcher');
const ypi = require('youtube-playlist-info');
require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	try {
		
		if (music_items[msg.guild.id].queue.length <= 0) {
			music_items[msg.guild.id].playback_duration = '';
		}
		
		switch (args.length) {
			case 0:
				return msg.channel.send(`<:redx:411978781226696705> You must provide a url or search string!`);
		}
		
		if (!msg.member.voice.channel) return msg.channel.send(`<:redx:411978781226696705> You must be in a voice channel!`);
		
		const search = new YTSearcher({
			key: process.env.YOUTUBE_API_KEY,
			revealkey: true
		});
		
		search.search(args.join(' '), { type: 'video' }).then((searchResult) => {
			let result = searchResult.first;
			//if (!result) return msg.channel.send(`<:redx:411978781226696705> Could not find this video.`).catch(err => console.error)
			// result.id = video id // result.channelID = channel id // result.url = full video url // result.title = video name // result.description = video description
			if (!result.url || !result.id) return msg.channel.send(`<:redx:411978781226696705> I was unable to find that video.`);
			music_items[msg.guild.id].queue.push({
				title: `${result.title || 'N/A'}`,
				url: `${result.url}`,
				id: `${result.id}`,
				requester: msg.author
			});
			
			if (music_items[msg.guild.id].queue.length === 1 || !msg.guild.voiceConnection) {
				executeQueue(music_items[msg.guild.id].queue);
			}
			
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
						title: `${result.title || 'N/A'} by ${result.channelTitle || 'N/A'}`,
						url: `${result.url}`,
						description: `${result.description || 'N/A'}`,
						thumbnail: {
							url: `${thumbnail}`
						},
						timestamp: new Date()
					})
				});
			}
		}).catch((err) => {
			return console.error(`${err.stack ? err.stack : err.toString()}`);
		});
		
		const executeQueue = ((queue) => {
			// If the queue is empty
			if (queue.length <= 0) {
				msg.channel.send(`<:check:411976443522711552> Playback finished.`);
				music_items[msg.guild.id].queue_position = 0;
				if (msg.guild.voiceConnection !== null) return msg.guild.voiceConnection.disconnect(); // Leave the voice channel.
			}
			
			new Promise((resolve, reject) => {
				// Join the voice channel if not already in one.
				if (!msg.member.voice.channel) return msg.channel.send(`<:redx:411978781226696705> You must be in a voice channel!`);
				if (msg.guild.voiceConnection === null) {
					// Check if the user is in a voice channel.
					if (msg.member.voice.channel && msg.member.voice.channel.joinable) {
						msg.member.voice.channel.join().then((connection) => {
							resolve(connection);
						}).catch((error) => {
							return console.error(`${error.stack ? error.stack : error.toString()}`);
						});
					} else if (!msg.member.voice.channel.joinable) {
						if (msg.member.voice.channel.full) {
							msg.channel.send(`<:redx:411978781226696705> I do not have permission to join your voice channel; it is full.`);
						} else {
							msg.channel.send(`<:redx:411978781226696705> I do not have permission to join your voice channel!`);
						}
						reject();
					} else {
						// Otherwise, clear the queue and do nothing.
						queue.splice(0, queue.length);
						reject();
					}
				} else {
					resolve(msg.guild.voiceConnection);
				}
			}).then((connection) => {
				const video = (music_items[msg.guild.id].loop_queue || music_items[msg.guild.id].loop_song) ? queue[music_items[msg.guild.id].queue_position].url : queue[0].url; // Get the audio to play from the queue.
				
				// Play the video.
				try {
					music_items[msg.guild.id].is_streaming = false;
					
					let dispatcher = music_items[msg.guild.id].stream_mode == 0 ? connection.play(ytdl(video.toString(), { filter: 'audioonly' }), { volume: (music_items[msg.guild.id].volume / 100) }) : connection.play(stream(video.toString()), { volume: (music_items[msg.guild.id].volume / 100) }); // Will Fix Soon // connection.playStream(stream(video.toString()), { volume: (music_items[msg.guild.id].volume / 100) }); // playStream
					
					/*connection.once('authenticated', () => {
						console.log('Connection has been successfully authenticated');
						connection.once('ready', () => {
							console.log('Connection is ready');
						});
					});*/
					
					connection.once('failed', (reason) => {
						console.error(`${reason.toString()}`);
						try {
							if (connection) {
								connection.disconnect();
							}
						} catch (err) {
							console.error(`${err.toString()}`);
						};
					});
					
					connection.once('error', (err) => {
						// Skip to the next song.
						console.error(`Dispatcher/connection: ${err.stack ? err.stack : err.toString()}`);
						if (msg && msg.channel) {
							msg.channel.send(`<:redx:411978781226696705> Dispatcher error!\n\`${err.toString()}\``);
						}
						queue.shift();
						executeQueue(music_items[msg.guild.id].queue);
					});
					
					dispatcher.once('error', (err) => {
						console.error(`Dispatcher: ${err.stack ? err.stack : err.toString()}`);
						if (msg && msg.channel) {
							msg.channel.send(`<:redx:411978781226696705> Dispatcher error!\n\`${err.toString()}\``);
						}
						queue.shift(); // Skip to the next song.
						executeQueue(music_items[msg.guild.id].queue);
					});
					
					dispatcher.once('end', () => {
						// Wait a second before continuing
						setTimeout(() => {
							if (music_items[msg.guild.id].loop_queue && !music_items[msg.guild.id].loop_song) {
								if (music_items[msg.guild.id].queue_position >= music_items[msg.guild.id].queue.length - 1) {
									music_items[msg.guild.id].queue_position = 0;
								} else {
									music_items[msg.guild.id].queue_position++;
								}
								executeQueue(music_items[msg.guild.id].queue);
							} else if (!music_items[msg.guild.id].loop_queue && music_items[msg.guild.id].loop_song) {
								executeQueue(music_items[msg.guild.id].queue);
							} else {
								music_items[msg.guild.id].queue_position = 0;
								if (queue.length > 0) {
									queue.shift(); // Skip to the next song.
									executeQueue(music_items[msg.guild.id].queue);
								}
							}
						}, 1000);
					});
				} catch (err) {
					return console.error(`${err.stack ? err.stack : err.toString()}`);
				};
			}).catch((err) => {
				return console.error(`${err.stack ? err.stack : err.toString()}`);
			});
		});
	} catch (err) {
		console.error(`${err.stack ? err.stack : err.toString()}`);
	};
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
