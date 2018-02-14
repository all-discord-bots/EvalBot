exports.run = async (bot, msg) => {
        msg.channel.send({
        embed: bot.utils.embed(`${bot.user.username} Invite`, '***Invite***', [
            {
                name: '**Bot Invite**:',
                value: `https://discordapp.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=8&scope=bot`,
            }, {
                name: '**Support Server**:',
                value: 'https://discord.gg/AY6z42D',
            }
        ], { inline: true })
    });
};

exports.info = {
    name: 'invite',
    aliases: 'support',
    usage: 'invite',
    description: 'Gives you a invite link for the bot'
};
