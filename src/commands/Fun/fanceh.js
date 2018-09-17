const mapping = {
	' ': '   ',
	'0': ':zero:',
	'1': ':one:',
	'2': ':two:',
	'3': ':three:',
	'4': ':four:',
	'5': ':five:',
	'6': ':six:',
	'7': ':seven:',
	'8': ':eight:',
	'9': ':nine:',
	'!': ':grey_exclamation:',
	'?': ':grey_question:',
	'#': ':hash:',
	'*': ':asterisk:'
};

'abcdefghijklmnopqrstuvwxyz'.split('').forEach((c) => {
	mapping[c] = mapping[c.toUpperCase()] = ` :regional_indicator_${c}:`;
});

exports.run = async (bot, msg, args) => {
	try {
		if (args.length <= 0) return msg.channel.send(`<:redx:411978781226696705> You must provide some text to fanceh-fy!`);
		(await msg.channel.send("Loading message...").then((msg) => {
			msg.edit(args.join(' ').split('').map((c) => mapping[c] || c).join(''));
		}));
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'fanceh',
	usage: 'fanceh <text>',
	examples: [
		'fanceh this is a message'
	],
	description: 'Renders text in big emoji letters'
};
