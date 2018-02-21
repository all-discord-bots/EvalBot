const Discord = require("discord.js");

exports.run = async (bot, msg, args) => {
    let gbot = msg.guild.members.get(bot.user.id);
    if (!gbot.hasPermission(0x00000002)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Kick Members\`!`).catch(console.error);
    if (msg.author.id !== bot.config.botCreatorID) {
      if (!msg.member.hasPermission('KICK_MEMBERS')) return msg.channel.send(`<:redx:411978781226696705> You are missing permissions \`Kick Members\`!`).catch(console.error);
    }
    let reportchannel = "mod_logs";
    let rUser = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));
    if(!rUser) return msg.channel.send(`<:redx:411978781226696705> Can't find that user.`).catch(console.error);
    let rreason = args.join(" ").slice(22);

    let reportEmbed = new Discord.RichEmbed()
    .setDescription("Reports")
    .setColor("#15f153")
    .addField("Reported User", `${rUser} with ID: ${rUser.id}`)
    .addField("Reported By", `${msg.author} with ID: ${msg.author.id}`)
    .addField("Channel", msg.channel)
    .addField("Time", msg.createdAt)
    .addField("Reason", rreason);

    let reportschannel = msg.guild.channels.find(`name`, `${reportchannel}`);
    if(!reportschannel) return msg.channel.send(`Couldn't find ${reportchannel} channel.`).catch(console.error);


    msg.delete().catch(O_o=>{});
    reportschannel.send(reportEmbed);

}
 
exports.info = {
  name: 'report',
  usage: 'report <user> <reason>',
  description: 'Report a user and logs it in a mod_logs channel.'
}
