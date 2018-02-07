const Discord = require("discord.js");

exports.run = async (bot, msg, args) => {
    let sicon = msg.guild.iconURL;
    let serverembed = new Discord.RichEmbed()
    .setDescription("Server Information")
    .setColor("#15f153")
    .setThumbnail(sicon)
    .addField("Server Name", msg.guild.name)
    .addField("Created On", msg.guild.createdAt)
    .addField("You Joined", msg.member.joinedAt)
    .addField("Total Members", msg.guild.memberCount);

    msg.channel.send(serverembed);
}

exports.info = {
  name: 'serverinfo1',
  usage: 'serverinfo1',
  description: 'displays information on the current guild.',
}
