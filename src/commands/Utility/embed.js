const Discord = require("discord.js");
exports.run = (bot, msg, args) => {
  msg.delete();
  const embed = new Discord.MessageEmbed()
    .setDescription(args.join(" "))
    .setColor([114, 137, 218]);
  msg.channel.send({embed});
};

exports.info = {
  name: 'embed',
  hidden: 'true',
  description: 'Embeds some text.',
  usage: 'embed [text]'
};
