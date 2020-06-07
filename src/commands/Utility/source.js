exports.run = (bot, msg, args) => {
	try {
		if (args.length <= 0) return msg.channel.send(`<:redx:411978781226696705> you must provide a message id.`);
		msg.channel.messages.fetch(`${args[0]}`).then((message) => {
			if (!message) return msg.channel.send(`<:redx:411978781226696705> could not find message with the id \`${args[0]}\` in the channel <#${msg.channel.id}>.`);
			msg.channel.send(`Source Code for message id \`${args[0]}\`: \`\`\`md\n${clean(message.content)}\n\`\`\``);//.then(() => {
				//msg.delete();
			//});
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
	description: 'Gets the markdown source of the specified message id in the same channel.'
};
