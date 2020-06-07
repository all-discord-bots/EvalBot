exports.methods = {
	encode: input => {
		return input.toString().split('').map((c) => c.charCodeAt(0).toString(2));
	},
	decode: input => {
		let _input = typeof input === 'string' ? input.split(' ') : input;
		return _input.map(c => parseInt(c, 2)).map((c) => String.fromCharCode(c)).join('');
	}
};

exports.run = async (bot, msg, args) => {
	if (args.length < 2) return msg.channel.send(`<:redx:411978781226696705> Do \`${bot.config.prefix}help binary\` to see how to use this.`);
	let input = args.slice(1).join(' ');
	if (args[0].match(/^enc(ode(Text)?)?$/i)) {
		(await msg.channel.send("Loading binary...").then((msg) => {
			msg.edit(this.methods.encode(input).join(' '));
		}));
	} else if (args[0].match(/^dec(ode(Text)?)?$/i)) {
		(await msg.channel.send("Loading binary...").then((msg) => {
			msg.edit(this.methods.decode(input));
		}));
	} else if (args[0].match(/^decToBin$/i)) {
		if (isNaN(input)) return msg.channel.send(`<:redx:411978781226696705> Input must be a number!`);
		(await msg.channel.send("Loading binary...").then((msg) => {
			msg.edit(parseInt(input).toString(2));
		}));
	} else if (args[0].match(/^binToDec$/i)) {
		if (isNaN(input)) return msg.channel.send(`<:redx:411978781226696705> Input must be a number!`);
		(await msg.channel.send("Loading binary...").then((msg) => {
			msg.edit(parseInt(input, 2));
		}));
	} else {
		return msg.channel.send(`<:redx:411978781226696705> Unknown sub command: \`${args[0]}\``);
	}
};

exports.info = {
	name: 'binary',
	hidden: true,
	usage: 'binary <encodeText|decodeText|decToBin|binToDec> <input>',
	examples: [
		'binary encodeText This text will be binary'
	],
	description: 'Convert your input to/from binary'
};
