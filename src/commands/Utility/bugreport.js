exports.run = async (bot, msg, args) => {
	if (args.length < 1) return msg.channel.send(`<:redx:411978781226696705> Please explain the bug you encountered!`);
	if (msg.author.id !== bot.config.botCreatorID) {
		if(!msg.member.hasPermission("MANAGE_SERVER")) return msg.channel.send(`<:redx:411978781226696705> You are missing the permissions \`Manage Server\`!`).catch(console.error);
    }
	let report = args.join(' ');
	bot.channels.get('415897875315425291').send({embed: ({
		color: 15684432,
		title: `__Bug Report__`,
		timestamp: new Date(),
		author: {
			name: `${msg.author.tag} <${msg.author.id}>`,
			icon_url: `${msg.author.displayAvatarURL}`
		}, fields: [
		{
			name: '__User Reporting Issue__',
			value: `<@${msg.author.id}> \`[${msg.author.tag}]\``,
			inline: true
		}, {
			name: '__Server Sent From__',
			value: `${msg.guild.name} \`[${msg.guild.id}]\``,
			inline: true
		}, {
			name: '__Described Issue__',
			value: `${report}`
		}
	],
})}).catch(console.error);
	msg.channel.send(`<:check:411976443522711552> Bug report has been successfully sent.`);
};

exports.info = {
	name: 'bug-report',
	aliases: ['bugreport','reportbug','sendbugreport','send-bug-report'],
	usage: 'bug-report <explain your bug here>',
	description: 'Report bugs using this command, which sends a bug report to me so I may fix them.'
};
