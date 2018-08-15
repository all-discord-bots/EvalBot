const lyricsFetcher = require("lyrics-fetcher");
exports.run = async (bot, msg, args) => {
	if (args.length < 1) return msg.channel.send(`<:redx:411978781226696705> You must provide an artist and song name!`).catch(console.error);
	let song = args.join(' ');
	let prefix;
	if (bot.config[msg.guild.id]) {
		prefix = bot.config[msg.guild.id].prefix;
	} else if (!bot.config[msg.guild.id]) {
		prefix = bot.config.prefix;
	}
	if (!song.includes('-')) return msg.channel.send(`<:redx:411978781226696705> Please seperate the Artist name from the Song Name using \`-\`.\nExample: \`${prefix}lyrics Slipknot - Dead Memories\``).catch(console.error);
	let gsong = song.split('-');
	if (gsong.length !== 2) return msg.channel.send(`<:redx:411978781226696705> You must provide an artist and song name!`).catch(console.error);
	let artist = `${gsong[0]}`;
	let song_name = `${gsong[1]}`;
	lyricsFetcher.fetch(`${artist.toString() || 'THIS IS HERE TO FORCE A FAKE ARTIST NAME'}`, `${song_name.toString() || 'THIS IS HERE TO FORCE A FAKE SONG NAME'}`, function (err, lyrics) {
		if (err) return msg.channel.send(`<:redx:411978781226696705> ${err}`).catch(console.error);
		if (lyrics) {
			console.log(`Lyrics are ${lyrics.length}/2048 characters.`);
		}
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
		//if (lyrics && lyrics.length > 2048) return msg.channel.send(`<:redx:411978781226696705> Lyrics exceeded the maximum length. Lyrics were \`${lyrics.length}/2048\` characters.`).catch(console.error);
		if (artist && artist.toString().length > 2048) return msg.channel.send(`<:redx:411978781226696705> Artist name exceeded the maximum length. Artist name was \`${artist.toString().length}/2048\` characters.`).catch(console.error);
		if (song_name && song_name.toString().length > 2048) return msg.channel.send(`<:redx:411978781226696705> Song name exceeded the maximum length. Song name was \`${song_name.toString().length}/2048\` characters.`).catch(console.error);
		let pagenum = 1;
		lyric.forEach(glyrics => {
			msg.channel.send({embed: ({
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
			})});
		});
	});
};

exports.info = {
	name: 'lyrics',
	usage: 'lyrics <artist> <song>',
	examples: [
		'lyrics Ozzy Osbourne - Crazy Train'
	],
	description: 'Fetch lyrics for a given artist and song.'
};
