const got = require('got');

exports.run = async (bot, msg) => {
	const { body } = await got('http://belikebill.azurewebsites.net/billgen-API.php?default=1', { encoding: null });
	await msg.channel.send({
		embed: ({
			image: {
				url: body
			}
		})
	});
};

exports.info = {
	name: 'bill',
	userPermissions: ['ATTACH_FILES'],
	clientPermissions: ['ATTACH_FILES'],
	usage: 'bill',
	examples: [
		'bill'
	],
	description: 'Be like Bill!'
};
