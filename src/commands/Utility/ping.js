exports.run = async (bot, msg) => {
	let start = new Date().getTime();
	(await msg.channel.send({ embed: ({ author: { name: 'Pinging...', icon_url: 'http://4.bp.blogspot.com/-JF6M1HaI9rQ/VD_eCkLpG7I/AAAAAAAAAXk/0f1ym7hBXYs/s1600/Loading-Circle.gif', }})}).then((msg) => {
		let end = new Date().getTime();
		let bpings;
		if (bot.pings.length < 1) {
			bpings = "N/A";
		} else {
			bpings = bot.pings[0];
		}
		msg.edit("Collecting message edit latency...").then((msg) => {
			let edited = msg.editedTimestamp;
			msg.edit({ embed: ({
				color: 631398,
				title: 'Ping Data',
				description: `
Roundtrip: \`${Math.round((end-msg.createdTimestamp)/2)}ms\`
Discord Latency: \`${end-start}ms\`
API Latency: \`${Math.round(bot.ping)}ms\`
Heartbeat: \`${Math.floor(bpings)}ms\`
Message Edit: \`${edited-start}ms\`
`
			})});
		});
	}));
};

exports.info = {
	name: 'ping',
	aliases: ['pong'],
	hidden: true,
	usage: 'ping',
	description: 'Get the Latency of the bot.'
};
