exports.run = (bot, msg, args) => {
	try {
		if (args.length <= 0) return msg.channel.send(`<:redx:411978781226696705> You must specify the number of messages to clean reactions for.`).catch((err) => console.error);
		if (!parseInt(parseInt(args[0].toString().replace(/^[-]/g,'')), 10)) return msg.channel.send(`<:redx:411978781226696705> Please provide a number of messages to clean reactions for.`).catch((err) => console.error);
		(await msg.channel.send({ embed: ({ title: `<a:loading:414954381176340480> Clearing reactions for \`${parseInt(args[0].toString().replace(/^[-]/g,''))}\` messages in this channel...` })}).then((msg) => {
			msg.channel.fetchMessages({limit: parseInt(parseInt(args[0].toString().replace(/^[-]/g,''), 10)}).then((msglog) => {
				let count = 0;
				msglog.forEach((message) => {
					message.clearReactions();
					count++;
				}).then(() => {
					msg.edit({
						embed: ({
							title: `<:check:411976443522711552> Successfully cleared \`${count}\` messages of reactions.`
						})
					});
				}).catch((err) => {
					console.error(err.toString());
					msg.edit({
						embed: ({
							title: `<:redx:411978781226696705> I am sorry but I seem to have encountered an error. I was only able to successfully clean \`${count}\` messages of their reactions.`
						})
					});
				});
			}));
		}).catch((err) => {
			console.error(err.toString());
			msg.channel.send({
				embed: ({
					title: `<:redx:411978781226696705> I am sorry but I seem to have encountered an error. I wasn't able to clean any of the messages of their reactions. Feel free to retry the command.`
				})
			});
		});
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'clearreactions',
	userPermissions: ['MANAGE_MESSAGES'],
	clientPermissions: ['MANAGE_MESSAGES'],
	hidden: true,
	aliases: ['cr'],
	usage: 'clearreactions <message count>',
	examples: [
		'clearreactions 5'
	],
	description: 'Clears all reactions from given number of messages.'
};
