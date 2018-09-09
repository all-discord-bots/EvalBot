require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	try {
		let radio_stations_array = Object.keys(built_in_radio);
		switch (args.length) {
			case 0:
				let radio_stations = '';
				radio_stations += radio_stations_array.join('\n');
				return msg.channel.send({
					embed: ({
						color: 3447003,
						title: `__**Radio Stations**__`,
						description: `${radio_stations}`,
						timestamp: new Date()
					})
				});
		}
		if (!msg.member.voiceChannel) return msg.channel.send(`<:redx:411978781226696705> You must be in a voice channel!`);
		if (get_video_id(args.join(' '))) return msg.channel.send(`<:redx:411978781226696705> You can play YouTube videos using the \`play\` command. Please specify a radio station url.`);
		if (args.join(' ').length <= 3) return msg.channel.send(`<:redx:411978781226696705> You must provide a valid stream url to play or built-in radio station name!`);
		let filtered_built_in_radio_stations = radio_stations_array.map((list) => list.toLowerCase()).filter((list) => list.toLowerCase().startsWith(args.join(' ').toLowerCase()));
		
		if (filtered_built_in_radio_stations.length >= 2) return msg.channel.send(`<:redx:411978781226696705> Too many results found, try to be a bit more specific with the radio name.\nIf you keep receiving this error please contact the developer!`);
		
		if (filtered_built_in_radio_stations.length == 1) {
			Object.keys(built_in_radio).forEach((key,index) => {
				if (key.toLowerCase().startsWith(`${filtered_built_in_radio_stations[0].toLowerCase()}`) {
					let api_url = (built_in_radio[key].playlist_api === '') ? null : built_in_radio[key].playlist_api;
					music_items[msg.guild.id].queue.push({
						title: `${key}`,
						url: `${built_in_radio[key].stream}`,
						id: null,
						playlist_api: api_url,
						requester: msg.author
					});
				}
			});
		} else if (new RegExp(`^((https?|ftp)(:|%3A)(\/\/|%2F%2F).+)`).test(args.join(' '))) {
			music_items[msg.guild.id].queue.push({
				title: `${args.join(' ')}`,
				url: `${args.join(' ')}`,
				id: null,
				playlist_api: null,
				requester: msg.author
			});
		} else {
			return msg.channel.send(`<:redx:411978781226696705> You must provide a valid stream url to play or built-in radio station name!`);
		}
		
		if (music_items[msg.guild.id].queue.length >= 2) {
			try {
				music_items[msg.guild.id].queue.shift();
				const voiceConnection = bot.voiceConnections.find((val) => val.channel.guild.id == msg.guild.id);
				// might need to add a check to the voiceConnection here.
				if (voiceConnection !== null) {
					const dispatcher = voiceConnection.player.dispatcher;
					if (voiceConnection.paused) dispatcher.resume();
					dispatcher.end();
				}
			} catch (err) {
				console.error(err.toString());
			}
		}
		if (music_items[msg.guild.id].queue.length === 1 || !bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id)) {
			executeQueue(music_items[msg.guild.id].queue);
		}
		
		msg.channel.send(`<:check:411976443522711552> Streaming \`${music_items[msg.guild.id].queue[0].title}\`.`);
		
		function executeQueue(queue) {
			new Promise((resolve, reject) => {
				const voiceConnection = bot.voiceConnections.find((val) => val.channel.guild.id == msg.guild.id);
				// Join the voice channel if not already in one.
				if (!msg.member.voiceChannel) return msg.channel.send(`<:redx:411978781226696705> You must be in a voice channel!`);
				if (voiceConnection === null) {
					// Check if the user is in a voice channel.
					if (msg.member.voiceChannel && msg.member.voiceChannel.joinable) {
						msg.member.voiceChannel.join().then((connection) => {
							resolve(connection);
						}).catch((err) => {
							return console.error(err.toString());
						});
					} else if (!msg.member.voiceChannel.joinable) {
						if (msg.member.voiceChannel.full) {
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
					resolve(voiceConnection);
				}
			}).then((connection) => {
				try {
					music_items[msg.guild.id].is_streaming = true;
					music_items[msg.guild.id].queue_position = 0;
					music_items[msg.guild.id].loop_queue = false;
					music_items[msg.guild.id].loop_song = false;
					
					let dispatcher = connection.playStream(queue[0].url, { filter: 'audioonly' }, { volume: (music_items[msg.guild.id].volume / 100) }); // Radio
					
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
						console.error(`Dispatcher/connection: ${err.stack ? err.stack : err.toString()}`);
						if (msg && msg.channel) {
							msg.channel.send(`<:redx:411978781226696705> Dispatcher error!\n\`${err.toString()}\``);
						}
						queue.shift(); // Skip to the next audio.
						executeQueue(music_items[msg.guild.id].queue);
					});
					
					dispatcher.once('error', (err) => {
						console.error(`Dispatcher: ${err.stack ? err.stack : err.toString()}`);
						if (msg && msg.channel) msg.channel.send(`<:redx:411978781226696705> Dispatcher error!\n\`${err.toString()}\``);
						queue.shift(); // Skip to the next audio.
						executeQueue(music_items[msg.guild.id].queue);
					});
					
					dispatcher.once('end', () => {
						// Wait a second.
						setTimeout(() => {
							if (queue.length > 0) {
								queue.shift();
								executeQueue(music_items[msg.guild.id].queue);
							}
						}, 1000);
					});
				} catch (err) {
					return console.error(`${err.stack ? err.stack : err.toString()}`);
				}
			}).catch((err) => {
				return console.error(`${err.stack ? err.stack : err.toString()}`);
			});
		}
	} catch (err) {
		console.error(`${err.stack ? err.stack : err.toString()}`);
	}
};

const get_video_id = (string) => {
	return Boolean(new RegExp(/(?:\?v=|&v=|youtu\.be\/)(.*?)(?:\?|&|$)/).test(string));
};

exports.info = {
	name: 'radio',
	aliases: ['station','radio-station'],
	userPermissions: ['CONNECT'],
	clientPermissions: ['CONNECT','SPEAK'],
	usage: 'radio [station name | stream url]',
	examples: [
		'radio',
		'radio Fun Radio',
		'radio ca.radioboss.fm:8137/stream%26t%3D%26r%3D4RBS4'
	],
	description: 'Stream a radio station to a voice channel. You can use a station name or a stream url to play the station. Use this command without arguments to view a list of the current stations.'
};
