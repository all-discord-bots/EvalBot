exports.run = async (bot, msg, args) => {
	try {
		if (args.length <= 0) return msg.channel.send(`<:redx:411978781226696705> Invalid \`user\` argument provided.`);
		let user = bot.utils.getMembers(msg,args.join(' '));
		if (!user) return msg.channel.send(`<:redx:411978781226696705> I could not find that user.`);
		if (user.toString().includes("I could not find that user.")) return;
		if (!msg.guild.members.get(`${user.id}`)) return msg.channel.send(`<:redx:411978781226696705> I could not find that user.`);
		
		let delmsg = bot.deleted.get(user.id);
		if (!delmsg) return msg.channel.send(`<:redx:411978781226696705> No recently deleted messages found.`);
		
		bot.deleted.delete(user.id);
		(await msg.channel.send(`Loading Messages...`).then((msg) => {
			msg.edit(`Undeleted message of \`${user.user.tag}\` in \`${delmsg.guild.name}\` | \`${delmsg.channel.name}\`\n\`\`\`${delmsg.content}\`\`\``);
		}));
	} catch (err) {
		console.error(err.stack ? err.stack : err.toString());
	}
};

exports.info = {
	name: 'undelete',
	userPermissions: ['MANAGE_MESSAGES','MANAGE_GUILD'],
	clientPermissions: ['MANAGE_MESSAGES'],
	usage: 'undelete <user>',
	examples: [
		'undelete BannerBomb'
	],
	description: 'Undeletes messages from a user.'
};
