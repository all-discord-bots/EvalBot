exports.run = async (bot, msg, args) => {
	try {
		if (args.length <= 0) return msg.channel.send(`<:redx:411978781226696705> Please explain the bug you encountered!`);
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
				value: `${args.join(' ')}`
			}
		],
	})}).catch((err) => console.error);
		msg.channel.send(`<:check:411976443522711552> Bug report has been successfully sent.`);
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'bug-report',
	userPermissions: ['MANAGE_SERVER'],
	aliases: ['bugreport','reportbug','sendbugreport','send-bug-report','feedback'],
	usage: 'bug-report <explain your bug here>',
	examples: [
		'bug-report This bot is nice.'
	],
	description: 'Report bugs using this command, which sends a bug report to me so I may fix them. You may use markdown.'
};
