exports.run = async (bot, msg, args) => {
	try {
		if (args.length <= 0) return msg.channel.send(`<:redx:411978781226696705> You must include the number of messages to be purged!`).catch((err) => console.error);
		if (!parseInt(args[0])) return msg.channel.send(`<:redx:411978781226696705> Invalid argument given!`).catch((err) => console.error);
		/*const user = (msg.mentions.users.first() || bot.users.get(args[0]) || null);
		const amount = !!user ? parseInt(msg.content.split(" ")[2], 10) : parseInt(msg.content.split(" ")[1], 10);
		if (!amount) return msg.channel.send("Must specify an amount to delete!");
		if (!amount && !user) return msg.channel.send("Must specify a user and amount, or just an amount, of messages to purge!");
		await msg.delete();
		let messages = await msg.channel.fetchMessages({limit: 100});
		if(user) {
			messages = messages.array().filter(m=>m.author.id === user.id);
			bot.log("log", "Purge Amount", msg.author, "Amount: " + amount);
			messages.length = amount;
		} else {
			messages = messages.array();
			messages.length = amount + 1;
		}
		messages.map(async m => await m.delete().catch(console.error));
*/
		(await msg.channel.send({ embed: ({ title: `<a:loading:414954381176340480> Purging \`${parseInt(args[0].toString().replace(/^[-]/g,''))}\` messages...` })}).then((msg) => {
			msg.channel.bulkDelete(parseInt(args[0].toString().replace(/^[-]/g,''))).then(() => {
				msg.edit({
					embed: ({
						title: `<:check:411976443522711552> Successfully purged \`${parseInt(args[0].toString().replace(/^[-]/g,''))}\` messages.`
					})
				});
			}).catch((err) => {
				console.error(err.toString());
				msg.edit({
					embed: ({
						title: `<:redx:411978781226696705> I am sorry, but I seem to have encountered an error while purging the messages. I may not have been able to successfully purge some the messages.`
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
	usage: 'purge <amount>' // usage: 'purge <user>|<number of messages>'
	examples: [
		'purge 10'
	],
	description: 'Deletes the number of messages you specified.'
};
