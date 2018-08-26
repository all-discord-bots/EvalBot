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
		let reason;
		if (parseFloat(args[1])) {
			reason = args.slice(2).join(' ');
		} else {
			reason = args.slice(1).join(' ');
		}
		if (user.id == msg.author.id) return msg.channel.send(`<:redx:411978781226696705> I cannot allow self-harm!`);
		if (user.manageable == false) return msg.channel.send(`<:redx:411978781226696705> I may need my role moved higher!`);
		if (user.bannable == false) return msg.channel.send(`<:redx:411978781226696705> I cannot ban that user.`);
		await user.ban({
			days: parseFloat(args[1]) || 0,
			reason: `${reason}`
		}).then(() => {
			msg.channel.send(`<:check:411976443522711552> \`Case #N/A\` <@${user.id}> has been banned.`);
		}).catch((err) => {
			console.error(err.toString());
			msg.channel.send(`<:redx:411978781226696705> I was unable to ban <@${user.id}> because ${err.message}.`);
		});
		let modlogs_channel = msg.guild.channels.find(`name`, `${modlogs}`);
		if (modlogs_channel) {
			let ban_reason = ``;
			if (reason !== "") {
				ban_reason = `\n**Reason:** ${reason}`
			}
			modlogs_channel.send({
				embed: ({
					description: `**Member:** ${user.tag} (${user.id})\n**Action:** Ban${ban_reason}`,
					color: 15684432,
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
	name: 'ban',
	userPermissions: ["BAN_MEMBERS"],
	clientPermissions: ["BAN_MEMBERS"],
	aliases: ['bean','deport'],
	usage: 'ban <member> [days delete] [reason]',
	examples: [
		'ban BannerBomb being amazing',
		'ban BannerBomb 3 for no reason'
	],
	description: 'Bans users from your guild. If you would like to let the bot keep logs of moderations create a text channel named `mod_logs`'
};
