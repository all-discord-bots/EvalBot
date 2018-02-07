exports.run = async (bot, msg, args) => {
  if (args.length < 1) {
    return msg.channel.send("Invalid arguments! Please provide a role name.");
  }
  const rolename = args.join(" ");
  let getroleid = msg.guild.roles.find('name', `${rolename}`).id;
  if (getroleid === null) return msg.channel.send("Role not found!");
  msg.channel.send(`${getroleid}`);
};

exports.info = {
  name: 'role-id',
  aliases: ['roleid'],
  usage: 'role-id <role>',
  description: 'Easy and simple way to get the ID of any role.'
};
