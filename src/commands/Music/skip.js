require('../../conf/globals.js');
exports.run = async (bot, msg, args) => {
	const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
	if (voiceConnection === null || !musicqueue[msg.guild.id] || musicqueue[msg.guild.id] && musicqueue[msg.guild.id]['music'].length < 1) return msg.channel.send(`<:redx:411978781226696705> There is no audio being played.`).catch(console.error);
	let skipped, s;
	if (!args[0]) {
		skipped = `1`;
		s = '';
	} else if (args[0]) {
		skipped = args[0];
		s = 's';
	}
	let toSkip = Math.min(parseInt(args[0]), musicqueue[msg.guild.id]['music'].length);
	musicqueue[msg.guild.id]['music'].splice(0, parseInt(toSkip) - 1);
	try {
		const dispatcher = voiceConnection.player.dispatcher;
		if (voiceConnection.paused) dispatcher.resume();
		dispatcher.end();
	} catch (e) {
		const nerr = e.toString().split(':');
		return msg.channel.send(`<:redx:411978781226696705> Error occoured!\n\`\`\`\n${nerr[0]}: ${nerr[1]}\n\`\`\``);
	};
	//console.log(`Skipped ${skipped} song${s}.`);
	msg.channel.send(`<:check:411976443522711552> Skipped ${skipped} song${s}.`);
};

exports.info = {
	name: 'skip',
	usage: 'skip [number]',
	description: 'Skip a song or multi songs.'
};
