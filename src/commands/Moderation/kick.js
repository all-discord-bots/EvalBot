const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
    let modlogs = "mod_logs"; // mod_logs channel
    let kUser = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));
    if(!kUser) return msg.channel.send("Can't find user!");
    let kReason = args.join(" ").slice(22);
    if (msg.author.id !== bot.config.botCreatorID) {
        if(!msg.member.hasPermission("KICK_MEMBERS")) return msg.channel.send("You are missing the permissions `Kick Members`!");
    }
//    if(kUser.hasPermission("MANAGE_MESSAGES")) return msg.channel.send("That person can't be kicked!");

    let kickEmbed = new Discord.RichEmbed()
    .setDescription("~Kick~")
    .setColor("#e56b00")
    .addField("Kicked User", `${kUser} with ID ${kUser.id}`)
    .addField("Kicked By", `<@${msg.author.id}> with ID ${msg.author.id}`)
    .addField("Kicked In", msg.channel)
    .addField("Tiime", msg.createdAt)
    .addField("Reason", kReason);

    let kickChannel = msg.guild.channels.find(`name`, `${modlogs}`);
    if(!kickChannel) return msg.channel.send(`Can't find ${modlogs} channel.`);

    msg.guild.member(kUser).kick(kReason);
    kickChannel.send(kickEmbed);
}

exports.info = {
  name: 'kick',
  usage: 'kick <member> <reason>',
  description: 'Kick a user from the server.'
}
