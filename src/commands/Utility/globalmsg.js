exports.run = async (bot, msg, args) => {
  if (args.length < 1) return msg.channel.send("Invalid arguments!");
  if (msg.author.id !== bot.config.botCreatorID) return;
  let getMessageToSend = args.join(" ");
  var guildList = bot.guilds.array();
  try {
    guildList.forEach(guild => guild.defaultChannel.send(`${getMessageToSend}`));
  } catch (err) {
    console.log("Could not send message to " + guild.name);
  }
};

exports.info = {
  name: 'globalmsg',
  aliases: ['globalmessage'],
  usage: 'globalmsg <message>',
  description: 'Sends a global message to every guild the bot is in to the guilds default channel'
};
