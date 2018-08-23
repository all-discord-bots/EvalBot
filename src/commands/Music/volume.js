exports.run = async (bot, msg, args) => {
	try {
		if (!msg.member.voiceChannel) return msg.channel.send(`<:redx:411978781226696705> You must be in a voice channel!`).catch(err => console.error);
		const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send(`<:redx:411978781226696705> No music is being played.`).catch(err => console.error);
		const dispatcher = voiceConnection.player.dispatcher;
		if (parseInt(args[0]) < 0 || parseInt(args[0]) > 200) return msg.channel.send(`<:redx:411978781226696705> Volume must be \`0-200\`!`).catch(err => console.error);
		//>eval const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id); voiceConnection.player.dispatcher.volume
		if (args.length < 1 || isNaN(args[0])) return msg.channel.send(`Current volume is \`${parseInt(dispatcher.volume) * 100}%\`.`).catch(err => console.error);
		// if (args.length < 1 || isNaN(args[0])) {
		//	nvol = parseInt('0');
		//} else {
			let nvol = parseInt(args[0]);
		//}
		dispatcher.setVolume((nvol / 100));
		msg.channel.send(`<:check:411976443522711552> Volume set to \`${nvol}%\`.`);
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'volume',
	userPermissions: ['CONNECT'],
	clientPermissions: ['CONNECT'],
	aliases: ['vol'],
	usage: 'volume <number>',
	examples: [
		'volume 100',
		'volume 200'
	],
	description: 'Adjusts the playback volume.'
};
