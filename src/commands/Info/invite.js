exports.run = async (bot, msg) => {
    (await msg.channel.send("Loading bot invitation link...").then((msg)=>{
        msg.edit({
        embed: bot.utils.embed(`${bot.config.botName} Invite`, '***Invite***', [
            {
                name: '**Invite Link**:',
                value: 'https://discordapp.com/api/oauth2/authorize?client_id=318570329733595136&permissions=8&scope=bot',
            }
        ], { inline: false })
    });
  }));
};

exports.info = {
    name: 'invite',
    usage: 'invite',
    description: 'Gives you a invite link for the bot'
};
