exports.run = async (bot, msg, args) => {
	if (args.length <= 0) return msg.channel.send(`<:redx:411978781226696705> Please provide a emoji ID!`);
	const emojis = bot.emojis.get(`${args[0]}`);
	if (!emojis || emojis == null) return msg.channel.send(`<:redx:411978781226696705> \`${args[0]}\` is not a valid emoji id!`).catch(console.error);
	msg.channel.send(`${emojis}`);
};

exports.info = {
	name: 'sendemoji',
	ownerOnly: true,
	clientPermissions: ['USE_EXTERNAL_EMOJIS'],
	usage: 'sendemoji <emoji id>',
	examples: [
		'sendemoji 411978781226696705'
	],
	description: 'Make the bot message an emoji from an emoji ID only if the bot is in the server.'
};
