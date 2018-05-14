exports.run = async (bot, msg, args) => {
	let gbot = msg.guild.members.get(bot.user.id);
	if (!gbot.hasPermission(0x10000000)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Manage Roles\`!`).catch(console.error);
	if (msg.author.id !== bot.config.botCreatorID) {
		if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.channel.send(`<:redx:411978781226696705> You are missing permissions \`Administrator\`!`).catch(console.error);
	}
	if (args.length < 1) {
		return msg.channel.send(`<:redx:411978781226696705> Invalid arguments!`).catch(console.error);
	}
	let role = args.join(" ");
	let grole;
	try {
		if (msg.guild.roles.find(`name`, `${role}`)) {
			grole = msg.guild.roles.find(`name`, `${role}`);
		} else if (msg.guild.roles.find(`id`, `${role}`)) {
			grole = msg.guild.roles.find(`id`, `${role}`);
		} else {
			return msg.channel.send(`<:redx:411978781226696705> No roles with the name ${role.toString()} exists!`).catch(cosole.error);
		}
		msg.guild.members.filter(m => !m.user.bot).filter(m => m.roles.has(grole.id)).map(m => m.removeRole(grole).catch(console.error));
		msg.channel.send(`<:check:411976443522711552> Successfully removed \`${grole.name}\` from all members.`);
	} catch (err) {
		msg.channel.send(`<:redx:411978781226696705> an error has occured \`${err.name}\`:\n\`\`\`${err.message}\`\`\``);
	}
};

exports.info = {
	name: 'takeallrole',
	usage: 'takeallrole <role>',
	description: 'Remove a role from every member in your server if they have it. CASE SENSITIVE role name.'
};
