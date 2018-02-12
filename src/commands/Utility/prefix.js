exports.run = async (bot, msg) => {
	if (msg.author.id !== bot.config.botCreatorID) {
		if (!msg.member.hasPermission('MANAGE_SERVER')) return;
	}
	let newPrefix = msg.content.split(' ').slice(1).join(' ');
	//var globalPrefOld = bot.config.[msg.guild.id].prefix;
	bot.config.set(msg.guild.id, {prefix: newPrefix})
	msg.channel.send(`Prefix changed to ${newPrefix}`);
};

exports.info = {
	name: 'prefix',
	usage: 'prefix <prefix>',
	description: 'Change the prefix of the bot'
};
