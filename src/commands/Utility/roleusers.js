exports.run = async (bot, msg, args) => {
  if (args.length < 1) {
    return msg.channel.send("Invalid arguments! Please provide a role ID.");
  }
  if (args[0].toLowerCase() == "users") {
    msg.channel.send(`\`\`\`\n${msg.channel.guild.roles.find('id', `${args[1]}`).members.map(m => m.user.tag)}\n\`\`\``);
  } else if (args[0].toLowerCase() == "size") {
    msg.channel.send(`\`\`\`\n${msg.channel.guild.roles.find('id', `${args[1]}`).members.size}\n\`\`\``);
    //msg.channel.send(`\`\`\`\n${msg.channel.guild.roles.find(args[0].value).members.map(m => m.user.tag)}\n\`\`\``);
  } else if (args[0].toLowerCase != "size" || args[0].toLowerCase != "users") {
    msg.channel.send(`\`\`\`\n${msg.channel.guild.roles.find('id', `${args[1]}`).members.size}\n\`\`\``);
  }
};

exports.info = {
  name: 'roleusers',
  usage: 'roleusers [users|size] <role id>',
  description: 'Lists all the usernames who have a given role'
};
