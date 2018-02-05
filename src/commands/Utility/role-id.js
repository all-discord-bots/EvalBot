exports.run = async (bot, msg, args) => {
  if (args.length < 1) {
    return msg.channel.send("Invalid arguments! Please provide a role name.");
  }
  let rolename = args.join(" ");
  msg.channel.send(`\`\`\`\n${msg.channel.guild.roles.find('name', rolename).id}\n\`\`\``);
};

exports.info = {
  name: 'role-id',
  aliases: 'roleid',
  usage: 'role-id <role name>',
  description: 'Lists all id of the role you specify'
};
