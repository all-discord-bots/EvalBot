const fetch = require('node-fetch');

exports.run = async (bot, msg, args) => {
	if (msg.author.id !== "269247101697916939") return;
	if (args.length <= 0) {
		if (!bot.config[msg.guild.id.toString()]) return msg.channel.send(`This guilds current prefix is \`${bot.config.prefix}\`.`).catch(err => console.error);
		if (bot.config[msg.guild.id.toString()]) return msg.channel.send(`This guilds current prefix is \`${bot.config[msg.guild.id.toString()].prefix}\`.`).catch(err => console.error);
	}
	
	try {
		bot.managers.config.set(msg.guild.id, {prefix: args.join(' ')});
		fetch(`http://cripsbot.000webhostapp.com/database/database_update.php?guild_id=${msg.guild.id}&prefix=${args.join(' ')}&database_token=QISqwssXd93riidEqjjRFom19SDuSTEU`).catch(err => console.error);
		msg.channel.send(`<:check:411976443522711552> Prefix changed to \`${args.join(' ')}\`.`);
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'prefix',
	userPermissions: ['MANAGE_GUILD'],
	usage: 'prefix [prefix]',
	examples: [
		'prefix',
		'prefix !'
	],
	description: 'Change the prefix of the bot'
};
