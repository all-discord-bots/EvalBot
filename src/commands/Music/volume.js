exports.run = async (bot, msg, args) => {
	try {
		//let parsed = bot.utils.parseArgs(args, ['d']);
		new Promise((resolve,reject) => {
			if (!msg.member.voice.channel) {
				msg.channel.send(`<:redx:411978781226696705> You must be in a voice channel!`);
				reject();
			}
			if (!msg.guild.voiceConnection) {
				msg.channel.send(`<:redx:411978781226696705> There's no audio currently being played.`);
				reject();
			}
			if (!msg.guild.voiceConnection.player.dispatcher) {
				msg.channel.send(`<:redx:411978781226696705> Failed to set the volume.`);
				reject();
			}
			if (!args[1] || (args[1] && args[1] == false)) {
				if (parseInt(args[0]) < 0 || parseInt(args[0]) > 200) {
					msg.channel.send(`<:redx:411978781226696705> Volume must be between \`0-200\`!`);
					reject();
				}
			}
			if (args.length <= 0) {
				msg.channel.send(`Current volume is \`${parseInt(msg.guild.voiceConnection.player.dispatcher.volume) * 100}%\`.`);
				reject();
			}
			resolve(msg.guild.voiceConnection);
		}).then((connection) => {
			if (!args[1] || (args[1] && args[1] == false)) {
				msg.guild.voiceConnection.player.dispatcher.setVolume(parseInt(args[0]) / 100);
			} else if (args[1] && args[1] == true) {
				msg.guild.voiceConnection.player.dispatcher.setVolume(parseInt(args[0]));
			}
			connection.player.dispatcher.once('volumeChange', (oldVolume,newVolume) => {
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
