const Discord = require('discord.js');

exports.run = async (bot, msg) => {
  msg.channel.send(`**Statistics**
\`\`\`
STATISTICS
• Mem Usage    : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Swap Size    : ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB
• Uptime       : ${bot.uptime}
• Users        : ${bot.users.size}
• Servers      : ${bot.guilds.size}
• Channels     : ${bot.channels.size}
• Discord.js   : v${Discord.version}
\`\`\``);
};

exports.info = {
  name: 'stats',
  hidden: true,
  usage: 'stats',
  description: 'Provides some information about this bot.',
};
