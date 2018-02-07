exports.run = async (bot, msg, args) => {
  if (args.length < 1) {
    return msg.channel.send("Invalid arguments! Please provide a role name.");
  }
  const rolename = args.join(" ");
  let getroleid = msg.channel.guild.roles.find('name', `${rolename}`).id;
  msg.channel.send(`${getroleid}`);
};

exports.info = {
  name: 'role-id',
  aliases: 'roleid',
  usage: 'role-id <role name>',
  description: 'Lists all id of the role you specify'
};
