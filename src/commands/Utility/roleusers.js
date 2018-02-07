exports.run = async (bot, msg, args) => {
  if (args.length < 1) {
    return msg.channel.send("Invalid arguments! Please provide a role ID.");
  }
  if (args[1].toLowerCase() == "-users") {
    msg.channel.send(`\`\`\`\n${msg.channel.guild.roles.find('id', `${args[0]}`).members.map(m => m.user.tag)}\n\`\`\``);
  } else if (args[1].toLowerCase() == "-count") {
    msg.channel.send(`\`\`\`\n${msg.channel.guild.roles.find('id', `${args[0]}`).members.size}\n\`\`\``);
    //msg.channel.send(`\`\`\`\n${msg.channel.guild.roles.find(args[0].value).members.map(m => m.user.tag)}\n\`\`\``);
  } else {
    msg.channel.send(`\`\`\`\n${msg.channel.guild.roles.find('id', `${args[0]}`).members.size}\n\`\`\``);
  }
};

exports.info = {
  name: 'roleusers',
  usage: 'roleusers <role id> [-users|-count]',
  description: 'Lists all the usernames who have a given role'
};
