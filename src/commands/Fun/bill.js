const got = require('got');

exports.run = async (bot, msg, args) => {
// http://belikebill.azurewebsites.net/billgen-API.php?default=2
	let random = Math.random() * 2;
	let sex;
	if (random <= 0) {
		sex = 'f';
	} else {
		sex = 'm';
	}
	const { body } = await got(`http://belikebill.azurewebsites.net/billgen-API.php?default=1&sex=${sex}`, { encoding: null });
	// const { body } = await got(`http://belikebill.azurewebsites.net/billgen-API.php?text=tgsdfsdfdsfs`, { encoding: null });
	await msg.channel.send({
		file: {
			attachment: body,
			name: 'bill.jpg'
		}
	});
};

exports.info = {
	name: 'bill',
	ownerOnly: true, // until I can fix this
	hidden: true,
	userPermissions: ['ATTACH_FILES'],
	clientPermissions: ['ATTACH_FILES'],
	usage: 'bill',
	examples: [
		'bill'
	],
	description: 'Be like Bill!'
};
