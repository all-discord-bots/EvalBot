const DBL = require("dblapi.js");
const betterpb = require("better-pastebin");

exports.run = async (bot, msg, args) => {
	const dbl = new DBL(process.env.DB_TOKEN, bot);
	if (msg.guild.id !== bot.config.botMainServerID) return msg.channel.send(`<:redx:411978781226696705> This command may only be used on the support server!`);
	let gbot = msg.guild.members.get(bot.user.id);
	if (!gbot.hasPermission(0x10000000)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Manage Roles\`!`).catch(console.error);
	let guser = msg.guild.members.find(`id`, `${msg.author.id}`);
	let whitelistedRole = msg.guild.roles.find('id', '433745475930292235');
	(await msg.channel.send({ embed: ({ author: { name: 'Validating request...', icon_url: 'http://4.bp.blogspot.com/-JF6M1HaI9rQ/VD_eCkLpG7I/AAAAAAAAAXk/0f1ym7hBXYs/s1600/Loading-Circle.gif', } }) }).then((msg) => {
		if (dbl.hasVoted(msg.author.id) && !msg.member.roles.has(whitelistedRole.id)) { // user has already upvoted
			// ({original: true})
			// send pastebin here
			guser.addRole(whitelistedRole).then(() => {
				msg.edit({
					embed: ({
						color: 6732394,
						title: `Successfully whitelisted user ${msg.author.tag}!`,
						timestamp: new Date(),
						description: `<:check:411976443522711552> ${msg.author.tag} has been successfully whitelisted. You now have full access to CripsSploit <:dancingblob:413502883900686348>.\nHead to <#430696088077598722> if you need to download CripsSploit.\nPlease check your DM's for your whitelist information.`
					})
				});
				msg.author.send({
					embed: ({
						color: 6732394,
						title: `Your Whitelist Information`,
						timestamp: new Date(),
						description: `HWID: \`${args[0]}\``
					})
				});
				/*
					let id = machineIdSync()
					// id = c24b0fe51856497eebb6a2bfcd120247aac0d6334d670bb92e09a00ce8169365
					let id = machineIdSync({original: true})
					// id = 98912984-c4e9-5ceb-8000-03882a0485e4
				*/
			});
		} else if (!dbl.hasVoted(msg.author.id) && !msg.member.roles.has(whitelistedRole.id)) { // user has not upvoted yet
			msg.edit({
				embed: ({
					color: 15684432,
					title: `Error whitelisting user, ${msg.author.tag}!`,
					timestamp: new Date(),
					description: `<:redx:411978781226696705> You must upvote my discord bot [here](https://discordbots.org/bot/${bot.user.id}) first!`
				})
			});
		} else if (dbl.hasVoted(msg.author.id) && msg.member.roles.has(whitelistedRole.id)) {
			msg.edit({
				embed: ({
					color: 15684432,
					title: `User ${msg.author.tag}, has already been whitelisted!`,
					timestamp: new Date(),
					description: `<:redx:411978781226696705> You have already been whitelisted no need to do this again!`
				})
			});
		}
	}));
};

exports.info = {
	hidden: true,
	name: 'whitelist',
	usage: 'whitelist',
	description: 'Whitelist your HWID to allow full access to my roblox CripsSploit exploit.'
};
