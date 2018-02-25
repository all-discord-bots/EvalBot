exports.run = async (bot, msg, args) => {
	if (!args[0]) return msg.channel.send(`<:redx:411978781226696705> You must specify the volume!`).catch(console.error);
	if (args[0] < 0) return msg.channel.send(`<:redx:411978781226696705> Volume can only be between \`0-200\`!`).catch(console.error);
	if (args[0] > 200) return msg.channel.send(`<:redx:411978781226696705> Volume can only be between \`0-200\`!`).catch(console.error);
};

exports.info = {
	name: 'volume',
	usage: 'volume <number>',
	description: 'Resume music playback.'
};
