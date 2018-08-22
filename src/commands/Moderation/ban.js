const Discord = require("discord.js");

exports.run = async (bot, msg, args) => {
	try {
		if (args.length <= 0) return msg.channel.send(`<:redx:411978781226696705> You must provide a user to ban.`).catch(err => console.error);
		let modlogs = "mod_logs";
		let bUser = bot.utils.getMembers(msg,args[0]);
		if (!msg.guild.member(bUser)) return msg.channel.send(`<:redx:411978781226696705> I could not find that user.`).catch(err => console.error);
		if (bUser.toString().includes("I could not find that user.")) return;
		let bReason = args.join(" ").slice(22);
		if(!msg.guild.member(bUser).bannable) return msg.channel.send(`<:redx:411978781226696705> I may need my role moved higher!`).catch(err => console.error);
		if (bUser.user.id === msg.author.id) return msg.channel.send(`<:redx:411978781226696705> I cannot allow self-harm!`).catch(err => console.error);
		let incidentchannel = msg.guild.channels.find(`name`, `${modlogs}`);
		// if(!incidentchannel) return msg.channel.send(`Can't find ${modlogs} channel.`).catch(console.error);
		msg.guild.member(bUser).ban(bReason).catch(err => msg.channel.send(`<:redx:411978781226696705> I could not ban this user due to the error: ${err}`));
		if (incidentchannel) {
			let banEmbed = new Discord.RichEmbed()
				.setDescription("~Ban~")
				.setColor("#bc0000")
				.addField("Banned User", `${bUser} with ID ${bUser.id}`)
				.addField("Banned By", `<@${msg.author.id}> with ID ${msg.author.id}`)
				.addField("Banned In", msg.channel)
				.addField("Time", msg.createdAt)
				.addField("Reason", bReason);
			incidentchannel.send(banEmbed).catch(err => console.error);
		}
		msg.channel.send(`<:check:411976443522711552> Successfully banned <@${bUser.id}>`).catch(err => console.error);
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'ban',
	userPermissions: ["BAN_MEMBERS"],
	clientPermissions: ["BAN_MEMBERS"],
	aliases: ['bean','deport'],
	usage: 'ban <member> <reason>',
	description: 'Bans users from your guild. If you would like to let the bot keep logs of moderations create a text channel named `mod_logs`'
};
