const lyricsFetcher = require("lyrics-fetcher");

exports.run = async (bot, msg, args) => {
	try {
		if (args.length <= 0) return msg.channel.send(`<:redx:411978781226696705> You must provide an artist and song name!`).catch(err => console.error);
		let song = args.join(' ');
		let prefix = msg.guild ? (bot.config[msg.guild.id] ? bot.config[msg.guild.id].prefix : bot.config.prefix) : bot.config.prefix
		// let prefix = msg.guild && (bot.config[msg.guild.id.toString()] && bot.config[msg.guild.id.toString()].prefix) || bot.config.prefix;
		if (!song.includes('-')) return msg.channel.send(`<:redx:411978781226696705> Please seperate the Artist name from the Song Name using \`-\`.\nExample: \`${prefix}lyrics Slipknot - Dead Memories\``).catch(err => console.error);
		let gsong = song.split('-');
		if (gsong.length < 2) return msg.channel.send(`<:redx:411978781226696705> You must provide an artist and song name!`).catch(err => console.error);
		let artist = `${gsong[0]}`;
		let song_name = `${gsong[1]}`;
		lyricsFetcher.fetch(`${artist.toString() || 'THIS IS HERE TO FORCE A FAKE ARTIST NAME'}`, `${song_name.toString() || 'THIS IS HERE TO FORCE A FAKE SONG NAME'}`, function(err, lyrics) {
			if (err) return msg.channel.send(`<:redx:411978781226696705> ${err}`).catch(err => console.error);
			if (lyrics.includes("Something went wrong!!! :-(")) {
				if (artist.toLowerCase() === 'beneath my feet' && song_name.toLowerCase() === 'sink to the bottom or swim for the shore') {
					lyrics = "[Verse 1]\nYou're crossing the ocean where many got lost\nYou're facing the danger with all that you’ve got\nAn ocean of bodies with a rotten smell\nCold and relentless, where agony dwells\nAlone and afraid you can feel it within\nWhile the waves they are crashing and whipping your skin\nFight the ocean, fight its will\nReady to slaughter, ready to kill\n\n[Pre-Chorus]\nSwim! Swim!\nSwim! Swim!\nSwim on the waves you will ascend\nSwim for your safety and revenge\nSwim it is your life you must defend\nSwim or prepare to meet the end\n\n[Chorus]\nGive it all you've got\nYour life depends on how this ends\nSo sink to the bottom or swim for the shore\nGo on and live your life as long as you may\nSwim with desire like never before\nSo sink to the bottom or swim for the shore\n\n(Swim for the shore)\n(Swim for the shore)\n\n[Verse 2]\nYou left your home now there's no turning back\nFor where your home once were, is now under attack\nYou flee the war and you get blamed when in fact\nYou face the effect of someone else's fucking act\nThe ocean awakes, prepares to entomb\nYou try to hold on but there's not enough room\nYou're gasping for air while the water consumes\nThis is your last chance, this is your doom\n\n[Pre-Chorus]\nSwim! Swim!\nSwim! Swim!\nSwim on the waves you will ascend\nSwim for your safety and revenge\nSwim it is your life you must defend\nSwim or prepare to meet the end\n\n[Chorus]\nGive it all you've got\nYour life depends on how this ends\nSo sink to the bottom or swim for the shore\nGo on and live your life as long as you may\nSwim with desire like never before\nSo sink to the bottom or swim for the shore\n\nSwim!\n\n[Chorus]\nGive it all you've got\nYour life depends on how this ends\nSo sink to the bottom or swim for the shore\nGo on and live your life as long as you may\nSwim with desire like never before\nSo sink to the bottom or swim for the shore";
				} else {
					msg.channel.send('Could not find lyrics for that song!');
				}
			}
			if (lyrics) console.log(`Lyrics are ${lyrics.length}/2048 characters.`);
			const MESSAGE_CHAR_LIMIT = 2000;
			const splitString = (string, prepend = '', append = '') => {
				if (string.length <= MESSAGE_CHAR_LIMIT) {
					return [string];
				}
				const splitIndex = string.lastIndexOf('\n', MESSAGE_CHAR_LIMIT - prepend.length - append.length);
				const sliceEnd = splitIndex > 0 ? splitIndex : MESSAGE_CHAR_LIMIT - prepend.length - append.length;
				const rest = splitString(string.slice(sliceEnd), prepend, append);
				return [`${string.slice(0, sliceEnd)}${append}`, `${prepend}${rest[0]}`, ...rest.slice(1)];
			};
			let lyric = splitString(`${lyrics}`);
			//if (lyrics && lyrics.length > 2048) return msg.channel.send(`<:redx:411978781226696705> Lyrics exceeded the maximum length. Lyrics were \`${lyrics.length}/2048\` characters.`).catch(err => console.error);
			if (artist && artist.toString().length > 2048) return msg.channel.send(`<:redx:411978781226696705> Artist name exceeded the maximum length. Artist name was \`${artist.toString().length}/2048\` characters.`).catch(err => console.error);
			if (song_name && song_name.toString().length > 2048) return msg.channel.send(`<:redx:411978781226696705> Song name exceeded the maximum length. Song name was \`${song_name.toString().length}/2048\` characters.`).catch(err => console.error);
			let pagenum = 1;
			lyric.forEach((glyrics) => {
				msg.channel.send({embed: {
					color: 3447003,
					title: `${song_name.toString() || 'N/A'}`,
					author: {
						name: `${artist.toString() || 'N/A'}`
					}, footer: {
						//text: `${artist.toString() || 'N/A'} - ${song_name.toString() || 'N/A'}`
						text: `Page: ${pagenum++ || 'N/A'}`
					},
					description: `${glyrics.toString() || 'N/A'}`,
					timestamp: new Date()
				}});
			});
		});
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'lyrics',
	usage: 'lyrics <artist> <song>',
	examples: [
		'lyrics Ozzy Osbourne - Crazy Train'
	],
	description: 'Fetch lyrics for a given artist and song.'
};
