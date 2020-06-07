exports.run = async (bot, msg, args) => {
	/*
		${((require('util').inspect(require('os').freemem())) / 1024 / 1024 / 1024).toLocaleString()} GB
		${((require('util').inspect(require('os').totalmem())) / 1024 / 1024 / 1024).toLocaleString()} GB
		${require("util").inspect(require('os').uptime())}
	*/
  msg.channel.send(`**Statistics**
\`\`\`
STATISTICS
• Web Memory   : ${process.env.WEB_MEMORY} MB
• Web Mem Ava. : ${process.env.MEMORY_AVAILABLE} MB
• Free Memory  : ${((require('os').freemem()) / 1024 / 1024 / 1024).toLocaleString()} GB
• Total Memory : ${((require('os').totalmem()) / 1024 / 1024 / 1024).toLocaleString()} GB
• Mem Usage    : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Swap Size    : ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB
• Bot Uptime   : ${bot.uptime}
• OS Uptime    : ${require('os').uptime()}
• Load Average : ${Math.floor(require('os').loadavg()[0])}s
• Users        : ${bot.users.size}
• Servers      : ${bot.guilds.size}
• Channels     : ${bot.channels.size}
• Total Shards : ${bot.shard ? bot.shard.count || 0 : 0}

VERSION INFO
• Discord.js   : v${require('discord.js').version}
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

CPU
• Model        : ${require('os').cpus()[0].model}
• Speed        : ${require('os').cpus()[0].speed}

DEBUG INFO
• Listeners    : ${bot._eventsCount}/${bot.getMaxListeners()}
\`\`\``);
};

exports.info = {
	name: 'stats',
	hidden: true,
	aliases: ['specs'],
	usage: 'stats',
	examples: [
		'stats'
	],
	description: 'Provides some information about this bot.'
};
