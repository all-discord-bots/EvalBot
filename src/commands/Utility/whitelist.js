const DBL = require("dblapi.js");
exports.run = async (bot, msg, args) => {
	const dbl = new DBL(process.env.DB_TOKEN, bot);
	if (msg.guild.id !== bot.config.botMainServerID) return msg.channel.send(`<:redx:411978781226696705> This command may only be used on the support server!`);
	let guser = msg.guild.members.find(`id`, `${msg.author.id}`);
	let whitelistedRole = msg.guild.roles.find('id', '414897780553941002');
	if (dbl.hasVoted(msg.author.id) && !msg.member.roles.has(whitelistedRole.id)) { // user has already upvoted
		guser.addRole(whitelistedRole).then(() => {
			msg.channel.send({ embed: ({
				color: 6732394,
				title: `Successfully whitelisted user ${msg.author.tag}!`,
				timestamp: new Date(),
				description: `<:check:411976443522711552> You have been successfully whitelisted. You may now use the full version of CripsSploit <:dancingblob:413502883900686348>`
			})});
		});
	} else if (!dbl.hasVoted(msg.author.id) && !msg.member.roles.has(whitelistedRole.id)) { // user has not upvoted yet
		msg.channel.send({ embed: ({
			color: 15684432,
			title: `Error Verifying ${msg.author.tag}!`,
			timestamp: new Date(),
			description: `<:redx:411978781226696705> You must upvote the bot [here](https://discordbots.org/bot/${bot.user.id}) first!`
		})});
	} else if (dbl.hasVoted(msg.author.id) && msg.member.roles.has(whitelistedRole.id)) {
		msg.channel.send({ embed: ({
			color: 15684432,
			title: `Already Verified ${msg.author.tag}!`,
			timestamp: new Date(),
			description: `<:redx:411978781226696705> You have already been whitelisted no need to do this again!`
		})});
	}
};
















const { machineId, machineIdSync } = require("node-machine-id");

exports.run = async (bot, msg) => {
	//
	await machineId().then((id) => {
		// ({original: true})
		//
	}).catch(err => console.log(err));
	/*
		let id = machineIdSync()
		// id = c24b0fe51856497eebb6a2bfcd120247aac0d6334d670bb92e09a00ce8169365
		let id = machineIdSync({original: true})
		// id = 98912984-c4e9-5ceb-8000-03882a0485e4
	*/
};

exports.info = {
	hidden: true,
	name: 'whitelist',
	usage: 'whitelist',
	description: 'Whitelist your HWID to allow full access to my roblox CripsSploit exploit.'
};
