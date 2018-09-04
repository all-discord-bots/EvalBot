const Pornsearch = require('pornsearch');

exports.run = async (bot, msg, args) => {
	try {
		if (args.length <= 0) return msg.channel.send(`<:redx:411978781226696705> Please provide a search string!`).catch(console.error);
		const Searcher = new Pornsearch(args.join(' '));
		let randomnum = Math.floor(Math.random() * 2);
		if (randomnum <= 0) {
			Searcher.videos().then((result) => {
				//const attachment = new MessageAttachment(`${result[0].url}`);
				return msg.channel.send(`Title: __**${result[0].title || 'N/A'}**__\r\nDuration: **${result[0].duration || 'N/A'}**\r\n${result[0].url}`);
			}).catch((err) => {
				return msg.channel.send(`<:redx:411978781226696705> ${err.toString()}`);
			});
		} else {
			Searcher.gifs().then((result) => {
				let gen_random = Math.floor(Math.random() * 2);
				if (gen_random <= 0) {
					return msg.channel.send({
						embed: ({
							timestamp: new Date(),
							footer: {
								text: `${result[0].title || 'N/A'}`
							},
							image: {
								url: `${result[0].url}`
							}
						})
					});
				} else {
					return msg.channel.send(`Title: __**${result[0].title || 'N/A'}**__\r\n${result[0].webm}`);
				}
			}).catch((err) => {
				return msg.channel.send(`<:redx:411978781226696705> ${err.toString()}`);
			});
		}
	} catch (err) {
		console.error(err.toString());
	};
};
	
exports.info = {
	name: 'nsfwsearch',
	clientPermissions: ['ATTACH_FILES'],
	nsfw: true,
	aliases: ['pornsearch','p0rnsearch','cornsearch','pronsearch','c0rnsearch','pr0nsearch'],
	usage: 'nsfwsearch <search>',
	examples: [
		'nsfwsearch pussy'
	],
	description: 'Sends a NSFW video/gif.'
};
