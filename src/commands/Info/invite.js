exports.run = async (bot, msg) => {
	msg.channel.send({
		embed: bot.utils.embed(`${bot.user.username} Invite`, '***Invite***', [
			{
				name: '**Bot Invite**:',
				value: `[Invite](https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&permissions=271969526&scope=bot)`,
			}, {
				name: '**Support Server**:',
				value: `[Join](https://discord.gg/AY6z42D)`,
			}, {
				name: '**Upvote Bot**:',
				value: `[Upvote](https://discordbots.org/bot/${bot.user.id}/vote)`,
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
