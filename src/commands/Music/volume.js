exports.run = async (bot, msg, args) => {
	const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
	if (voiceConnection === null) return msg.channel.send(`<:redx:411978781226696705> No music is being played.`).catch(console.error);
	const dispatcher = voiceConnection.player.dispatcher;
	if (args[0] < 0 || args[0] > 200) return msg.channel.send(`<:redx:411978781226696705> Volume must be \`0-100\`!`).catch(console.error);
	let nvol;
	if (args.length < 1 || isNaN(args[0])) {
		nvol = parseInt('0');
	} else {
		nvol = parseInt(args[0]);
	}
	dispatcher.setVolume((nvol / 100));
	msg.channel.send(`<:check:411976443522711552> Volume set to ${nvol}`);
};

exports.info = {
	name: 'volume',
	aliases: ['vol'],
	usage: 'volume <number>',
	description: 'Adjusts the volume of the bot.'
};
