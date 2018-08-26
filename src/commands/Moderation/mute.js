const ms = require('ms');

exports.run = (bot, msg, args) => {
	try {
		let modlogs = 'mod_logs';
		let muted_role_name = 'Muted';
		switch (args.length) {
			case 0:
				return msg.channel.send(`<:redx:411978781226696705> Too few arguments given.`);
		}
		let user = bot.utils.getMembers(msg,args[0]);
		if (!user) return msg.channel.send(`<:redx:411978781226696705> I could not find that user.`);
		if (user.toString().includes("I could not find that user.")) return;
		let reason;
		//if (ms(`${parseFloat(args[1])}`) && args[1] <= 0) return msg.channel.send(`Invalid mute length provided.`);
		let mute_length = ``;
		if (ms(`${parseFloat(args[1])}`)) {
			reason = args.slice(2).join(' ');
			mute_length = 'infinite';
		} else {
			reason = args.slice(1).join(' ');
		}
		if (user.id == msg.author.id) return msg.channel.send(`<:redx:411978781226696705> I cannot allow self-harm!`);
		if (user.manageable == false) return msg.channel.send(`<:redx:411978781226696705> I may need my role moved higher!`);
		let mute_role = msg.guild.roles.find('name', muted_role_name);
		if (!mute_role) return msg.channel.send(`<:redx:411978781226696705> I was unable to find the role \`Muted\` have you made it yet?`);
		if (!user.roles.has(mute_role.id)) {
			user.addRole(mute_role.id).then(() => {
				msg.channel.send(`<:check:411976443522711552> \`Case #N/A\` <@${user.id}> has been muted for ${ms(ms(`${parseFloat(args[1])}`),{ long: true })}.`);
			}).catch((err) => {
				console.error(err.toString());
				return msg.channel.send(`<:redx:411978781226696705> I was unable to mute <@${user.id}> because ${err.message}.`);
			});
		} else {
			return msg.channel.send(`<:redx:411978781226696705> That user has already been muted.`);
		}
		let modlogs_channel = msg.guild.channels.find('name', `${modlogs}`);
		if (modlogs_channel) {
			let mute_duration = ``;
			if (mute_length !== 'infinite') {
				mute_duration = `\n**Length** ${ms(ms(`${parseFloat(args[1])}`), { long: true })}`;
			}
			let mute_reason = ``;
			if (reason !== "") {
				mute_reason = `\n**Reason:** ${reason}`
			}
			modlogs_channel.send({
				embed: ({
					description: `**Member:** ${user.tag} (${user.id})\n**Action:** Mute${mute_duration}${mute_reason}`,
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
	name: 'mute',
	aliases: ['unmute'],
	userPermissions: ['KICK_MEMBERS'],
	clientPermissions: ['MANAGE_ROLES'],
	usage: 'mute <member> [length] [reason]',
	examples: [
		'mute BannerBomb being too loud',
		'mute BannerBomb 10d for not listening',
		'mute BannerBomb'
	],
	description: 'mutes or unmutes a mentioned user. If you would like to let the bot keep logs of moderations create a text channel named `mod_logs`'
};
