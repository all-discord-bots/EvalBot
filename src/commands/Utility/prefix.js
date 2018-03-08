exports.run = async (bot, msg) => {
	let newPrefix = msg.content.split(' ').slice(1).join(' ');
	if (!newPrefix) {
		if (!bot.config[msg.guild.id]) return msg.channel.send(`This guilds current prefix is \`${bot.config.prefix}\``).catch(console.error);
		if (bot.config[msg.guild.id]) return msg.channel.send(`This guilds current prefix is \`${bot.config[msg.guild.id].prefix}\``).catch(console.error);
	}
	
	if (msg.author.id !== bot.config.botCreatorID) {
		if (!msg.member.hasPermission('MANAGE_SERVER')) return msg.channel.send(`<:redx:411978781226696705> You are missing permissions \`Manage Server\``).catch(console.error);
	}
	
	bot.managers.config.set(msg.guild.id, {prefix: newPrefix});
	msg.channel.send(`<:check:411976443522711552> Prefix changed to \`${newPrefix}\`.`);
};

exports.info = {
	name: 'prefix',
	usage: 'prefix <prefix>',
	description: 'Change the prefix of the bot'
};
