const ms = require('ms');

exports.run = async (bot, msg, args) => {
	try {
		let gchannel;
		if (args.length <= 0) {
			gchannel = msg.guild.channels.get(`${msg.channel.id}`)
		} else {
			if (msg.guild.channels.find(`name`, `${args[0]}`)) {
				gchannel = msg.guild.channels.find(`name`, `${args[0]}`);
			} else if (msg.guild.channels.get(`${args[0]}`)) {
				gchannel = msg.guild.channels.get(`${args[0]}`);
			} else if (msg.content.includes("<#") && msg.content.includes(">")) {
				gchannel = msg.guild.channels.get(`${args[0].replace(/<#|>/g, '')}`); // gets the channels id
			} else {
				gchannel = msg.guild.channels.get(`${msg.channel.id}`);
			}
			if (!gchannel) return msg.channel.send(`<:redx:411978781226696705> Invalid \`[channel]\` argument given.`);
		}
		if (!bot.lockit) bot.lockit = [];
		let validUnlocks = ['release', 'unlock'];
		//if (args[1] && !ms(`${parseFloat(args[1])}`)) return msg.channel.send(`<:redx:411978781226696705> Invalid \`[length]\` argument given.`);
		if (args[1] && validUnlocks.includes(args[1])) {
			if (!bot.lockit[gchannel.id] || bot.lockit[gchannel.id] <= 0) return msg.channel.send(`<:redx:411978781226696705> <#${gchannel}> is not currently locked-down.`);
			gchannel.overwritePermissions(msg.guild.id, {
				SEND_MESSAGES: null
			}).then(() => {
				msg.channel.send(`<:check:411976443522711552> <#${gchannel.id}> is no longer locked-down.`);
				clearTimeout(bot.lockit[gchannel.id]);
				delete bot.lockit[gchannel.id];
			}).catch((err) => {
				return console.log(err.toString());
			});
		} else if (args[1] && ms(`${args[1]}`)) {
			if (bot.lockit[gchannel.id]) return msg.channel.send(`<:redx:411978781226696705> <#${gchannel}> is already locked-down.`);
			gchannel.overwritePermissions(msg.guild.id, {
				SEND_MESSAGES: false
			}).then(() => {
				msg.channel.send(`<:check:411976443522711552> <#${gchannel.id}> has been locked-down for ${ms(ms(`${args[1]}`), { long:true })}`).then(() => {
					bot.lockit[gchannel.id] = setTimeout(() => {
						gchannel.overwritePermissions(msg.guild.id, {
							SEND_MESSAGES: null
						}).then(() => {
							msg.channel.send(`<:check:411976443522711552> <#${gchannel.id}> is no longer locked-down.`);
							delete bot.lockit[gchannel.id];
						}).catch((err) => {
							return console.error(err.toString());
						});
					}, ms(`${args[1]}`));
				}).catch((err) => {
					return console.error(err.toString());
				});
			});
		} else {
			gchannel.overwritePermissions(msg.guild.id, {
				SEND_MESSAGES: false
			}).then(() => {
				msg.channel.send(`<:check:411976443522711552> <#${gchannel.id}> has been locked-down until you run the \`lock-down <#${gchannel.id}> unlock\` command`);
			}).catch((err) => {
				return console.error(err.toString());
			});
		}
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'lock-down',
	userPermissions: ["MANAGE_CHANNELS"],
	clientPermissions: ["MANAGE_CHANNELS","MANAGE_ROLES"],
	aliases: ['channel-lock-down','lock-down-channel','lockdown'],
	usage: 'lock-down [channel] [length]',
	examples: [
		'lock-down #general 3m',
		'lock-down #general',
		'lock-down',
		'lock-down #general unlock',
		'lock-down unlock'
	],
	description: 'Lock down a channel, to prevent anyone sending messages. (Unless they have Administrator permission, or Send Messages is set to Allow in channel permissions for a role they have.). Example 1s, 1m, 1h .etc you can use `unlock` or `release` to un-lockdown a channel.',
};
