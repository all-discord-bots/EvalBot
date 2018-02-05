exports.run = async (bot, msg, args) => {
  if (msg.author.id !== bot.config.botCreatorID) {
    if (!msg.member.hasPermission('ADMINISTRATOR')) return;
  }
  
  if (args[0].toLowerCase() == "enable") {
    msg.guild.createRole({ name: bot.config.botCommanderRole, permissions: 0 });
    msg.channel.send(`Successfully created \`${bot.config.botCommanderRole}\` role!`);
  } else if (args[0].toLowerCase() == "disable") {
    msg.guild.roles.find("name", bot.config.botCommanderRole).delete();
    msg.channel.send(`Successfully deleted \`${bot.config.botCommanderRole}\` role!`);
  } else {
    return msg.channel.send("Invalid argument provided, please specify `enable` or `disable`!");
  }
};

exports.info = {
  name: 'bot-commander',
  aliases: ['bot-commander-role','commander-role','botcommander'],
  usage: 'bot-commander <enable | disable>',
  description: 'Enable a role to use commands that need require higher permissions, without having those permissions (e.g. Manage Server). Moderation commands are excluded from this.'
};
