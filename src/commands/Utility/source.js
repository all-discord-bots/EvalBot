exports.run = (bot, msg, args) => {
	try {
		msg.channel.fetchMessage(`${args[0]}`).then((message) => {
			msg.channel.send(`Source Code for message id \`${args[0]}\`: \`\`\`md\n${clean(message.content)}\n\`\`\``).then(() => {
				msg.delete();
			});
		}).catch((err) => {
			console.error(err.toString());
		});
	} catch (err) {
		console.error(err.toString());
	}
};

const clean = (text) => {
	try {
		if (typeof(text) === 'string') {
			return text.replace(/[`]/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
		} else {
			return text;
		}
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'source',
	ownerOnly: true,
	hidden: true,
	usage: 'source <message id>',
	examples: [
		'source 937204837294750'
	],
	description: 'Gets the markdown source of the specified message id in the same channel.'
};
