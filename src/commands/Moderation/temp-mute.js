exports.run = async (bot, msg, args) => {
	try {
		let modlogs = 'mod_logs';
		switch (args.length) {
			case 0:
				return msg.channel.send(`<:redx:411978781226696705> Too few arguments given.`);
		}
		let user = bot.utils.getMembers(msg,args[0]);
		if (!user) return msg.channel.send(`<:redx:411978781226696705> I could not find that user.`);
		if (user.toString().includes("I could not find that user.")) return;
		let reason = args.slice(1).join(' ');
		await msg.guild.fetchBans().then(async(bans) => {
			let users = bans.filter((user_object) => user_object === user);
			if (!users.first()) return msg.channel.send(`<:redx:411978781226696705> That user is not currently banned.`);
			await msg.guild.unban(user,{
				reason: `${reason}`
			}).then(() => {
				msg.channel.send(`<:check:411976443522711552> \`Case #N/A\` <@${user.id}> has been unbanned.`);
			}).catch((err) => {
				console.error(err.toString());
				return msg.channel.send(`<:redx:411978781226696705> I was unable to un-ban <@${user.id}> because ${err.message}`);
			});
		}).catch((err) => {
			console.error(err.toString());
			return msg.channel.send(`<:redx:411978781226696705> I was unable to un-ban <@${user.id}>.`);
		});
		let modlogs_channel = msg.guild.channels.find(`name`, `${modlogs}`);
		if (modlogs_channel) {
			let unban_reason = ``;
			if (reason !== "") {
				unban_reason = `\n**Reason:** ${reason}`
			}
			modlogs_channel.send({
				embed: ({
					description: `**Member:** ${user.user.tag} (${user.id})\n**Action:** Un-ban${unban_reason}`,
					color: 6732650,
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
	name: 'unban',
	aliases: ['un-ban','rm-ban','remove-ban'],
	userPermissions: ['BAN_MEMBERS'],
	clientPermissions: ['BAN_MEMBERS'],
	usage: 'unban <member> [reason]',
	examples: [
		'unban BannerBomb because he learned his lesson',
		'unban BannerBomb'
	],
	description: 'Unbans a user from the server'
};
