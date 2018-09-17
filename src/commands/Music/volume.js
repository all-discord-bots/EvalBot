exports.run = async (bot, msg, args) => {
	try {
		//let parsed = bot.utils.parseArgs(args, ['d']);
		if (!msg.member.voice.channel) return msg.channel.send(`<:redx:411978781226696705> You must be in a voice channel!`).catch((err) => console.error);
		if (msg.guild.voiceConnection === null) return msg.channel.send(`<:redx:411978781226696705> No audio is being played.`).catch((err) => console.error);
		if (msg.guild.voiceConnection.player.dispatcher === null || msg.guild.voiceConnection.player.dispatcher === undefined) return msg.channel.send(`<:redx:411978781226696705> Failed to set the volume.`);
		if (!args[1] || (args[1] && args[1] == false)) {
			if (parseInt(args[0]) < 0 || parseInt(args[0]) > 200) return msg.channel.send(`<:redx:411978781226696705> Volume must be \`0-200\`!`).catch(err => console.error);
		}
		if (args.length <= 0/* || isNaN(args[0])*/) return msg.channel.send(`Current volume is \`${parseInt(msg.guild.voiceConnection.player.dispatcher.volume) * 100}%\`.`).catch((err) => console.error);
		if (!args[1] || (args[1] && args[1] == false)) {
			msg.guild.voiceConnection.player.dispatcher.setVolume(parseInt(args[0]) / 100);
		} else if (args[1] && args[1] == true) {
			msg.guild.voiceConnection.player.dispatcher.setVolume(parseInt(args[0]));
		}
		
		msg.guild.voiceConnection.player.dispatcher.once('volumeChange', (oldVolume,newVolume) => {
			msg.channel.send(`<:check:411976443522711552> Volume set to \`${newVolume}%\``); //\`${parseInt(args[0])}%\`.`);
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
