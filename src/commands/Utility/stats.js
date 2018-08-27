const Discord = require('discord.js');

exports.run = async (bot, msg, args) => {
  msg.channel.send(`**Statistics**
\`\`\`
STATISTICS
• Web Memory   : ${process.env.WEB_MEMORY}
• Memory Ava.  : ${process.env.MEMORY_AVAILABLE}
• Mem Usage    : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Swap Size    : ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB
• Uptime       : ${bot.uptime}
• Users        : ${bot.users.size}
• Servers      : ${bot.guilds.size}
• Channels     : ${bot.channels.size}

VERSION INFO
• Discord.js   : v${Discord.version}
• Node         : v${process.versions.node}
• HTTP Parser  : v${process.versions.http_parser}
• v8           : v${process.versions.v8}
• uv           : v${process.versions.uv}
• zlib         : v${process.versions.zlib}
• ares         : v${process.versions.ares}
• modules      : v${process.versions.modules}
• nghttp2      : v${process.versions.nghttp2}
• napi         : v${process.versions.napi}
• openssl      : v${process.versions.openssl}
• icu          : v${process.versions.icu}
• unicode      : v${process.versions.unicode}
• cldr         : v${process.versions.cldr}
• tz           : v${process.versions.tz}

OPERATING SYSTEM
• Platform     : ${process.platform}
• Arch         : ${process.arch}

DEBUG INFO
• Listeners    : ${bot.actions.client._eventsCount}/${bot.actions.client._maxListeners}
\`\`\``);
};

exports.info = {
	name: 'stats',
	hidden: true,
	usage: 'stats',
	examples: [
		'stats'
	],
	description: 'Provides some information about this bot.'
};
