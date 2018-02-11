exports.run = async (bot, msg, args) => {
  if (msg.author.id !== bot.config.botCreatorID) {
    if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.channel.send("You are missing permission `Administrator`!");
  }
  if (args.length < 1) {
    return msg.channel.send("Invalid arguments!");
  }
  if (msg.guild.roles.find(`name`, `${args[0]}`)) {
    msg.guild.roles.find(`name`, `${args[0]}`).members.map(m => m.addRole(`name`, `${args[0]}`));
  } else if (msg.guild.roles.find(`id`, `${args[0]}`)) {
    msg.guild.roles.find(`id`, `${args[0]}`).members.map(m => m.addRole(`id`, `${args[0]}`));
  }
};
  
exports.info = {
  name: 'giveallrole',
  usage: 'giveallrole <name|id> <role name|role id>',
  description: 'Add a role to every member in your server'
};
