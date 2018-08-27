const got = require('got');
const cheerio = require('cheerio');

exports.run = async (bot, msg, args) => {
	if (args.length <= 0) return msg.channel.send(`<:redx:411978781226696705> You must provide a minecraft username.`);

	const username = args.join(' ');

	const uuid = await getUUID(username);
	if (!uuid) return msg.channel.send(`<:redx:411978781226696705> I was unable to find that user.`);

	//msg.delete();
	return msg.channel.send({
		embed: ({
			image: {
				url: `https://crafatar.com/skins/${uuid}.png`
			},
			thumbnail: `https://crafatar.com/avatars/${uuid}.png?size=250&overlay=true`,
			timestamp: new Date(),
			fields: [
				{
					name: `Username`,
					value: username,
				},{
					name: `UUID`,
					value: `\`${uuid}\``
				},{
					name: `Skin`,
					value: `​`
				}
			]
		})
	});
/*		embed: bot.utils.embed('', '', [
			{
				name: 'Username',
				value: username
			},
			{
				name: 'UUID',
				value: `\`${uuid}\``
			},
			{
				name: 'Skin',
				value: `[Download](https://crafatar.com/skins/${uuid}.png)`
			}
		], { thumbnail: `https://crafatar.com/avatars/${uuid}.png?size=250&overlay=true` })
	});*/
};

async function getUUID(username) {
	const res = await got(`https://mcuuid.net/?q=${username}`);
	const $ = cheerio.load(res.body);
	const input = $('input')[1];

	if (!input) return;

	return input.attribs['value'];
}

exports.info = {
	name: 'minecraft-user',
	aliases: ['mcuser','minecraftuser','mc-user'],
	usage: 'minecraft-user <username>',
	examples: [
		'minecraft-user BannerBomb'
	],
	description: 'Shows information about a Minecraft player.'
};
