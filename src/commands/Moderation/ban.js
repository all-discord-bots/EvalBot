const Discord = require("discord.js");

exports.run = async (bot, msg, args) => {
    let modlogs = "mod_logs";
    let bUser = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));
    if(!bUser) return msg.channel.send(`Can't find that user!`).catch(console.error);
    let bReason = args.join(" ").slice(22);
    let gbot = msg.guild.members.get(bot.user.id);
    if (!gbot.hasPermission(0x00000004)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Ban Members\`!`).catch(console.error);
    if (msg.author.id !== bot.config.botCreatorID) {
      if(!msg.member.hasPermission("BAN_MEMBERS")) return msg.channel.send(`<:redx:411978781226696705> You are missing the permissions \`Ban Members\`!`).catch(console.error);
    }
    if(!msg.guild.member(bUser).bannable) return msg.channel.send(`<:redx:411978781226696705> I may need my role moved higher!`).catch(console.error);
//    if(bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("That person can't be kicked!");
    if (bUser.user.id === msg.author.id) return msg.channel.send(`<:redx:411978781226696705> I cannot allow self-harm!`).catch(console.error);
    let incidentchannel = msg.guild.channels.find(`name`, `${modlogs}`);
//    if(!incidentchannel) return msg.channel.send(`Can't find ${modlogs} channel.`).catch(console.error);

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
        incidentchannel.send(banEmbed).catch(console.error);
    }
    msg.channel.send(`<:check:411976443522711552> Successfully banned <@${bUser.id}>`).catch(console.error);
}

exports.info = {
  name: 'ban',
  aliases: ['bean','deport'],
  usage: 'ban <member> <reason>',
  description: 'Bans users from your guild. If you would like to let the bot keep logs of moderations create a text channel named `mod_logs`'
}
