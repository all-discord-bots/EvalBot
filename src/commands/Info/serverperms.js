exports.run = async (bot, msg, args) => {
	if (args.length <= 0)
	{
		function emoji(permission)
		{
			let gbot = msg.guild.members.get(bot.user.id);
			let icon = gbot.hasPermission(permission) ? `:white_check_mark:` : `<:box_x:479196972738281478>`
			return icon;
		}
		msg.channel.send({embed: ({
			timestamp: new Date(),
			fields: [
				{
					name: "Here are my server permissions:",
					value: `${emoji(0x00000040)} Add reactions\n${emoji(0x00008000)} Attach files\n${emoji(0x04000000)} Change nickname\n${emoji(0x00000001)} Create instant invite\n${emoji(0x00004000)} Embed links\n${emoji(0x00000002)} Kick members\n${emoji(0x40000000)} Manage emojis\n${emoji(0x00002000)} Manage messages\n${emoji(0x10000000)} Manage roles\n${emoji(0x00020000)} Mention everyone\n${emoji(0x00400000)} Mute members\n${emoji(0x00010000)} Read message history\n${emoji(0x00000800)} Send messages\n${emoji(0x00200000)} Speak\n${emoji(0x00000080)} View audit log`,
					inline: true
				}, {
					name: "​",
					value: `${emoji(0x00000008)} Administrator\n${emoji(0x00000004)} Ban members\n${emoji(0x00100000)} Connect\n${emoji(0x00800000)} Deafen members\n${emoji(0x00040000)} External emojis\n${emoji(0x00000010)} Manage channels\n${emoji(0x00000020)} Manage guild\n${emoji(0x08000000)} Manage nicknames\n${emoji(0x04000000)} Change nickname\n${emoji(0x20000000)} Manage webhooks\n${emoji(0x01000000)} Move members\n${emoji(0x00000100)} Priority speaker\n${emoji(0x00000400)} Read messages\n${emoji(0x00001000)} Send tts messages\n${emoji(0x02000000)} Use voice activation`,
					inline: true
				}
			]
		})}).catch(err => console.error(err.toString()));
	}
}

exports.info = {
	name: 'serverperms',
	hidden: true,
	aliases: ['serverpermission','servpermissions'],
	example: [
		'serverperms'
	],
	usage: 'perms',
	description: 'Shows you a list of the bots permissions in the server.'
}
