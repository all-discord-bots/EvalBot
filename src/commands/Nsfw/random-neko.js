const fetch = require('node-fetch');

exports.run = async (bot, msg, args) => {
	try {
		const endpoints = [
			'api/hug',
			'api/kiss',
			'api/neko',
			'api/pat',
			'api/v2/img/tickle',
			'api/v2/img/ngif',
			'api/v2/img/poke',
			'api/v2/img/kiss',
			'api/v2/img/slap',
			'api/v2/img/cuddle',
			'api/v2/img/avatar',
			'api/v2/img/fox_girl',
			'api/v2/img/hug',
			'api/v2/img/gecg',
			'api/v2/img/pat',
			'api/v2/img/smug',
			'api/v2/img/kemonomimi',
			'api/v2/img/wallpaper',
			'api/v2/img/baka',
			'api/v2/img/feed',
			'api/v2/img/neko'
		];
		const get_category = endpoints[Math.floor(Math.random() * endpoints.length)];
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
	name: 'random-neko',
	clientPermissions: ['ATTACH_FILES'],
	aliases: ['randomneko'],
	nsfw: false,
	usage: 'random-neko',
	examples: [
		'random-neko'
	],
	description: 'Sends a random neko image.'
};
