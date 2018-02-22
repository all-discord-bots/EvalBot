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
    if (rUser.user.id === msg.author.id) return msg.channel.send(`<:redx:411978781226696705> I cannot allow self-harm!`).catch(console.error);
    let reportEmbed = new Discord.RichEmbed()
    .setDescription("Reports")
    .setColor("#15f153")
    .addField("Reported User", `${rUser} with ID: ${rUser.id}`)
    .addField("Reported By", `${msg.author} with ID: ${msg.author.id}`)
    .addField("Channel", msg.channel)
    .addField("Time", msg.createdAt)
    .addField("Reason", rreason);

    let reportschannel = msg.guild.channels.find(`name`, `${reportchannel}`);
    //if(!reportschannel) return msg.channel.send(`Couldn't find ${reportchannel} channel.`).catch(console.error);


    msg.delete().catch(O_o=>{});
    if (reportchannel) {
        reportschannel.send(reportEmbed);
    }

}
 
exports.info = {
  name: 'report',
  hidden: true,
  usage: 'report <user> <reason>',
  description: 'Reports a user, same thing as warn but just logs a message in th mod_logs channel. If you would like to let the bot keep logs of moderations create a text channel named `mod_logs`'
}
