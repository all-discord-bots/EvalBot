const sneckfetch = require('sneckfetch');
exports.run = async (bot, msg) => {
  snekfetch.post(`https://discordbots.org/api/bots/398690824721924107/stats`)
};

exports.info = {
  name: 'terminalstats',
  aliases: ['tstats'],
  hidden: true,
  description: 'Shows the bot\'s stats on terminal.ink'
};
