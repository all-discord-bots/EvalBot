exports.run = async (bot, msg, args) => {
	try {
		msg.channel.send({embed: ({
			title: `Debug Information:`,
			fields: [
				{
					name: `**__Listeners:__**`,
					value: `\`${bot.actions.client._eventsCount}\`/\`${bot.getMaxListeners()}\``
				}
			],
			timestamp: new Date()
		})});
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'debuginfo',
	ownerOnly: true,
	hidden: true,
	aliases: ['debuginformation'],
	usage: 'debuginfo',
	examples: [
		'debuginfo'
	],
	description: 'Shows debug information of the bot.'
};
