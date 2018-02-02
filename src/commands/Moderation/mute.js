const Discord = require('discord.js');

exports.run = (bot, msg, args) => {
  if (msg.author.id !== bot.config.botCreatorID) {
    if (!msg.member.hasPermission('KICK_MEMBERS')) {
      return msg.channel.send('You must have the `Kick Members` permission!');
    }
  }
  let reason = args.slice(1).join(' ');
  let member = msg.mentions.members.first();
  let modlog = msg.guild.channels.find('name', 'mod-log');
  let muteRole = msg.guild.roles.find('name', 'Muted');
  if (!modlog) return msg.channel.send('Please create a channel named `mod-log` first!').catch(console.error);
  if (!muteRole) return msg.channel.send('Please create a role named `Muted` first!').catch(console.error);
  if (reason.length < 1) return msg.channel.send('You must supply a reason for the mute.').catch(console.error);
  if (msg.mentions.users.size < 1) return msg.channel.send('You must mention someone to mute them.').catch(console.error);
  const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .setDescription(`**Action:** Un/mute\n**Target:** ${member.user.tag}\n**Moderator:** ${msg.author.tag}\n**Reason:** ${reason}`);

  if (!msg.member.hasPermission('MANAGE_ROLES')) return msg.channel.send('I must have `Manage Roles` permission.').catch(console.error);

  if (member.roles.has(muteRole.id)) {
    member.removeRole(muteRole).then(() => {
      bot.channels.get(modlog.id).send({embed}).catch(console.error);
    })
    .catch(e=>console.error("Cannot remove muted role: " + e));
  } else {
    member.addRole(muteRole).then(() => {
      bot.channels.get(modlog.id).send({embed}).catch(console.error);
    })
    .catch(e=>console.error("Cannot add muted role: " + e));
  }

};

exports.info = {
  name: 'mute',
  aliases: ['unmute'],
  description: 'mutes or unmutes a mentioned user',
  usage: 'mute <mention> [reason]'
};
