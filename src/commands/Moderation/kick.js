const Discord = require("discord.js");

exports.run = async (bot, msg, args) => {
	try {
		if (args.length <= 0) return msg.chaconst Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	try {
		let modlogs = "mod_logs"; // mod_logs channel
		let kUser = bot.utils.getMembers(msg,args[0],false,true);
		if (!kUser) return msg.channel.send(`<:redx:411978781226696705> I could not find that user.`).catch(err => console.error);
		if (kUser.toString().includes("I could not find that user.")) return;
		let kReason = args.join(" ").slice(22);
		let gbot = msg.guild.members.get(bot.user.id);
		if (!gbot.hasPermission(0x00000002)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Kick Members\`!`).catch(err => console.error);
		if(!msg.guild.member(kUser).kickable) return msg.channel.send(`<:redx:411978781226696705> I may need my role moved higher!`).catch(err => console.error);
		if (kUser.user.id === msg.author.id) return msg.channel.send(`<:redx:411978781226696705> I cannot allow self-harm!`).catch(err => console.error);
		let kickChannel = msg.guild.channels.find(`name`, `${modlogs}`);
		// if(!kickChannel) return msg.channel.send(`Can't find ${modlogs} channel.`).catch(err => console.error);
		msg.guild.member(kUser).kick(kReason).catch(err => msg.channel.send(`I could not kick this user due to the error: ${err}`));
		if (kickChannel) {
			let kickEmbed = new Discord.RichEmbed()
				.setDescription("~Kick~")
				.setColor("#e56b00")
				.addField("Kicked User", `${kUser} with ID ${kUser.id}`)
				.addField("Kicked By", `<@${msg.author.id}> with ID ${msg.author.id}`)
				.addField("Kicked In", msg.channel)
				.addField("Time", msg.createdAt)
				.addField("Reason", kReason);
			kickChannel.send(kickEmbed).catch(err => console.error);
		}
		msg.channel.send(`<:check:411976443522711552> Successfully kicked <@${kUser.id}>`).catch(err => console.error);
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'kick',
	clientPermissions: ["KICK_MEMBERS"],
	userPermissions: ["KICK_MEMBERS"],
	aliases: ['smear'],
	usage: 'kick <member> <reason>',
	description: 'Kick a user from the server. If you would like to let the bot keep logs of moderations create a text channel named `mod_logs`'
};
