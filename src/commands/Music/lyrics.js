const axios = require('axios');

exports.run = async (bot, msg, args) => {
	try {
		if (args.length <= 0) return msg.channel.send('<:redx:411978781226696705> You must provide a song to get lyrics for!');
		await axios({
			method: 'GET',
			url: `https://api.audd.io/findLyrics/?itunes_country=us&api_token=${process.env.AUDD_LYRICS_TOKEN}&q=${encodeURIComponent(args.join(' '))}`,
			//url: ``,
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
				'Content-Type': 'application/json; charset=utf-8'
			}
		}).then(async(res) => {
			if (!res.data.result.length) return msg.channel.send(`Couldn't find lyrics for the song \`${args.join(' ')}\`.`);
			let audd_song = res.data.result[0];
			/*
				{
					"status": "success",
					"result": [
							{
								"song_id": "4149214",
								"artist_id": "1573199",
								"title": "Sink To The Bottom Or Swim For The Shore",
								"title_with_featured": "Sink To The Bottom Or Swim For The Shore",
								"full_title": "Sink To The Bottom Or Swim For The Shore by Beneath My Feet",
								"artist": "Beneath My Feet",
								"lyrics": "[Verse 1]\nYou're crossing the ocean where many got lost\nYou're facing the danger with all that you’ve got\nAn ocean of bodies with a rotten smell\nCold and relentless, where agony dwells\nAlone and afraid you can feel it within\nWhile the waves they are crashing and whipping your skin\nFight the ocean, fight its will\nReady to slaughter, ready to kill\n\n[Pre-Chorus]\nSwim! Swim!\nSwim! Swim!\nSwim on the waves you will ascend\nSwim for your safety and revenge\nSwim it is your life you must defend\nSwim or prepare to meet the end\n\n[Chorus]\nGive it all you've got\nYour life depends on how this ends\nSo sink to the bottom or swim for the shore\nGo on and live your life as long as you may\nSwim with desire like never before\nSo sink to the bottom or swim for the shore\n(Swim for the shore)\n(Swim for the shore)\n\n[Verse 2]\nYou left your home now there's no turning back\nFor where your home once were, is now under attack\nYou flee the war and you get blamed when in fact\nYou face the effect of someone else's fucking act\nThe ocean awakes, prepares to entomb\nYou try to hold on but there's not enough room\nYou're gasping for air while the water consumes\nThis is your last chance, this is your doom\n\n[Pre-Chorus]\nSwim! Swim!\nSwim! Swim!\nSwim on the waves you will ascend\nSwim for your safety and revenge\nSwim it is your life you must defend\nSwim or prepare to meet the end\n\n[Chorus]\nGive it all you've got\nYour life depends on how this ends\nSo sink to the bottom or swim for the shore\nGo on and live your life as long as you may\nSwim with desire like never before\nSo sink to the bottom or swim for the shore\nSwim!\n\n[Chorus]\nGive it all you've got\nYour life depends on how this ends\nSo sink to the bottom or swim for the shore\nGo on and live your life as long as you may\nSwim with desire like never before\nSo sink to the bottom or swim for the shore",
								"media": "[{\"provider\":\"soundcloud\",\"type\":\"audio\",\"url\":\"https://soundcloud.com/beneathmyfeet/beneath-my-feet-sink-to-the-bottom-or-swim-for-the-shore\"},{\"provider\":\"youtube\",\"type\":\"video\",\"url\":\"http://www.youtube.com/watch?v=jCqKkC4aiEc\"}]"
							}
					]
				}
				
				{
					"status": "success",
					"result": []
				}
			*/
			let ksoft_res = await axios.get('https://ksoft.derpyenterprises.org/lyrics?input=' + encodeURIComponent(`${audd_song.artist} - ${audd_song.title}`));
			if (ksoft_res.data.data.length) {
				let ksoft_song = ksoft_res.data.data[0];
				if (!audd_song.lyrics && ksoft_song.lyrics) {
					audd_song.lyrics = ksoft_song.lyrics;
				} else if (!audd_song.lyrics && !ksoft_song.lyrics) {
					try {
						let mip_lyrics = await axios.get(`https://makeitpersonal.co/lyrics?artist=${encodeURIComponent(audd_song.artist)}&title=${encodeURIComponent(audd_song.title)}`);
						audd_song.lyrics = mip_lyrics.data;
					} catch (e) {}
				}
				audd_song.album = ksoft_song.album;
				audd_song.album_ids = ksoft_song.album_ids;
				audd_song.album_year = ksoft_song.album_year;
				audd_song.album_art = ksoft_song.album_art;
				audd_song.artist_id = ksoft_song.artist_id;
				audd_song.search_str = ksoft_song.search_str;
				audd_song.popularity = ksoft_song.popularity;
				audd_song.id = ksoft_song.id;
				audd_song.search_score = ksoft_song.search_score;
			}
			/*
				{
					"total": 415825,
					"took": 27,
					"data": [
							{
								"artist": "Beneath My Feet",
								"artist_id": "-1",
								"album": null,
								"album_ids": "-1",
								"album_year": "2017",
								"name": "Sink To The Bottom Or Swim For The Shore",
								"lyrics": "\nYou're crossing the ocean where many got lost\nYou're facing the danger with all that you’ve got\nAn ocean of bodies with a rotten smell\nCold and relentless, where agony dwells\nAlone and afraid you can feel it within\nWhile the waves they are crashing and whipping your skin\nFight the ocean, fight its will\nReady to slaughter, ready to kill\n\n\nSwim! Swim!\nSwim! Swim!\nSwim on the waves you will ascend\nSwim for your safety and revenge\nSwim it is your life you must defend\nSwim or prepare to meet the end\n\n\nGive it all you've got\nYour life depends on how this ends\nSo sink to the bottom or swim for the shore\nGo on and live your life as long as you may\nSwim with desire like never before\nSo sink to the bottom or swim for the shore\n\n(Swim for the shore)\n(Swim for the shore)\n\n\nYou left your home now there's no turning back\nFor where your home once were, is now under attack\nYou flee the war and you get blamed when in fact\nYou face the effect of someone else's fucking act\nThe ocean awakes, prepares to entomb\nYou try to hold on but there's not enough room\nYou're gasping for air while the water consumes\nThis is your last chance, this is your doom\n\n\nSwim! Swim!\nSwim! Swim!\nSwim on the waves you will ascend\nSwim for your safety and revenge\nSwim it is your life you must defend\nSwim or prepare to meet the end\n\n\nGive it all you've got\nYour life depends on how this ends\nSo sink to the bottom or swim for the shore\nGo on and live your life as long as you may\nSwim with desire like never before\nSo sink to the bottom or swim for the shore\n\nSwim!\n\n\nGive it all you've got\nYour life depends on how this ends\nSo sink to the bottom or swim for the shore\nGo on and live your life as long as you may\nSwim with desire like never before\nSo sink to the bottom or swim for the shore",
								"album_art": "https://images.genius.com/3209f830ba0ae74a793eb9734de7bb89.960x960x1.jpg",
								"search_str": "Beneath My Feet Sink To The Bottom Or Swim For The Shore",
								"popularity": 1,
								"id": "-1",
								"search_score": 50
							}
					]
				}

				{
					"total": 415510,
					"took": 70,
					"data": []
				}
			*/
			/*try {
				let fetched_song = await axios.get(`https://makeitpersonal.co/lyrics?artist=${encodeURIComponent(song.artist)}&title=${encodeURIComponent(song.name)}`);
				song.lyrics = fetched_song.data
			} catch (e) {}*/
			audd_song.lyrics = audd_song.lyrics.replace(/^\n+/, '').replace(/\n{3,}/g, '\n\n').replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&quot;/g, '"').replace(/&OElig;/g, 'Œ').replace(/&oelig;/g, 'œ').replace(/&Scaron;/g, 'Š').replace(/&scaron;/g, 'š').replace(/&Yuml;/g, 'Ÿ').replace(/&circ;/g, 'ˆ').replace(/&tilde;/g, '˜').replace(/&ndash;/g, '–').replace(/&mdash;/g, '—').replace(/&lsquo;/g, '‘').replace(/&rsquo;/g, '’').replace(/&sbquo;/g, '‚').replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”').replace(/&bdquo;/g, '„').replace(/&dagger;/g, '†').replace(/&Dagger;/g, '‡').replace(/&permil;/g, '‰').replace(/&lsaquo;/g, '‹').replace(/&rsaquo;/g, '›').replace(/&euro;/g, '€').replace(/&copy;/g, '©').replace(/&trade;/g, '™').replace(/&reg;/g, '®').replace(/&nbsp;/g, ' ');
			if (audd_song.lyrics) console.log(`Lyrics are ${audd_song.lyrics.length}/2048 characters.`);
			audd_song.lyrics = splitString(audd_song.lyrics);
			let pagenum = 1;
			audd_song.lyrics.forEach((page) => {
				msg.channel.send({
					embed: {
						description: page.toString() || 'N/A',
						thumbnail: {
							url: audd_song.album_art ? audd_song.album_art : undefined
						},
						timestamp: new Date(),
						color: 3447003,
						title: text_truncate(`${audd_song.album ? '[' + audd_song.album + '] ' : ''}${audd_song.artist} - ${audd_song.title}${audd_song.album_year ? ' (' + audd_song.album_year + ')' : ''}`, 256),
						author: {
							name: text_truncate(audd_song.artist, 256) || 'N/A'
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
