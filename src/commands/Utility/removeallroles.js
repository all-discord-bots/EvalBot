exports.run = async (bot, msg, args) => {
  if (msg.author.id !== bot.config.botCreatorID) {
    if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.channel.send("You are missing permission `Administrator`!");
  }
  if (args.length < 1) {
    return msg.channel.send("Invalid arguments!");
  }
  if (!args[1]) {
    return msg.channel.send("Invalid arguments!");
  }
  if (args[0] == "name") {
    msg.channel.guild.roles.find('name', args[1]).members.map(m => m.removeRole('name', args[1]));
  } else if (args[0] == "id") {
    msg.channel.guild.roles.find(args[1]).members.map(m => m.removeRole(args[1]));
  }
};
  
exports.info = {
  name: 'managerole',
  usage: 'managerole <name|id> <role name|role id>',
  description: 'Remove a role from every member in your server if they have it'
};
