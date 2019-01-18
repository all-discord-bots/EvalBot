// https://nekos.life/api/v2/8ball
const responses = [
	'Unclear, ask again later',
	'Soon',
	'Yes',
	'Absolutely!',
	'Never',
	'Magic 8-ball is currently unavailable, please leave a message after the tone. \\*beep\\*',
	'When you are ready',
	'Hopefully',
	'Hopefully not',
	'Oh my, why would you even ask that?',
	'What kind of a question is that?',
	'Over my dead body!',
	'Haha, funny joke'
];

function randomItem(array) {
	return array[Math.floor(Math.random() * array.length)];
}

exports.run = async (bot, msg, args) => {
	if (args.length <= 0) return msg.channel.send('<:redx:411978781226696705> You must specify something to ask of the magic 8-ball!');
	let response = randomItem(responses);
	if (args.join(' ').indexOf('ipodtouch0218') > -1 || args.join(' ').indexOf('233360087979130882') > -1) {
		response = 'HAH';
	}
	(await msg.channel.send("Loading response...").then((msg) => {
		msg.edit(`${args.join(' ')} :8ball: | **${response}**`);
	}));
};

exports.info = {
	name: '8ball',
	aliases: ['eightball'],
	usage: '8ball <question>',
	examples: [
		'8ball blah blah blah blah'
	],
	description: 'Asks the magic 8-ball a question'
};
