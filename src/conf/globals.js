const music_items = global.music_items = {};
const songqueue = global.songqueue = {};
const built_in_radio = global.built_in_radio = {
	/**
	* @todo Make Categories for each station like `Metal, Rock` .etc.
	*/
	'AlexFM': {
		'stream': 'http://alexfm.stream.laut.fm/alexfm',
		'playlist_api': '',
		'tags': ['Moscow','Russia','Alternative','Heavy Metal','Rock']
	},
	'Fun Radio': {
		'stream': 'http://streaming.radio.funradio.fr/fun-1-44-128',
		'playlist_api': '',
		'tags': []
	},
	'1.FM Absolute Top 40': {
		'stream': 'http://strm112.1.fm/top40_mobile_mp3',
		'playlist_api': 'https://onlineradiobox.com/json/ch/1fmabsolutetop40radio/playlist/',
		'tags': ['Hits','Top']
	},
	'977 Hits': {
		'stream': 'http://19353.live.streamtheworld.com/977_HITS_SC',
		'playlist_api': '',
		'tags': ['Hits']
	},
	'Absolute Radio': {
		'stream': 'http://icy-e-bab-09-boh.sharp-stream.com/absoluteradio.mp3',
		'playlist_api': '',
		'tags': []
	},
	'Heart': {
		'stream': 'http://media-ice.musicradio.com/HeartSouthWalesMP3',
		'playlist_api': 'https://onlineradiobox.com/json/uk/heart970/playlist/',
		'tags': ['Hits']
	},
	'Heavy Metal Radio': {
		'stream': 'http://www.heavymetalradio.com:8000/;',
		'playlist_api': 'https://onlineradiobox.com/json/us/heavymetal/playlist/',
		'tags': ['Heavy Metal']
	},
	'Metal Hammer Radio': {
		'stream': 'http://stream.laut.fm/metal-hammer',
		'playlist_api': 'https://onlineradiobox.com/json/de/metalhammer/playlist/',
		'tags': ['Berlin','Germany','Heavy Metal']
	},
	'Metal Only Radio': {
		'stream': 'http://server1.blitz-stream.de:4400/stream/1/',
		'playlist_api': 'https://onlineradiobox.com/json/de/metalonly/playlist/',
		'tags': ['Deizisau','Germany','Heavy Metal','Medieval','Pop','Traditional']
	},
	'Pure Metal Radio': {
		'stream': 'http://91.250.102.222:29000/;',
		'playlist_api': 'https://onlineradiobox.com/json/de/puremetal/playlist/',
		'tags': ['Beckum','Germany','Alternative','Rock','Heavy Metal']
	},
	'Metal Radio': {
		'stream': 'http://stream.radiometal.com:8010/;',
		'playlist_api': '',
		'tags': ['Heavy Metal']
	},
	'PirateRock 95.4 FM Radio': {
		'stream': 'http://185.86.150.69:8100/webradio',
		'playlist_api': 'https://onlineradiobox.com/json/se/piraterock/playlist/',
		'tags': ['Sweden','Hard Rock','Punk','Rock','Heavy Metal']
	},
	'Typeischangelo Radio': {
		'stream': 'http://typischangelo.stream.laut.fm/typischangelo',
		'playlist_api': '',
		'tags': ['Germany','Heavy Metal','Electro','Rock']
	},
	'Christian Music': {
		'stream': 'http://17683.live.streamtheworld.com/WFSHFM_SC',
		'playlist_api': '',
		'tags': ['Christian','Religion']
	},
	'Christian Teaching and Talk': {
		'stream': 'http://17553.live.streamtheworld.com/WAVAFM_SC',
		'playlist_api': '',
		'tags': ['Christian','Religion']
	},
	'Todays Christian Music': {
		'stream': 'http://14223.live.streamtheworld.com/TCMIR_SC',
		'playlist_api': '',
		'tags': ['Christian','Religion']
	},
	'OpenFM 100% Metallica': {
		'stream': 'http://gr-relay-13.gaduradio.pl/62',
		'playlist_api': '',
		'tags': ['Heavy Metal','Metallica']
	},
	'North Pole Radio': {
		'stream': 'http://85.25.217.22:8050/christmas',
		'playlist_api': 'https://onlineradiobox.com/json/us/northpoleradio/playlist/',
		'tags': ['Holiday','Christmas'']
	},
	'MetalRock FM': {
		'stream': 'http://192.99.62.212:9408/stream',
		'playlist_api': 'https://onlineradiobox.com/json/us/metalrockfm/playlist/',
		'tags': ['Baltimore MD','USA','Hard Rock','Classic Rock','Heavy Metal']
	},
	'Death FM': {
		'stream': 'http://hi5.death.fm/;',
		'playlist_api': '', // http://death.fm/soap/FM24sevenJSON.php?action=GetCurrentlyPlaying
		'tags': ['Richmond VA','USA','Heavy Metal','Urban']
	},
	'Death FM Alt': {
		'stream': 'http://hi.death.fm/;',
		'playlist_api': '', // http://death.fm/soap/FM24sevenJSON.php?action=GetCurrentlyPlaying
		'tags': ['Richmond VA','USA','Heavy Metal','Urban']
	},
	'Icecast Metal': {
		'stream': 'http://sentinel.scenesat.com:8000/stream2',
		'playlist_api': '',
		'tags': ['Heavy Metal']
	},
	'Metal Nation': {
		'stream': 'http://198.100.145.185:8900/;',
		'playlist_api': 'https://onlineradiobox.com/json/ru/metalnation/playlist/',
		'tags': ['Windsor','Canada','Heavy Metal']
	},
	'Metal Up Your Ass': {
		'stream': 'http://metal-up-your-ass.stream.laut.fm/metal-up-your-ass',
		'playlist_api': 'https://onlineradiobox.com/json/de/metalupyourass/playlist/',
		'tags': ['Germany','Heavy Metal']
	},
	'Metal Generation': {
		'stream': 'http://metalgeneration.stream.laut.fm/metalgeneration',
		'playlist_api': 'https://onlineradiobox.com/json/de/metalgeneration/playlist/',
		'tags': ['Friedberg','Germany','Heavy Metal']
	},
	'Streamer Radio Metal': {
		'stream': 'https://streamer.radio.co/s6a349b3a2/listen',
		'playlist_api': '',
		'tags': ['Heavy Metal']
	},
	'Hard Radio': {
		'stream': 'http://3634.cloudrad.io/stream/1/;',
		'playlist_api': '',
		'tags': ['Rock','Heavy Metal']
	},
	'Stream the World': {
		'stream': 'https://15363.live.streamtheworld.com/KOMPFM_SC',
		'playlist_api': '',
		'tags': []
	},
	'NC Weather': {
		'stream': 'http://wxradio.dyndns.org:8000/WNG538',
		'playlist_api': '',
		'tags': []
	},
	'NC Police Dept': {
		'stream': 'http://ca.radioboss.fm:8137/stream', // 'http://ca.radioboss.fm:8137/stream&t=&r=4RBS4',
		'playlist_api': '',
		'tags': []
	}
};

/*
const built_in_radio = global.built_in_radio = {
	'Holiday': {
		'North Pole Radio': {
			'stream': 'http://85.25.217.22:8050/christmas',
			'playlist_api': 'https://onlineradiobox.com/json/us/northpoleradio/playlist/'
		}
	},
	'Metal': {
		'AlexFM': {
			'stream': 'http://alexfm.stream.laut.fm/alexfm?',
			'playlist_api': ''
		},
		'Heavy Metal Radio': {
			'stream': 'http://www.heavymetalradio.com:8000/;',
			'playlist_api': 'https://onlineradiobox.com/json/us/heavymetal/playlist/'
		},
		'Metal Hammer Radio': {
			'stream': 'http://stream.laut.fm/metal-hammer',
			'playlist_api': 'https://onlineradiobox.com/json/de/metalhammer/playlist/'
		},
		'Metal Only Radio': {
			'stream': 'http://server1.blitz-stream.de:4400/stream/1/',
			'playlist_api': 'https://onlineradiobox.com/json/de/metalonly/playlist/'
		},
		'Pure Metal Radio': {
			'stream': 'http://91.250.102.222:29000/;/;453565267655398stream.nsv',
			'playlist_api': 'https://onlineradiobox.com/json/de/puremetal/playlist/'
		},
		'Metal Radio': {
			'stream': 'http://stream.radiometal.com:8010/;',
			'playlist_api': ''
		},
		'Typeischangelo Radio': {
			'stream': 'http://typischangelo.stream.laut.fm/typischangelo',
			'playlist_api': ''
		},
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
		'OpenFM 100% Metallica': {
			'stream': 'http://gr-relay-13.gaduradio.pl/62',
			'playlist_api': ''
		},
		'MetalRock FM': {
			'stream': 'http://192.99.62.212:9408/stream',
			'playlist_api': 'https://onlineradiobox.com/json/us/metalrockfm/playlist/'
		},
		'Icecast Metal': {
			'stream': 'http://sentinel.scenesat.com:8000/stream2',
			'playlist_api': ''
		},
		'Metal Nation': {
			'stream': 'http://198.100.145.185:8900/;',
			'playlist_api': 'https://onlineradiobox.com/json/ru/metalnation/playlist/'
		},
		'Metal Up Your Ass': {
			'stream': 'http://metal-up-your-ass.stream.laut.fm/metal-up-your-ass',
			'playlist_api': 'https://onlineradiobox.com/json/de/metalupyourass/playlist/'
		},
		'Metal Generation': {
			'stream': 'http://metalgeneration.stream.laut.fm/metalgeneration',
			'playlist_api': 'https://onlineradiobox.com/json/de/metalgeneration/playlist/'
		},
		'Streamer Radio Metal': {
			'stream': 'https://streamer.radio.co/s6a349b3a2/listen',
			'playlist_api': ''
		}
	},
	'News': {
		'NC Weather': {
			'stream': 'http://wxradio.dyndns.org:8000/WNG538',
			'playlist_api': ''
		},
		'NC Police Dept': {
			'stream': 'http://ca.radioboss.fm:8137/stream%26t%3D%26r%3D4RBS4',
			'playlist_api': ''
		}
	},
	'Others': {
		'Fun Radio': {
			'stream': 'http://streaming.radio.funradio.fr/fun-1-44-128',
			'playlist_api': ''
		},
		'1.FM Absolute Top 40': {
			'stream': 'http://strm112.1.fm/top40_mobile_mp3',
			'playlist_api': 'https://onlineradiobox.com/json/ch/1fmabsolutetop40radio/playlist/'
		},
		'Absolute Radio': {
			'stream': 'http://icy-e-bab-09-boh.sharp-stream.com/absoluteradio.mp3',
			'playlist_api': ''
		},
		'Heart': {
			'stream': 'http://media-ice.musicradio.com/HeartSouthWalesMP3',
			'playlist_api': 'https://onlineradiobox.com/json/uk/heart970/playlist/?cs=uk.heart970'
		},
		'977 Hits': {
			'stream': 'http://19353.live.streamtheworld.com/977_HITS_SC',
			'playlist_api': ''
		},
		'Stream the World': {
			'stream': 'https://15363.live.streamtheworld.com/KOMPFM_SC',
			'playlist_api': ''
		}
	},
	'Religion': {
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
		}
	},
	'Rock': {
		'PirateRock Radio': {
			'stream': 'http://185.86.150.69:8100/webradio',
			'playlist_api': 'https://onlineradiobox.com/json/se/piraterock/playlist/'
		},
		'Hard Radio': {
			'stream': 'http://3634.cloudrad.io/stream/1/;',
			'playlist_api': ''
		}
	},
	/*'Bandit Metal Death Metal': {
		'stream': '',
		'playlist_api': 'https://onlineradiobox.com/json/se/banditmetal/playlist/?cs=se.banditmetal'
	},*/
	
	// http://fluxfm.hoerradar.de/flux-metalfm-mp3-hq?sABC=5o95pppo%230%23276s24q4226sq84p75586q86348rp4q8%23enqvbqr&amsparams=playerid:radiode;skey:1536543947
	// http://fluxfm.hoerradar.de/flux-metalfm-mp3-hq?sABC=5o95pq30%230%231rp8spo2095nss5o3qp5pnn4p7p9oo6n%23enqvbqr&amsparams=playerid:radiode;skey:1536544048
};
// 'monstercat': 'https://www.youtube.com/watch?v=ueupsBPNkSc'
*/
