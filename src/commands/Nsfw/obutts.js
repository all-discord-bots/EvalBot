const fetch = require('node-fetch');

exports.run = async (bot, msg, args) => {
	try {
		//if (args.length < 1) return msg.channel.send(`<:redx:411978781226696705> Please provide a search string!`).catch(console.error);
		//let get_random = Math.floor(Math.random() * 12124); // 12124 is the max number for the API
		let request_info = {
			ok: false,
			status: 0,
			statusText: ''
		}
		// return new Promise((resolve, reject) => {
		new Promise((resolve, reject) => {
			fetch('http://api.obutts.ru/butts/0/1/random',{ method: 'GET', headers: { 'Content-Type': 'application/json' }}).then((res) => {
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
							url: `http://media.obutts.ru/${json[0].preview}`
						},
						footer: {
							// ID: #${json[0].id}
							text: `[${request_info.status}] | Rank: ${json[0].rank}`
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
	name: 'butt',
	clientPermissions: ['ATTACH_FILES'],
	nsfw: true,
	aliases: ['obutt','booty','ass','b00ty','butts'],
	usage: 'butt',
	examples: [
		'butt'
	],
	description: 'Sends a NSFW image of a butt.'
};
