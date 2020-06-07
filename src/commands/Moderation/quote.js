exports.run = async (bot, msg, args) => {
	let channel = msg.channel;

	if (args.length < 1) return msg.channel.send(`<:redx:411978781226696705> You must provide a message ID`);

	if (!/^\d{18}$/.test(args[0])) return msg.channel.send(`<:redx:411978781226696705> You must provide a valid message ID.`);

	if (args[1] && /^<#\d{18}>$|^\d{18}$/.test(args[1])) {
		channel = bot.channels.get(args[1].replace(/[<#>]/g, ''));
	}

	if (!channel) return msg.channel.send(`<:redx:411978781226696705> That channel could not be found!`);

	const messages = await channel.fetchMessages({ around: args[0], limit: 1 });

	if (!messages || messages.size < 1) return msg.channel.send(`<:redx:411978781226696705> That message could not be found!`);

	let message = messages.first();

	let options = {
		timestamp: message.editedTimestamp || message.createdTimestamp,
		footer: false
	};

	let attachment = message.attachments.first();

	if (attachment && (attachment.width || attachment.height)) {
		options.image = attachment.url;
	}

	let field = '';

	if ((msg.guild || {}).id !== (channel.guild || {}).id) {
		field = `**in ${(channel.guild || { name: 'DMs' }).name} <#${channel.id}>:**`;
	} else if (channel.id !== msg.channel.id) {
		field = `**in <#${channel.id}>:**`;
	}

	msg.delete();
	msg.channel.send({
		embed: bot.utils.embed('', field + '\n\n' + message.toString(), [], options)
			.setAuthor(message.author.username, message.author.displayAvatarURL())
	});
};

exports.info = {
	ownerOnly: true,
	hidden: true,
	name: 'quote',
	usage: 'quote <id> [#channel | channel ID]',
	examples: [
		'quote 32423525252353 #general'
	],
	description: 'Quotes the message with the given ID and channel ID.'
};
