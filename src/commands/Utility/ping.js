exports.run = async (bot, msg, args) => {
	try {
		let start = new Date().getTime();
		(await msg.channel.send({ embed: ({ title: `<a:loading:414954381176340480> Pinging...` })}).then((msg) => {
			let end = new Date().getTime();
			let bpings;
			if (bot.pings.length < 1) {
				bpings = "N/A";
			} else {
				bpings = bot.pings[0];
			}
			let bitrate;
			if (msg.guild.members.get(bot.user.id).hasPermission(0x00100000)) {
				if (msg.guild.voiceConnection) {
					bitrate = `Bitrate: \`${msg.guild.voiceConnection.player.opusEncoder.bitrate}ms\``;
				} else {
					bitrate = '';
				}
			} else {
				bitrate = '';
			}
			msg.edit("Collecting message edit latency...").then((msg) => {
				let edited = msg.editedTimestamp || 0;
				msg.edit({ embed: ({
					color: 631398,
					title: 'Ping Data',
					description: `
Roundtrip: \`${Math.round((end - msg.createdTimestamp) / 2)}ms\`
Discord Latency: \`${end - start}ms\`
API Latency: \`${Math.round(bot.ping)}ms\`
Heartbeat: \`${Math.floor(bpings)}ms\`
Message Edit: \`${edited - start}ms\`
${bitrate}
`
				})});
			});
		}));
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'ping',
	aliases: ['pong'],
	hidden: true,
	usage: 'ping',
	examples: [
		'ping'
	],
	description: 'Get the Latency of the bot.'
};
