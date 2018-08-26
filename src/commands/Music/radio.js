require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
	try {
		let radiostationsqueue = [
			'Fun Radio',
			'1.FM Absolute Top 40',
			'977 Hits',
			'Absolute Radio',
			'Heart',
			'Christian Music',
			'Christian Teaching and Talk',
			'Todays Christian Music',
			'OpenFM 100% Metallica',
			'North Pole Radio',
			'Metal Rock FM',
			'Icecast Metal',
			'Metal Nation',
			'Streamer Radio Metal',
			'Hard Radio',
			'Stream The World',
			'NC Weather'
		];
		switch (args.length) {
			case 0:
				return msg.channel.send({
					embed: ({
						color: 3447003,
						title: `__**Radio Stations**__`,
						description: `${radiostationsqueue.toString().replace(/[,]/gi, '\n')}`,
						timestamp: new Date()
					})
				});
		}
		if (!msg.member.voiceChannel) return msg.channel.send(`<:redx:411978781226696705> You must be in a voice channel!`).catch((err) => console.error);
		if (get_video_id(args.join(' ').toString())) return msg.channel.send(`<:redx:411978781226696705> You can play YouTube videos using the \`play\` command. Please specify a radio station url.`);
		let getarg = args.join(' ').toLowerCase().toString();
		if (getarg.length <= 3) return msg.channel.send(`<:redx:411978781226696705> You must provide a valid stream.`);
		let filteredbuiltinradio = radiostationsqueue.map((list) => list.toLowerCase().toString()).filter(list => list.toLowerCase().startsWith(getarg.toString()));
		let queuethis;
		let playingbuiltinstations = false;
		if (filteredbuiltinradio.length > 0 && filteredbuiltinradio.length < 2) {
			playingbuiltinstations = true;
			queuethis = builtinradio[filteredbuiltinradio[0].toLowerCase()];
		} else if (filteredbuiltinradio.length > 1) {
			return msg.channel.send(`<:redx:411978781226696705> Too many results found, try to be a bit more specific with the radio name.\nIf you keep receiving this error please contact the developer!`).catch((err) => console.error);
		} else if (getarg.includes('.') || getarg.startsWith('http')) {
			playingbuiltinstations = false;
			queuethis = getarg.toString();
		} else {
			return msg.channel.send(`<:redx:411978781226696705> Please provide a valid stream url to play or built-in radio station name!`);
		}
		musicqueue[msg.guild.id]['music'].push(`${queuethis.toString()}`);
		if (musicqueue[msg.guild.id]['music'].length >= 2) {
			musicqueue[msg.guild.id]['music'].shift();
			try {
				const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
				const dispatcher = voiceConnection.player.dispatcher;
				if (voiceConnection.paused) dispatcher.resume();
				dispatcher.end();
			} catch (err) {
				console.error(err.toString());
			}
		}
		if (musicqueue[msg.guild.id]['music'].length === 1 || !bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id)) {
			executeQueue(musicqueue[msg.guild.id]['music']);
		}
		let streamingmsg;
		if (playingbuiltinstations) {
			streamingmsg = filteredbuiltinradio[0];
		} else if (!playingbuiltinstations) {
			streamingmsg = args.join(' ').toString();
		}
		msg.channel.send(`<:check:411976443522711552> Streaming \`${streamingmsg.toString()}\`.`);
		//console.log(`${musicqueue[msg.guild.id]['music'].toString()}`);

		let musicbot = {
			defVolume: 100 // The default volume of music. 1 - 200, defaults 50.
			// https://www.npmjs.com/package/discord.js-musicbot-addon
		};

		function executeQueue(queue) {
			new Promise((resolve, reject) => {
				const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
				// Join the voice channel if not already in one.
				if (!msg.member.voiceChannel) return msg.channel.send(`<:redx:411978781226696705> You must be in a voice channel!`).catch((err) => console.error);
				if (voiceConnection === null) {
					// Check if the user is in a voice channel.
					if (msg.member.voiceChannel && msg.member.voiceChannel.joinable) {
						msg.member.voiceChannel.join().then((connection) => {
							resolve(connection);
						}).catch((error) => {
							return console.error(error.toString());
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
				const video = queue[0];

				// Play the video.
				try {
					musicqueue[msg.guild.id]['streaming'] = true;
					let dispatcher = connection.playStream(video.toString(), { filter: 'audioonly' }, { volume: (musicbot.defVolume / 100) }); // Radio
					
					connection.on('error',(error) => {
						// Skip to the next song.
						console.log(`Dispatcher/connection: ${error}`);
						if (msg && msg.channel) {
							console.error(error.toString());
							msg.channel.send(`<:redx:411978781226696705> Dispatcher error!\n\`${error}\``);
						}
						queue.shift();
						executeQueue(musicqueue[msg.guild.id]['music']);
					});
					
					dispatcher.on('error',(error) => {
						// Skip to the next song.
						console.error(`Dispatcher: ${error}`);
						if (msg && msg.channel) msg.channel.send(`<:redx:411978781226696705> Dispatcher error!\n\`${error}\``);
						queue.shift();
						executeQueue(musicqueue[msg.guild.id]['music']);
					});
					
					dispatcher.on('end',() => {
						// Wait a second.
						setTimeout(() => {
							if (queue.length > 0) {
								// Remove the song from the queue.
								queue.shift();
								// Play the next song in the queue.
								executeQueue(musicqueue[msg.guild.id]['music']);
							}
						}, 1000);
					});
				} catch (error) {
					return console.error(error);
				}
			}).catch((error) => {
				return console.error(error);
			});
		}
	} catch (err) {
		console.error(err.toString());
	}
};

const get_video_id = (string) => {
	return Boolean(new RegExp(/(?:\?v=|&v=|youtu\.be\/)(.*?)(?:\?|&|$)/).test(string));
};

exports.info = {
	name: 'radio',
	aliases: ['station', 'radio-station'],
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
