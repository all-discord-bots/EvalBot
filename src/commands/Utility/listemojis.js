exports.run = async (bot, msg, args) => {
	try {
		const emojiList = msg.guild.emojis.map(e => e.toString()).join(" ");
		if (emojiList.length <= 0) return msg.channel.send(`<:redx:411978781226696705> This server does not have any emojis to list.`).catch((err) => console.error);
		const MESSAGE_CHAR_LIMIT = 2000;
		const splitString = (string, prepend = '', append = '') => {
			if (string.length <= MESSAGE_CHAR_LIMIT) {
				return [string];
			}
			const splitIndex = string.lastIndexOf('>', MESSAGE_CHAR_LIMIT - prepend.length - append.length);
			const sliceEnd = splitIndex > 0 ? splitIndex : MESSAGE_CHAR_LIMIT - prepend.length - append.length;
			const rest = splitString(string.slice(sliceEnd), prepend, append);
			return [`${string.slice(0, sliceEnd)}${append}`, `${prepend}${rest[0]}`, ...rest.slice(1)];
		}
		let listemoji = splitString(`${emojiList}`);
		listemoji.forEach((gemojis) => {
			msg.channel.send({embed: ({
				color: 3447003,
				title: `Emoji List`,
				description: `${emojiList}`
			})});
		});
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'listemojis',
	userPermissions: ['MANAGE_EMOJIS'],
	usage: 'listemojis',
	examples: [
		'listemojis'
	],
	description: 'Displays all the emojis for the current server'
};
