const music_items = global.music_items = {};
const songqueue = global.songqueue = {};
const built_in_radio = global.built_in_radio = {
	'Fun Radio': {
		'stream': 'http://streaming.radio.funradio.fr/fun-1-44-128',
		'playlist_api': ''
	},
	'1.FM Absolute Top 40': {
		'stream': 'http://strm112.1.fm/top40_mobile_mp3',
		'playlist_api': ''
	},
	'977 Hits': {
		'stream': 'http://19353.live.streamtheworld.com/977_HITS_SC',
		'playlist_api': ''
	},
	'Absolute Radio': {
		'stream': 'http://icy-e-bab-09-boh.sharp-stream.com/absoluteradio.mp3',
		'playlist_api': ''
	},
	'Heart': {
		'stream': 'http://media-ice.musicradio.com/HeartSouthWalesMP3',
		'playlist_api': 'https://onlineradiobox.com/json/uk/heart970/playlist/?cs=uk.heart970'
	},
	'Heavy Metal Radio': {
		'stream': 'http://www.heavymetalradio.com:8000/;',
		'playlist_api': ''
	},
	'Metal Hammer Radio': {
		'stream': 'http://metal-hammer.stream.laut.fm/metal-hammer?ref=radiode&t302=2018-09-11_01-52-54&uuid=f6344de1-c536-400e-92d2-2828a1a211ce',
		// http://stream.laut.fm/metal-hammer?ref=radiode
		'playlist_api': ''
	},
	'Metal Only Radio': {
		'stream': 'http://server1.blitz-stream.de:4400/stream/1/',
		'playlist_api': ''
	},
	'Pure Metal Radio': {
		'stream': 'http://91.250.102.222:29000/;/;453565267655398stream.nsv',
		'playlist_api': ''
	},
	'Metal Radio': {
		'stream': 'http://stream.radiometal.com:8010/;',
		'playlist_api': ''
	},
	'PirateRock Radio': {
		'stream': 'http://185.86.150.69:8100/webradio',
		'playlist_api': ''
	},
	'Typeischangelo Radio': {
		'stream': 'http://typischangelo.stream.laut.fm/typischangelo?ref=radiode&t302=2018-09-11_02-32-18&uuid=2b22e53d-ad9e-4134-b75a-83a55b1fdc42',
		'playlist_api': ''
	},
	'Christian Music': {
		'stream': 'http://17683.live.streamtheworld.com/WFSHFM_SC',
		'playlist_api': ''
	},
	'Christian Teaching and Talk': {
		'stream': 'http://17553.live.streamtheworld.com/WAVAFM_SC',
		'playlist_api': ''
	},
	'Todays Christian Music': {
		'stream': 'http://14223.live.streamtheworld.com/TCMIR_SC',
		'playlist_api': ''
	},
	'OpenFM 100% Metallica': {
		'stream': 'http://gr-relay-13.gaduradio.pl/62',
		'playlist_api': ''
	},
	'North Pole Radio': {
		'stream': 'http://85.25.217.22:8050/christmas',
		'playlist_api': ''
	},
	'Metal Rock FM': {
		'stream': 'http://192.99.62.212:9408/stream',
		'playlist_api': ''
	},
	/*'Bandit Metal Death Metal': {
		'stream': '',
		'playlist_api': 'https://onlineradiobox.com/json/se/banditmetal/playlist/?cs=se.banditmetal'
	},*/
	
	// http://fluxfm.hoerradar.de/flux-metalfm-mp3-hq?sABC=5o95pppo%230%23276s24q4226sq84p75586q86348rp4q8%23enqvbqr&amsparams=playerid:radiode;skey:1536543947
	// http://fluxfm.hoerradar.de/flux-metalfm-mp3-hq?sABC=5o95pq30%230%231rp8spo2095nss5o3qp5pnn4p7p9oo6n%23enqvbqr&amsparams=playerid:radiode;skey:1536544048
	'Death FM': {
		'stream': 'http://hi5.death.fm/;',
		'playlist_api': ''
		// http://death.fm/soap/FM24sevenJSON.php?action=GetCurrentlyPlaying
	},
	'Death FM Alt': {
		'stream': 'http://hi.death.fm/;',
		'playlist_api': ''
		// http://death.fm/soap/FM24sevenJSON.php?action=GetCurrentlyPlaying
	},
	'Icecast Metal': {
		'stream': 'http://sentinel.scenesat.com:8000/stream2',
		'playlist_api': ''
	},
	'Metal Nation': {
		'stream': 'http://198.100.145.185:8900/;',
		'playlist_api': ''
	},
	'Streamer Radio Metal': {
		'stream': 'https://streamer.radio.co/s6a349b3a2/listen',
		'playlist_api': ''
	},
	'Hard Radio': {
		'stream': 'http://3634.cloudrad.io/stream/1/;',
		'playlist_api': ''
	},
	'Stream the World': {
		'stream': 'https://15363.live.streamtheworld.com/KOMPFM_SC',
		'playlist_api': ''
	},
	'NC Weather': {
		'stream': 'http://wxradio.dyndns.org:8000/WNG538',
		'playlist_api': ''
	},
	'NC Police Dept': {
		'stream': 'http://ca.radioboss.fm:8137/stream%26t%3D%26r%3D4RBS4',
		'playlist_api': ''
	}
};
// 'monstercat': 'https://www.youtube.com/watch?v=ueupsBPNkSc'
