exports.run = async (bot, msg, args) => {
	try {
		//let parsed = bot.utils.parseArgs(args, ['d']);
		new Promise((resolve,reject) => {
			if (!msg.member.voice.channel) return msg.channel.send('<:redx:411978781226696705> You must be in a voice channel!');
			if (!bot.voice.connections.has(msg.guild.id)) return msg.channel.send('<:redx:411978781226696705> There\'s no audio currently being played.');
			if (!bot.voice.connections.get(msg.guild.id).dispatcher) return msg.channel.send('<:redx:411978781226696705> Failed to set the volume.');
			if ((parseInt(args[0]) < 0 || parseInt(args[0]) > 200) && (!args[1] || (args[1] && args[1] == false))) return msg.channel.send('<:redx:411978781226696705> Volume must be between `0-200`!');
			if (args.length <= 0) return msg.channel.send(`Current volume is \`${parseFloat(bot.voice.connections.get(msg.guild.id).dispatcher.volume) * 100}%\`.`);
			resolve(bot.voice.connections.get(msg.guild.id));
		}).then((connection) => {
			if (!args[1] || (args[1] && args[1] == false)) {
				return bot.voice.connections.get(msg.guild.id).dispatcher.setVolume(parseFloat(args[0]) / 100);
			} else if (args[1] && args[1] == true) {
				return bot.voice.connections.get(msg.guild.id).dispatcher.setVolume(parseFloat(args[0]));
			}
			//connection.player.dispatcher.once('volumeChange', (oldVolume,newVolume) => {
			connection.dispatcher.once('volumeChange', (oldVolume,newVolume) => {
				msg.channel.send(`<:check:411976443522711552> Volume set to \`${newVolume * 100}%\`.`);
			});
		}).catch((err) => {
			console.error(err.toString());
		});
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'volume',
	allowDM: false,
	userPermissions: ['CONNECT'],
	clientPermissions: ['CONNECT'],
	aliases: ['vol'],
	usage: 'volume [number]',
	examples: [
		'volume',
		'volume 100',
		'volume 200'
	],
	description: 'Adjusts the playback volume.'
};
