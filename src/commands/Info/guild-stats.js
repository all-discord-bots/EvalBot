exports.run = async (bot, msg) => {
  var lessthanten = 0,tenplus = 0,onehundredplus = 0,fivehundredplus = 0,onethousandplus = 0,fivethousandplus = 0;
  let getguildsize = bot.guilds.map(m => m.memberCount);
  getguildsize.filter(m => m < 10).forEach(m => lessthanten++); // < 10
  getguildsize.filter(m => m >= 10 && m < 100).forEach(m => tenplus++); // 10-99
  getguildsize.filter(m => m >= 100 && m < 500).forEach(m => onehundredplus++); // 100-499
  getguildsize.filter(m => m >= 500 && m < 1000).forEach(m => fivehundredplus++); // 500-999
  getguildsize.filter(m => m >= 1000 && m < 5000).forEach(m => onethousandplus++); // 1000-4999
  getguildsize.filter(m => m >= 5000).forEach(m => fivethousandplus++); // 5000+
  msg.channel.send(`\`\`\`css
Nano Servers    [ <10  ]:  ${lessthanten}
Tiny Servers    [ 10+  ]:  ${tenplus}
Small Servers   [ 100+ ]:  ${onehundredplus}
Medium Servers  [ 500+ ]:  ${fivehundredplus}
Large Servers   [ 1000+]:  ${onethousandplus}
Massive Servers [ 5000+]:  ${fivethousandplus}
\`\`\``);
};

exports.info = {
  name: 'guild-stats',
  hidden: true,
  aliases: 'guildstats',
  usage: 'guild-stats',
  description: 'Displays a list of guilds by number of members in each guild.'
};
