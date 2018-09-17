exports.run = (bot, msg, args) => {
  if (msg.author.id !== bot.config.botCreatorID) return;
  const members = msg.guild.members.filter(member => member.user.presence.game && /(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i.test(member.user.presence.game.name));
  return msg.channel.send(members.map(member => `\`${member.id}\` ${member.displayName}`).join("\n") || "Nobody has an invite link as game name.");
};

exports.info = {
  ownerOnly: true,
  name: 'checkinvites',
  hidden: true,
  aliases: ['ci'],
  description: 'Returns a list of members with an invite as their game.',
  usage: 'checkinvites'
};
