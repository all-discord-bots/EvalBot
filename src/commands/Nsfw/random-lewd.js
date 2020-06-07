const fetch = require('node-fetch');

exports.run = async (bot, msg, args) => {
	try {
		const nsfw_topics = [
			'api/lewd/neko',
			'api/v2/img/femdom',
			'api/v2/img/classic',
			'api/v2/img/feet',
			'api/v2/img/feetg',
			'api/v2/img/lewd',
			'api/v2/img/nsfw_neko_gif',
			'api/v2/img/kuni',
			'api/v2/img/tits',
			'api/v2/img/boobs',
			'api/v2/img/pussy_jpg',
			'api/v2/img/pussy',
			'api/v2/img/cum_jpg',
			'api/v2/img/cum',
			'api/v2/img/spank',
			'api/v2/img/smallboobs',
			'api/v2/img/hentai',
			'api/v2/img/Random_hentai_gif',
			'api/v2/img/nsfw_avatar',
			'api/v2/img/solo',
			'api/v2/img/solog',
			'api/v2/img/blowjob',
			'api/v2/img/bj',
			'api/v2/img/yuri',
			'api/v2/img/les',
			'api/v2/img/trap',
			'api/v2/img/anal',
			'api/v2/img/gasm',
			'api/v2/img/futanari',
			'api/v2/img/pwankg',
			'api/v2/img/ero',
			'api/v2/img/erok',
			'api/v2/img/erokemo',
			'api/v2/img/eroyuri',
			'api/v2/img/eron',
			'api/v2/img/erofeet',
			'api/v2/img/hololewd',
			'api/v2/img/lewdk',
			'api/v2/img/lewdkemo',
			'api/v2/img/holoero',
			'api/v2/img/keta'
		];
		const get_category = nsfw_topics[Math.floor(Math.random() * nsfw_topics.length)];
		let request_info = {
			ok: false,
			status: 0,
			statusText: ''
		}
		new Promise((resolve, reject) => {
			fetch(`https://nekos.life/${get_category}`,{ method: 'GET', headers: { 'Content-Type': 'application/json' }}).then((res) => {
				request_info.ok = res.ok;
				request_info.status = res.status;
				request_info.statusText = res.statusText;
				if (res.ok) {
					resolve(res.json());
				} else {
					reject();
				}
			}).catch((err) => {
				console.error(err.toString());
				return msg.channel.send(`<:redx:411978781226696705> ${err.toString()}`);
			});
		}).then((json) => {
			/*
			author: [string] or [null]
			id: [number]
			model: [string]
			preview: [string]
			rank: [number]
			*/
			if (request_info.ok) {
				msg.channel.send({
					embed:({
						timestamp: new Date(),
						image: {
							url: json.url
						},
						footer: {
							text: `[${request_info.status}] | category ${get_category.replace('api/v2/img/', '').replace('api/','')}`
						}
					})
				});
			} else {
				return msg.channel.send(`<:redx:411978781226696705> ${request_info.statusText}`);
			}
		}).catch((err) => {
			return console.error(`${err.stack ? err.stack : err.toString()}`);
		});
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'random-lewd',
	clientPermissions: ['ATTACH_FILES'],
	aliases: ['randomlewd'],
	nsfw: true,
	usage: 'random-lewd',
	examples: [
		'random-lewd'
	],
	description: 'Sends a random lewd NSFW image.'
};
