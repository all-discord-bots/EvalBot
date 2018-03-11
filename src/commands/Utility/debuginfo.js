exports.run = async (bot, msg) => {
	if (msg.author.id !== bot.config.botCreatorID) return;
	msg.channel.send({embed: ({
		title: `Debug Information:`,
		"fields": [
			{
				name: `**__Listeners:__**`,
				value: `${bot.actions._eventsCount}/${bot.actions._maxListeners}`
			}
		],
		timestamp: new Date()
	})});
};

exports.info = {
	name: 'debuginfo',
	aliases: ['debuginformation'],
	usage: 'debuginfo',
	description: 'Shows debug information of the bot.'
};
