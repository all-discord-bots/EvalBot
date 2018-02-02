exports.run = async (bot, msg) => {
  const voiceChannel = msg.channel.voiceChannel;
  if (!voiceChannel) {
    return msg.reply(':redx: You must be in a voice channel for the bot to join!');
  }
  if (msg.author.id !== bot.config.botCreatorID) {
    if (!msg.member.hasPermission("MANAGE_GUILD")) {
      msg.channel.send("You need `Manage Server` permission to use this command!");
      return;
    }
  }
  msg.channel.sendMessage("Voice channel successfully joined!");
  msg.member.voiceChannel.join().then(connection => {
    require('http').get("http://www.internet-radio.com/servers/tools/playlistgenerator/?u=http://www.partyviberradio.com:8016/listen.pls?sid=1&t=.m3u", (res) => {
      connection.playStream(res);
    });
  });
  .catch(console.error);
  return;
}

exports.info = {
  name: 'join',
  usage: 'join',
  description: 'Joins the voice channel you are currently in'
};
