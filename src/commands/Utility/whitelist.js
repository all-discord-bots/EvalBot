const DBL = require("dblapi.js");
const paste = require("better-pastebin");

exports.run = async (bot, msg, args) => {
	// if (msg.author.id !== bot.config.botCreatorID) return;
	if (msg.guild.id !== bot.config.botMainServerID) return msg.channel.send(`<:redx:411978781226696705> This command may only be used on the support server!`);
	//if (msg.channel.type !== "dm") return msg.channel.send(`<:redx:411978781226696705> This command may only be used in ${bot.user.username}'s DM's`).catch(console.error);
	let gbot = msg.guild.members.get(bot.user.id);
	if (!gbot.hasPermission(0x10000000)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Manage Roles\`!`).catch(console.error);
	if (!args[0] || args[0].length < 6) return msg.channel.send(`<:redx:411978781226696705> Invalid HWID provided please provide a valid ID to whitelist.`).catch(console.error);
	let pastebinID = "xd2bt7z9";
	const dbl = new DBL(process.env.DB_TOKEN, bot);
	paste.setDevKey(process.env.PASTEBIN_KEY);
	//
	let requestuser = msg.author.tag;
	let guser = msg.guild.members.find(`id`, `${msg.author.id}`);
	let whitelistedRole = msg.guild.roles.find('id', '433745475930292235');
	(await msg.channel.send({ embed: ({ author: { name: 'Validating request...', icon_url: 'http://4.bp.blogspot.com/-JF6M1HaI9rQ/VD_eCkLpG7I/AAAAAAAAAXk/0f1ym7hBXYs/s1600/Loading-Circle.gif', } }) }).then((msg) => {
		if (dbl.hasVoted(msg.author.id) && !msg.member.roles.has(whitelistedRole.id)) { // user has already upvoted
			// ({original: true})
			// send pastebin here
			paste.login(process.env.username, process.env.pw, function(success, data) {
				if (success) {
					console.log("Successfully logged in to pastebin!");
				} else {
					console.log("Failed (" + data + ")");
					return false;
				}
				paste.get(pastebinID, function(success, data) {
					//data contains the contents of the paste
					if (success) {
						if (data.toString().includes(args[0].toString())) {
							return msg.channel.send({
								embed: ({
									color: 15684432,
									title: `User ${requestuser}, has already been whitelisted!`,
									timestamp: new Date(),
									description: `<:redx:411978781226696705> You have already been whitelisted no need to do this again!`
								})
							});
						}
						// paste.edit("xd2bt7z9", contents = `${data}\n${args[0].toString()} - [${msg.author.tag} <${msg.author.id}>]`, function(success, data) {
						paste.edit(pastebinID, contents = `${data}\n${args[0].toString()}`, function(success, data) {
							if (success) {
								// TODO: Create 'Whitelist Logs' channel to log messages in
								console.log(data);
							} else {
								console.log("Failed (" + data + ")");
								return false;
							}
							//data contains the new contents of the paste
						});
					} else {
						console.log("Failed (" + data + ")");
					}
				});
			});

			guser.addRole(whitelistedRole).then(() => {
				msg.edit({
					embed: ({
						color: 6732394,
						title: `Successfully whitelisted user ${requestuser}!`,
						timestamp: new Date(),
						description: `<:check:411976443522711552> ${requestuser} has been successfully whitelisted. You now have full access to CripsSploit <a:dancingblob:413502883900686348>.\nHead to <#430696088077598722> if you need to download CripsSploit.\nPlease check your DM's for your whitelist information.`
					})
				});
				guser.send({
					embed: ({
						color: 6732394,
						title: `Your Whitelist Information`,
						timestamp: new Date(),
						description: `HWID: \`${args[0].toString()}\``
					})
				});
				bot.channels.get("434139845854756864").send({
					embed: ({
						color: 6732650,
						title: `Whitelisted`,
						timestamp: new Date(),
						description: `User: ${requestuser}\nHWID: ${args[0].toString()}`,
						author: {
							name: `${requestuser}`,
							icon_url: `${guser.user.displayAvatarURL}`
						}
					})
				}).catch(console.error);
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
					title: `Error whitelisting user, ${requestuser}!`,
					timestamp: new Date(),
					description: `<:redx:411978781226696705> You must upvote my discord bot [here](https://discordbots.org/bot/${bot.user.id}) first!`
				})
			});
		} else if (dbl.hasVoted(msg.author.id) && msg.member.roles.has(whitelistedRole.id)) {
			msg.edit({
				embed: ({
					color: 15684432,
					title: `User ${guser.tag}, has already been whitelisted!`,
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
	usage: 'whitelist <your HWID>',
	description: 'Whitelist your HWID to allow full access to my roblox CripsSploit exploit.'
};
