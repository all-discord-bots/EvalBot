exports.run = async (bot, msg, args) => {
  if (msg.author.id !== bot.config.botCreatorID) {
    if (!msg.member.hasPermission('MANAGE_MESSAGES')) {
      return msg.channel.send('You must have the permission `Manage Messages`!');
    }
  }
  const user = (msg.mentions.users.first() || bot.users.get(args[0]) || null);
  const amount = !!user ? parseInt(msg.content.split(" ")[2], 10) : parseInt(msg.content.split(" ")[1], 10);
  if (!amount) return msg.channel.send("Must specify an amount to delete!");
  if (!amount && !user) return msg.channel.send("Must specify a user and amount, or just an amount, of messages to purge!");
  await msg.delete();
  let messages = await msg.channel.fetchMessages({limit: 100});
  if(user) {
    messages = messages.array().filter(m=>m.author.id === user.id);
    bot.log("log", "Purge Amount", msg.author, "Amount: " + amount);
    messages.length = amount;
  } else {
    messages = messages.array();
    messages.length = amount + 1;
  }
  messages.map(async m => await m.delete().catch(console.error));
};

exports.info = {
  name: 'purge',
  description: 'Deletes messages from anyone in the channel',
  usage: 'purge <user>|<number of messages>'
};
