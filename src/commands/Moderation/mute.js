const ms = require('ms');

exports.run = (bot, msg, args) => {
	try {
		let muted_role_name = 'Muted';
		switch (args.length) {
			case 0:
				return msg.channel.send(`<:redx:411978781226696705> Too few arguments given.`);
		}
		let user = bot.utils.getMembers(msg,args[0]);
		if (!user) return msg.channel.send(`<:redx:411978781226696705> I could not find that user.`);
		if (user.toString().includes("I could not find that user.")) return;
		if (!msg.guild.members.get(`${user.id}`)) return msg.channel.send(`<:redx:411978781226696705> I could not find that user.`);
		let reason;
		//if (ms(`${args[1]}`) && args[1] <= 0) return msg.channel.send(`Invalid mute length provided.`);
		let mute_length = ``;
		if (ms(`${args[1]}`)) {
			reason = args.slice(2).join(' ');
		} else {
			reason = args.slice(1).join(' ');
			mute_length = 'infinite';
		}
		let muted_members = {};
		if (!muted_members[msg.guild.id]) {
			muted_members[msg.guild.id] = {
				muted_users: {}
			};
		}
		if (user.id == msg.author.id) return msg.channel.send(`<:redx:411978781226696705> I cannot allow self-harm!`);
		if (user.id == bot.user.id) return msg.channel.send(`<:redx:411978781226696705> I cannot mute myself!`);
		if (user.manageable == false) return msg.channel.send(`<:redx:411978781226696705> I may need my role moved higher!`);
		let mute_role = msg.guild.roles.find('name', muted_role_name);
		if (!mute_role) return msg.channel.send(`<:redx:411978781226696705> I was unable to find the role \`${muted_role_name}\` you can set one up using the \`muted-role\` command.`);
		if (!user.roles.has(mute_role.id)) {
			user.addRole(mute_role.id).then(() => {
				msg.channel.send(`<:check:411976443522711552> \`Case #N/A\` <@${user.id}> has been muted for ${ms(ms(`${args[1]}`),{ long: true })}.`);
				if (mute_length !== 'infinite') {
					muted_members[msg.guild.id]['muted_users'][user.id] = setTimeout(() => {
						delete muted_members[msg.guild.id]['muted_users'][user.id];
						user.removeRole(mute_role.id).then(() => {
							log_moderation(msg,user,args,'infinite',6732650,'Un-mute','Automatic Unmute');
						}).catch((err) => {
							console.error(err.toString());
						});
					}, ms(`${args[1]}`));
				}
			}).catch((err) => {
				console.error(err.toString());
				return msg.channel.send(`<:redx:411978781226696705> I was unable to mute <@${user.id}> because ${err.message}.`);
			});
		} else {
			return msg.channel.send(`<:redx:411978781226696705> That user has already been muted.`);
		}
		log_moderation(msg,user,args,mute_length,16747777,'Mute',reason);
	} catch (err) {
		console.error(err.toString());
	}
};

const log_moderation = async (msg,user,args,mute_length,color,action,reason,modlogs = 'mod_logs') => {
	let modlogs_channel = msg.guild.channels.find('name', `${modlogs}`);
	if (modlogs_channel) {
		let mute_duration = ``;
		if (mute_length !== 'infinite') {
			mute_duration = `\n**Length** ${ms(ms(`${args[1]}`),{ long: true })}`;
		}
		let mute_reason = ``;
		if (reason !== "") {
			mute_reason = `\n**Reason:** ${reason}`;
		}
		modlogs_channel.send({
			embed: ({
				description: `**Member:** ${user.user.tag} (${user.id})\n**Action:** ${action}${mute_duration}${mute_reason}`,
				color: color,
				timestamp: new Date(),
				author: {
					name: `${msg.author.tag}`,
					icon_url: `${msg.author.displayAvatarURL()}`
				},
				footer: {
					text: `Case #N/A`
					//text: `Case #${caseNum}`
				}
			})
		});
	}
};

exports.info = {
	name: 'mute',
	aliases: ['m'],
	userPermissions: ['KICK_MEMBERS'],
	clientPermissions: ['MANAGE_ROLES'],
	usage: 'mute <member> [length] [reason]',
	examples: [
		'mute BannerBomb being too loud',
		'mute BannerBomb 10d for not listening',
		'mute BannerBomb'
	],
	description: `Mutes a member from the server.\nThis prevents them from sending messages.\nIf no length is given they will be muted until un-muted.\nIf you would like to let the bot keep logs of moderations create a text channel named \`mod_logs\``
};
