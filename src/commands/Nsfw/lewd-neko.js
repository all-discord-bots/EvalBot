const fetch = require('node-fetch');

exports.run = async (bot, msg, args) => {
	try {
		let request_info = {
			ok: false,
			status: 0,
			statusText: ''
		}
		new Promise((resolve, reject) => {
			fetch(`https://nekos.life/api/v2/img/lewd`,{ method: 'GET', headers: { 'Content-Type': 'application/json' }}).then((res) => {
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
					embed: {
						timestamp: new Date(),
						image: {
							url: json.url
						},
						footer: {
							text: `[${request_info.status}]`
						}
					}
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
	name: 'lewd-neko',
	clientPermissions: ['ATTACH_FILES'],
	aliases: ['lewdneko','lewdnekos'],
	nsfw: true,
	usage: 'lewd-neko',
	examples: [
		'lewd-neko'
	],
	description: 'Sends a NSFW image of lewd nekos.'
};
