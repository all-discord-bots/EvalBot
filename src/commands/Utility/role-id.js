exports.run = async (bot, msg, args) => {
  if (args.length < 1) {
    return msg.channel.send("Invalid arguments! Please provide a role name.");
  }
  const rolename = args.join(" ");
  let getroleid;
  if (msg.guild.roles.find(`name`, `${rolename}`)) {
    getroleid = msg.guild.roles.find(`name`, `${rolename}`).id;
  } else {
    return msg.channel.send(`<:redx:411978781226696705> No roles with the name ${rolename} exists!`).catch(cosole.error);
  }
  msg.channel.send(`${getroleid}`);
};

exports.info = {
  name: 'role-id',
  aliases: ['roleid'],
  usage: 'role-id <role>',
  description: 'Easy and simple way to get the ID of any role. CASE SENSITIVE role name.'
};
