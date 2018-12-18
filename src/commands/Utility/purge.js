exports.run = async (bot, msg, args) => {
	try {
		switch (args.length) {
			case 0:
				return msg.channel.send(`<:redx:411978781226696705> Too few arguments given.`);
		}
		if (!parseFloat(args[0])) return msg.channel.send(`<:redx:411978781226696705> Invalid \`<amount>\` argument given.`);
		let user;
		if (args[1] && args[1] !== '-bots' && args[1] !== '-users') {
			user = bot.utils.getMembers(msg,args[1]);
			if (!user) return msg.channel.send(`<:redx:411978781226696705> I could not find that user.`);
			if (user.toString().includes("I could not find that user.")) return;
		}
		(await msg.channel.send({ embed: ({ title: `<a:loading:414954381176340480> Purging \`${(parseFloat(args[0].toString().replace(/^[-]/g,'')) > 100) ? 100 : parseFloat(args[0].toString().replace(/^[-]/g,''))}\` messages...` })}).then((msg) => {
			msg.channel.messages.fetch({ limit: (parseFloat(args[0].toString().replace(/^[-]/g,'')) > 100) ? 100 : parseFloat(args[0].toString().replace(/^[-]/g,'')) }).then((messages) => {
				let msg_to_delete = messages;
				if (args[1]) {
					if (args[1] === '-bots') {
						msg_to_delete = messages.filter(m => m.member.user.bot);
					} else if (args[1] === '-users') {
						msg_to_delete = messages.filter(m => !m.member.user.bot);
					} else {
						msg_to_delete = messages.filter(m => m.author.id == user.id);
					}
				}
				msg.channel.bulkDelete(msg_to_delete).then((messages) => {
					let desc = `.`;
					if (args[1]) {
						if (args[1] === '-bots') {
							desc = ` from bots.`;
						} else if (args[1] === '-users') {
							desc = ` from users.`;
						} else {
							desc = ` from <@${user.id}>.`;
						}
					}
					msg.channel.send({
						embed: ({
							title: `<:check:411976443522711552> Successfully purged \`${messages.size}\` messages${desc}`
						})
					});
				}).catch((err) => {
					console.error(err.toString());
					msg.channel.send({
						embed: ({
							title: `<:redx:411978781226696705> I am sorry, but I seem to have encountered an error while purging the messages. I may not have been able to successfully purge some of the messages.`
						})
					});
				});
			}).catch((err) => {
				console.error(err.toString());
				msg.channel.send({
					embed: ({
						title: `<:redx:411978781226696705> I am sorry, but I seem to have encountered an error and was not able to purge any of the messages. Feel free to retry the command.`
					})
				});
			});
		}).catch((err) => {
			console.error(err.toString());
			msg.channel.send({
				embed: ({
					title: `<:redx:411978781226696705> I am sorry, but I seem to have encountered an error and was not able to purge any of the messages. Feel free to retry the command.`
				})
			});
		}));
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'purge',
	userPermissions: ['MANAGE_MESSAGES'],
	clientPermissions: ['MANAGE_MESSAGES'],
	usage: 'purge <amount> [user | -bots | -users]',// | -links | -invites | -embeds | -images | -files]',
	examples: [
		'purge 10',
		'purge 10 -users',
		'purge 10 -bots',
		'purge 10 BannerBomb'
	],
	description: 'Deletes the number of messages you specified.'
};
