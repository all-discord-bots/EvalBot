//const fs = require("fs");

exports.run = async (bot, msg, args) => {
	try {
		//let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));
		//let autopunish = false;
		//let mutedrole = "muted";
		let modlogs = "mod_logs";
		let modlogs_channel = msg.guild.channels.find(`name`, `${modlogs}`);
		if (!modlogs_channel) return msg.channel.send(`<:redx:411978781226696705> You must have the \`mod_logs\` channel setup`);
		switch (args.length) {
			case 0:
				return msg.channel.send(`<:redx:411978781226696705> Too few arguments provided.`);
			case 1:
				return msg.channel.send(`<:redx:411978781226696705> Invalid \`<reason>\` argument given.`);
		}
		let user = bot.utils.getMembers(msg,args[0]);
		if (!user) return msg.channel.send(`<:redx:411978781226696705> I could not find that user.`);
		if (user.toString().includes("I could not find that user.")) return;
		if (!msg.guild.members.get(`${user.id}`)) return msg.channel.send(`<:redx:411978781226696705> I could not find that user.`);
		let reason = args.slice(1).join(' ');
		
		if (reason === "") return msg.channel.send(`<:redx:411978781226696705> Invalid \`<reason>\` argument given.`);
		if (user.id == msg.author.id) return msg.channel.send(`<:redx:411978781226696705> I cannot allow self-harm!`);
		if (user.id == bot.user.id) return msg.channel.send(`<:redx:411978781226696705> I cannot warn myself!`);
		//if(!warns[user.id]) {
		//	warns[user.id] = {
		//		warns: 0
		//	};
		//}
		//warns[user.id].warns++;
		//fs.writeFile("./warnings.json",JSON.stringify(warns),(err) => {
		//	if (err) console.error(err);
		//});
		msg.channel.send(`<:check:411976443522711552> \`Case #N/A\` <@${user.id}> has been warned.`);
		if (modlogs_channel) {
			modlogs_channel.send({
				embed: ({
					description: `**Member:** ${user.user.tag} (${user.id})\n**Action:** Warn\n**Reason:** ${reason}`,
					color: 16771899,
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
		
		/*if (autopunish) {
			switch (warns[user.id].warns) {
				default:
					break;
				case 1:
					break;
				case 2:
					let muterole = msg.guild.roles.find(`name`, `${mutedrole}`);
					if (!muterole) return msg.channel.send(`<:redx:411978781226696705> Cannot find ${mutedrole} role!`);
					let mutetime = "10s";
					await user.addRole(muterole.id).then(() => {
						msg.channel.send(`<:check:411976443522711552> <@${user.id}> has been temporarily muted for \`${mutetime}\`.`);
					}).catch((err) => {
						console.error(err.toString());
						msg.channel.send(`<:redx:411978781226696705> I was not able to mute \`${user.username}\`: ${err}`);
					});
					setTimeout(function() {
						await user.removeRole(muterole.id).then(() => {
							msg.channel.send(`<:check:411976443522711552> <@${user.id}> has been unmuted.`);
						}).catch((err) => {
							console.error(err.toString());
							msg.channel.send(`<:redx:411978781226696705> I was not able to unmute ${user.username}: ${err}`);
						});
					}, ms(mutetime));
					break;
				case 3:
					await user.ban(reason).then(() => {
						msg.channel.send(`<:check:411976443522711552> <@${user.id}> has been banned.`);
					}).catch((err) => {
						console.error(err.toString());
						msg.channel.send(`<:redx:411978781226696705> I was not able to ban ${user.username}: ${err}`);
					});
			}
		}*/
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'warn',
	aliases: ['w'],
	userPermissions: ['KICK_MEMBERS'],
	usage: 'warn <member> <reason>',
	examples: [
		'warn BannerBomb Being too awesome'
	],
	description: 'Gives member a warning, usually for breaking the rules. If you would like to let the bot keep logs of moderations create a text channel named `mod_logs`'
};
