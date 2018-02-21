const Discord = require('discord.js');

exports.run = (bot, msg, args) => {
  let reason = args.slice(1).join(' ');
  let member = msg.mentions.members.first();
  let modlog = msg.guild.channels.find('name', 'mod_logs');
  let muteRole = msg.guild.roles.find('name', 'Muted');
  let gbot = msg.guild.members.get(bot.user.id);
  if (!gbot.hasPermission(0x00000002)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Kick Members\`!`).catch(console.error);
  if (!gbot.hasPermission(0x10000000)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Manage Roles\`!`).catch(console.error);
  if (msg.author.id !== bot.config.botCreatorID) {
    if (!msg.member.hasPermission('KICK_MEMBERS')) {
      return msg.channel.send(`<:redx:411978781226696705> You are missing the permissions \`Kick Members\`!`).catch(console.error);
    } else if (msg.member.hasPermission('MANAGE_ROLES')) {
      return msg.channel.send(`<:redx:411978781226696705> You are missing the permissions \`Manage Roles\`!`).catch(console.error);
    }
     if(!msg.guild.member(member).kickable) return msg.channel.send(`<:redx:411978781226696705> I may need my role moved higher!`).catch(console.error);
  }
  //if (!modlog) return msg.channel.send('Please create a channel named `mod_logs` first!').catch(console.error);
  if (!muteRole) return msg.channel.send('Please create a role named `Muted` first!').catch(console.error);
  if (reason.length < 1) return msg.channel.send('You must supply a reason for the mute.').catch(console.error);
  if (msg.mentions.users.size < 1) return msg.channel.send('You must mention someone to mute them.').catch(console.error);
  const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .setDescription(`**Action:** Un/mute\n**Target:** ${member.user.tag}\n**Moderator:** ${msg.author.tag}\n**Reason:** ${reason}`);

  if (member.roles.has(muteRole.id)) {
    member.removeRole(muteRole).then(() => {
      if (bot.channels.get(modlog.id)) {
        bot.channels.get(modlog.id).send({embed}).catch(console.error);
      }
    })
    .catch(e=>console.error("Cannot remove muted role: " + e));
  } else {
    member.addRole(muteRole).then(() => {
      if (bot.channels.get(modlog.id)) {
        bot.channels.get(modlog.id).send({embed}).catch(console.error);
      }
    })
    .catch(e=>console.error("Cannot add muted role: " + e));
  }

};

exports.info = {
  name: 'mute',
  aliases: ['unmute'],
  description: 'mutes or unmutes a mentioned user. If you would like to let the bot keep logs of moderations create a text channel named `mod_logs`',
  usage: 'mute <mention> [reason]'
};
