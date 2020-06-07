exports.run = async (bot, msg, args) => {
	if (args.length < 1) return msg.channel.send("Invalid arguments! Please provide a role name.").catch(console.error);
	const rolename = args.join(" ");
	let getroleid;
	let maproles = msg.guild.roles.map(m => m.name).filter(m => m.toLowerCase().includes(`${rolename}`));
	if (maproles.length == 1) {
		//getroleid = msg.guild.roles.find(`name`, `${rolename}`).toLowerCase().id;
		getroleid = msg.guild.roles.find(`name`, `${maproles.toString()}`).id;
	} else if (maproles.length < 1) {
		return msg.channel.send(`<:redx:411978781226696705> No roles with the name \`${rolename}\` exists. The name is case sensitive.`).catch(console.error);
	} else if (maproles.length > 1) {
		return msg.channel.send(`<:redx:411978781226696705> Too many roles found, please try being more specific.`).catch(console.error);
	}
	msg.channel.send(`${getroleid.toString()}`);
};

exports.info = {
	name: 'role-id',
	aliases: ['roleid'],
	usage: 'role-id <role>',
	description: 'Easy and simple way to get the ID of any role.'
};
