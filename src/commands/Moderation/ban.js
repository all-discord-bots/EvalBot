const Discord = require("discord.js");

exports.run = async (bot, msg, args) => {
    let modlogs = "mod_logs";
    let bUser = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));
    if(!bUser) return msg.channel.send("Can't find user!");
    let bReason = args.join(" ").slice(22);
    let gbot = msg.guild.members.get(bot.user.id);
    if (!gbot.hasPermission(0x00000004)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Ban Members\`!`);
    if (msg.author.id !== bot.config.botCreatorID) {
      if(!msg.member.hasPermission("BAN_MEMBERS")) return msg.channel.send(`<:redx:411978781226696705> You are missing the permissions \`Ban Members\`!`);
    }
    if(!msg.guild.member(bUser).bannable) return msg.channel.send(`<:redx:411978781226696705> I may need my role moved higher!`);
//    if(bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("That person can't be kicked!");
  
    let banEmbed = new Discord.RichEmbed()
    .setDescription("~Ban~")
    .setColor("#bc0000")
    .addField("Banned User", `${bUser} with ID ${bUser.id}`)
    .addField("Banned By", `<@${msg.author.id}> with ID ${msg.author.id}`)
    .addField("Banned In", msg.channel)
    .addField("Time", msg.createdAt)
    .addField("Reason", bReason);

    let incidentchannel = msg.guild.channels.find(`name`, `${modlogs}`);
    if(!incidentchannel) return msg.channel.send(`Can't find ${modlogs} channel.`);

    msg.guild.member(bUser).ban(bReason).catch(err => msg.channel.send(`I could not kick this user due to the error: ${err}`));
    incidentchannel.send(banEmbed);
}

exports.info = {
  name: 'ban',
  usage: 'ban <member> <reason>',
  description: 'Bans users from your guild.'
}
