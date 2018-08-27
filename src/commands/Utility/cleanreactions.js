exports.run = async (bot, msg, args) => {
	try {
		if (args.length <= 0) return msg.channel.send(`<:redx:411978781226696705> You must specify the number of messages to clean reactions for.`);
		if (!parseFloat(args[0]) || !parseFloat(parseFloat(args[0].toString().replace(/^[-]/g,'')), 10)) return msg.channel.send(`<:redx:411978781226696705> Please provide a number of messages to clean reactions for.`);
		msg.channel.fetchMessages({ limit: parseFloat(parseFloat(args[0].toString().replace(/^[-]/g,'')), 10) }).then(async(msglog) => {
			(await msg.channel.send({ embed: ({ title: `<a:loading:414954381176340480> Clearing reactions for \`${parseFloat(args[0].toString().replace(/^[-]/g,''))}\` messages in this channel...` })}).then((msg) => {
				let total = 0;
				let current = 0;
				msglog.forEach((message) => {
					message.clearReactions().then(() => {
						++current;
						if (current >= total) {
							return msg.edit({
								embed: ({
									title: `<:check:411976443522711552> Successfully cleared \`${total}\` messages of reactions.`
								})
							});
						}
					}).catch((err) => {
						console.error(err.toString());
						return msg.edit({
							embed: ({
								title: `<:redx:411978781226696705> I am sorry, but I seem to have encountered an error. I was only able to successfully clean \`${total}\` messages of their reactions.`
							})
						});
					});
					++total;
				});
			}).catch((err) => {
				console.error(err.toString());
				return msg.channel.send({
					embed: ({
						title: `<:redx:411978781226696705> I am sorry, but I seem to have encountered an error. I wasn't able to clean any of the messages of their reactions. Feel free to retry the command.`
					})
				});
			}));
		}).catch((err) => {
			console.error(err.toString());
			return msg.channel.send({
				embed: ({
					title: `<:redx:411978781226696705> I am sorry, but I seem to have encountered an error. I wasn't able to clean any of the messages of their reactions. Feel free to retry the command.`
				})
			});
		});
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'clearreactions',
	userPermissions: ['MANAGE_MESSAGES','MANAGE_GUILD'],
	clientPermissions: ['MANAGE_MESSAGES'],
	hidden: true,
	aliases: ['cr','cleanreactions'],
	usage: 'clearreactions <amount>',
	examples: [
		'clearreactions 5',
	],
	description: 'Clears all reactions from a given number of messages.'
};
