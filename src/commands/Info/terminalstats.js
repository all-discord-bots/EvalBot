const sneckfetch = require('snekfetch');
exports.run = async (bot, msg) => {
  if (msg.author.id !== bot.config.botCreatorID) return;
  //snekfetch.get(`https://discordbots.org/api/bots/${bot.id}/stats`)
  //.
};

exports.info = {
  name: 'terminalstats',
  aliases: ['tstats'],
  hidden: true,
  ownerOnly: true,
  description: 'Shows the bot\'s stats on terminal.ink'
};
