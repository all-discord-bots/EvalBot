exports.run = async (bot, msg, args) => {
  if (args.length < 1) return msg.channel.send(`<:redx:411978781226696705> Invalid arguments provided!`);
  if (msg.author.id !== bot.config.botCreatorID) return;
  let getMessageToSend = args.join(" ");
  var guildList = bot.guilds.array();
  try {
    guildList.forEach(guild => guild.defaultChannel.send(`${getMessageToSend}`));
  } catch (err) {
    guildList.forEach(guild => console.log(`✅ Could not send message to ${guild.name}`));
  }
};

exports.info = {
  name: 'globalmsg',
  aliases: ['globalmessage','globalmsg','msgglobal','messageglobal'],
  usage: 'globalmsg <message>',
  description: 'Sends a global message to every guild the bot is in to the guilds default channel'
};
