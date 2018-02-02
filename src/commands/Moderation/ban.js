exports.run = (bot, msg, args) => {
if (msg.author.id !== bot.config.botCreatorID) {
  if(!msg.member.hasPermission('BAN_MEMBERS')) {
    return msg.channel.send('You are missing permissions `Ban Members`');
  }
}
  let ban_id = args[0];
  let days = args[1];
  msg.guild.ban(ban_id, days)
    .then( () => console.log(`Banned ${ban_id} and removed ${days} days of messages`))
    .catch(console.error);
};

exports.info = {
  name: 'ban',
  description: 'Bans the mentioned user.',
  usage: 'ban <mention>'
};
