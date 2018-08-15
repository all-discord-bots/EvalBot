const { MessageAttachment } = require('discord.js');
const Pornsearch = require('pornsearch');

exports.run = async (bot, msg, args) => {
	if (!msg.channel.nsfw) return msg.channel.send(`<:redx:411978781226696705> This channel has not been marked as NSFW!`).catch(console.error);
	if (args.length < 1) return msg.channel.send(`<:redx:411978781226696705> Please provide a search string!`).catch(console.error);
	let gbot = msg.guild.members.get(bot.user.id);
	if (!gbot.hasPermission(0x00008000)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Attach Files\`!`).catch(console.error);
	if (!msg.member.hasPermission('ATTACH_FILES')) return msg.channel.send(`<:redx:411978781226696705> You are missing the permissions \`Attach Files\`!`).catch(console.error);
	let searchqueue = args.join(' ');
	const Searcher = new Pornsearch(searchqueue.toString());
	let randomnum = Math.floor(Math.random() * 2);
	if (randomnum <= 0)
	{
		Searcher.videos().then(result => {
			const attachment = new MessageAttachment(`${result[0].url}`);
			msg.channel.send(`Title: __**${result[0].title}**__\r\nDuration: **${result[0].duration}**`,attachment);
		}).catch(err => {
			return msg.channel.send(`<:redx:411978781226696705> ${err}`);
		});
	}
	else if (randomnum >= 1)
	{
		Searcher.gifs().then(result => {
			const attachment = new MessageAttachment(`${result[0].url}`);
			msg.channel.send(`Title: __**${result[0].title}**__\r\nDuration: **${result[0].duration}**`,attachment);
		}).catch(err => {
			return msg.channel.send(`<:redx:411978781226696705> ${err.toString()}`);
		});
	}
};
	
exports.info = {
	name: 'pornsearch',
	aliases: ['p0rnsearch','cornsearch','pronsearch','c0rnsearch','pr0nsearch'],
	usage: 'pornsearch <search>',
	description: 'Sends a porn video/gif.'
};
