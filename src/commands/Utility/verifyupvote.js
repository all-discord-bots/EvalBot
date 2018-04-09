const DBL = require("dblapi.js");
exports.run = async (bot, msg, args) => {
	const dbl = new DBL(process.env.DB_TOKEN, bot);
	if (msg.guild.id !== bot.config.botMainServerID) return msg.channel.send(`<:redx:411978781226696705> This command may only be used on the support server!`);
	let guser = msg.guild.members.find(`id`, `${msg.author.id}`);
	let upvoteRole = msg.guild.roles.find('id', '414897780553941002');
	if (dbl.hasVoted(msg.author.id) && !msg.member.roles.has(upvoteRole.id)) { // user has already upvoted
		guser.addRole(upvoteRole).then(() => {
			msg.channel.send({ embed: ({
				color: 6732394,
				title: `Successfully Verified ${msg.author.tag}!`,
				timestamp: new Date(),
				description: `<:check:411976443522711552> You have been successfully verified! <:pepoThumbUp:414910627786784768>`
			})});
		});
	} else if (!dbl.hasVoted(msg.author.id) && !msg.member.roles.has(upvoteRole.id)) { // user has not upvoted yet
		msg.channel.send({ embed: ({
			color: 15684432,
			title: `Error Verifying ${msg.author.tag}!`,
			timestamp: new Date(),
			description: `<:redx:411978781226696705> You must upvote the bot [here](https://discordbots.org/bot/408741303837392926) first!`
		})});
	} else if (dbl.hasVoted(msg.author.id) && msg.member.roles.has(upvoteRole.id)) {
		msg.channel.send({ embed: ({
			color: 15684432,
			title: `Already Verified ${msg.author.tag}!`,
			timestamp: new Date(),
			description: `<:redx:411978781226696705> You have already been verified no need to do this again!`
		})});
	}
};

exports.info = {
	name: 'verifyvote',
	usage: 'verifyvote',
	aliases: ['verifyupvote','upvotecheck','checkupvote'],
	description: 'Verify that you have upvoted this bot and if successfully verified you are given the Upvoted role. This command can only be used within the support server.'
};
