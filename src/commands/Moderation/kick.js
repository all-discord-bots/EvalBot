exports.run = async (bot, msg, args) => {
	try {
		let modlogs = "mod_logs";
		switch (args.length) {
			case 0:
				return msg.channel.send(`<:redx:411978781226696705> Too few arguments given.`);
		}
		let user = bot.utils.getMembers(msg,args[0]);
		if (!user) return msg.channel.send(`<:redx:411978781226696705> I could not find that user.`);
		if (user.toString().includes("I could not find that user.")) return;
		if (!msg.guild.members.get(`${user.id}`)) return msg.channel.send(`<:redx:411978781226696705> I could not find that user.`);
		let reason = args.slice(1).join(' ');
		if (user.id == msg.author.id) return msg.channel.send(`<:redx:411978781226696705> I cannot allow self-harm!`);
		if (user.manageable == false) return msg.channel.send(`<:redx:411978781226696705> I may need my role moved higher!`);
		if (user.kickable == false) return msg.channel.send(`<:redx:411978781226696705> I cannot kick that user.`);
		await user.kick({
			reason: `${reason}`
		}).then(() => {
			msg.channel.send(`<:check:411976443522711552> \`Case #N/A\` <@${user.id}> has been kicked.`);
		}).catch((err) => {
			console.error(err.toString());
			msg.channel.send(`<:redx:411978781226696705> I was unable to kick <@${user.id}> because ${err.message}.`);
		});
		let modlogs_channel = msg.guild.channels.find(`name`, `${modlogs}`);
		if (modlogs_channel) {
			let kick_reason = ``;
			if (reason !== "") {
				kick_reason = `\n**Reason:** ${reason}`
			}
			modlogs_channel.send({
				embed: ({
					description: `**Member:** ${user.tag} (${user.id})\n**Action:** Kick${kick_reason}`,
					color: 16747777,
					timestamp: new Date(),
					author: {
						name: `${msg.author.tag}`,
						icon_url: `${msg.author.displayAvatarURL}`
					},
					footer: {
						text: `Case #N/A`
						//text: `Case #${caseNum}`
					}
				})
			});
		}
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'kick',
	clientPermissions: ["KICK_MEMBERS"],
	userPermissions: ["KICK_MEMBERS"],
	aliases: ['smear'],
	usage: 'kick <member> [reason]',
	examples: [
		'kick BannerBomb Being so amazing',
		'kick BannerBomb'
	],
	description: 'Kick a user from the server. If you would like to let the bot keep logs of moderations create a text channel named `mod_logs`'
};
