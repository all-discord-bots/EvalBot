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
	let artist = `${gsong[0]}`;
	let song_name = `${gsong[1]}`;
	lyricsFetcher.fetch(`${artist.toString()}`, `${song_name.toString()}`, function (err, lyrics) {
		if (err) return msg.channel.send(`<:redx:411978781226696705> ${err}`).catch(console.error);
		if (lyrics) {
			console.log(`Lyrics are ${lyrics.length}/2048 characters.`);
		}
		if (lyrics && lyrics.length > 2048) return msg.channel.send(`<:redx:411978781226696705> Lyrics exceeded the maximum length. Lyrics were \`${lyrics.length}/2048\` characters.`).catch(console.error);
		msg.channel.send({embed: ({
			color: 3447003,
			title: `${song_name.toString()}`,
			author: {
				name: `${artist.toString()}`
			}, footer: {
				name: `${artist.toString()} - ${song_name.toString()}`
			},
			description: `${lyrics}`,
			timestamp: new Date()
		})});
	});
};

exports.info = {
	name: 'lyrics',
	usage: 'lyrics <artist> <song>',
	description: 'Fetch lyrics for a given artist and song.'
};
