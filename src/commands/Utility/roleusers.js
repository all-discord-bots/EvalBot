exports.run = async (bot, msg, args) => {
  if (args.length < 1) {
    return msg.channel.send("Invalid arguments! Please provide a role ID.");
  }
  msg.channel.send(`\`\`\`\n${msg.channel.guild.roles.find(args[0].value).members.map(m => m.user.tag)}\n\`\`\``);
};

exports.info = {
  name: 'roleusers',
  usage: 'roleusers <role id>',
  description: 'Lists all the usernames who have a given role'
};
