const randomizeCase = (word) => {
	word.split('').map((c) => Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()).join('');
}

exports.run = async (bot, msg, args) => {
	if (args.length <= 0) return msg.channel.send('<:redx:411978781226696705> You must provide some text to clapify.');
	(await msg.channel.send("Loading message...").then((msg) => {
		msg.edit(args.map(randomizeCase).join(':clap:'));
	}));
};

exports.info = {
	name: 'clap',
	usage: 'clap <text>',
	examples: [
		'clap this is a message to clapify'
	],
	description: 'Clapifies your text'
};
