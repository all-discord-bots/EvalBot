const axios = require('axios');

exports.run = async (bot, msg, args) => {
	try {
		if (args.length <= 0) return msg.channel.send('<:redx:411978781226696705> You must provide a song to get lyrics for!');
		await axios({
			method: 'GET',
			url: `https://ksoft.derpyenterprises.org/lyrics?input=${encodeURIComponent(args.join(' '))}`,
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
				'Content-Type': 'application/json; charset=utf-8'
			}
		}).then(async(res) => {
			if (!res.data.data.length) return msg.channel.send(`Couldn't find lyrics for the song \`${args.join(' ')}\`.`);
			let song = res.data.data[0];
			try {
				let fetched_song = await axios.get(`https://makeitpersonal.co/lyrics?artist=${encodeURIComponent(song.artist)}&title=${encodeURIComponent(song.name)}`);
				song.lyrics = fetched_song.data
			} catch (e) {}
			song.lyrics = song.lyrics.replace(/^\n+/, '').replace(/\n{3,}/g, '\n\n').replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&quot;/g, '"').replace(/&OElig;/g, 'Œ').replace(/&oelig;/g, 'œ').replace(/&Scaron;/g, 'Š').replace(/&scaron;/g, 'š').replace(/&Yuml;/g, 'Ÿ').replace(/&circ;/g, 'ˆ').replace(/&tilde;/g, '˜').replace(/&ndash;/g, '–').replace(/&mdash;/g, '—').replace(/&lsquo;/g, '‘').replace(/&rsquo;/g, '’').replace(/&sbquo;/g, '‚').replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”').replace(/&bdquo;/g, '„').replace(/&dagger;/g, '†').replace(/&Dagger;/g, '‡').replace(/&permil;/g, '‰').replace(/&lsaquo;/g, '‹').replace(/&rsaquo;/g, '›').replace(/&euro;/g, '€').replace(/&copy;/g, '©').replace(/&trade;/g, '™').replace(/&reg;/g, '®').replace(/&nbsp;/g, ' ');
			if (song.lyrics) console.log(`Lyrics are ${song.lyrics.length}/2048 characters.`);
			song.lyrics = splitString(song.lyrics);
			let pagenum = 1;
			song.lyrics.forEach((page) => {
				msg.channel.send({
					embed: {
						description: page.toString() || 'N/A',
						thumbnail: {
							url: song.album_art ? song.album_art : undefined
						},
						timestamp: new Date(),
						color: 3447003,
						title: text_truncate(`${song.album ? '[' + song.album + '] ' : ''}${song.artist} - ${song.name}${song.album_year ? ' (' + song.album_year + ')' : ''}`, 256),
						author: {
							name: text_truncate(song.artist, 256) || 'N/A'
						},
						footer: {
							text: `Page: ${pagenum++ || 'N/A'}`
						}
					}
				});
			});
		}).catch((e) => console.error(e));
	} catch(e) {
		console.error(e);
	}
}

const text_truncate = (str, length, ending) => {
	if (length == null) length = 100;
	if (ending == null) ending = '...';
	if (str.length > length) {
		return str.substring(0, length - ending.length) + ending;
	} else {
		return str;
	}
}

const splitString = (string, prepend = '', append = '') => {
	const MESSAGE_CHAR_LIMIT = 2000;
	if (string.length <= MESSAGE_CHAR_LIMIT) return [string];
	const splitIndex = string.lastIndexOf('\n', MESSAGE_CHAR_LIMIT - prepend.length - append.length);
	const sliceEnd = splitIndex > 0 ? splitIndex : MESSAGE_CHAR_LIMIT - prepend.length - append.length;
	const rest = splitString(string.slice(sliceEnd), prepend, append);
	return [`${string.slice(0, sliceEnd)}${append}`, `${prepend}${rest[0]}`, ...rest.slice(1)];
}

exports.info = {
	name: 'lyrics',
	usage: 'lyrics <song>',
	examples: [
		'lyrics Underoath - On My Teeth'
	],
	description: 'Fetch lyrics for a given artist and song.'
};
