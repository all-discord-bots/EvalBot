exports.run = async (bot, msg, args) => {
	if (msg.author.id !== bot.config.botCreatorID) {
		if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.channel.send(`<:redx:411978781226696705> You are missing permissions \`Administrator\`!`);
	}
	if (args.length < 1) {
		return msg.channel.send(`<:redx:411978781226696705> Invalid arguments!`);
	}
	let grole;
	if (msg.guild.roles.find(`name`, `${args[0]}`)) {
		grole = msg.guild.roles.find(`name`, `${args[0]}`);
	} else if (msg.guild.roles.find(`id`, `${args[0]}`)) {
		grole = msg.guild.roles.find(`name`, `${args[0]}`);
	}
	msg.guild.members.filter(m => !m.user.bot).filter(m => m.roles.has(grole.id)).map(m => m.user.removeRole(grole));
	msg.channel.send(`<:check:411976443522711552> Successfully removed \`${grole.name}\` from all members.`);
};

exports.info = {
	name: 'takeallrole',
	usage: 'takeallrole <role>',
	description: 'Remove a role from every member in your server if they have it.'
};
