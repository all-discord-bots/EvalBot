exports.run = async (bot, msg, args) => {
  if (args.length < 1) {
    return msg.channel.send("Invalid arguments! Please provide a role name.");
  }
  const rolename = args.join(" ");
  let getroleid = msg.guild.roles.find('name', `${args[0]}`).id;
  (await msg.channel.send("Loading role id...").then((msg)=>{
    msg.edit(`${getroleid}`);
  }));
};

exports.info = {
  name: 'role-id',
  aliases: 'roleid',
  usage: 'role-id <role name>',
  description: 'Lists all id of the role you specify'
};
