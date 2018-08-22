const ms = require('ms');

exports.run = async (bot, msg, args) => {
	try {
		let gchannel;
		let cping = args[0];
		let rping = cping.replace(/<#/g, '');
		let roneping = rping.replace(/>/g, '');
		if (msg.guild.channels.find(`name`, `${args[0]}`)) {
			gchannel = msg.guild.channels.find(`name`, `${args[0]}`);
		} else if (msg.guild.channels.find(`id`, `${args[0]}`)) {
			gchannel = msg.guild.channels.find(`id`, `${args[0]}`);
		} else if (msg.content.includes("<#") && msg.content.includes(">")) {
			gchannel = msg.guild.channels.find(`id`, `${roneping}`); // gets the channels id
		} else {
			gchannel = msg.guild.channels.find(`id`, `${msg.channel.id}`);
		}
		if (!bot.lockit) bot.lockit = [];
		//let time = args.join(' ');
		let time = args[1];
		let validUnlocks = ['release', 'unlock'];
		if (!time) return msg.channel.send(`<:redx:411978781226696705> You must set a duration for the lockdown in either hours, minutes or seconds`).catch(console.error);
		if (validUnlocks.includes(time)) {
			gchannel.overwritePermissions(msg.guild.id, {
				SEND_MESSAGES: null
			}).then(() => {
				msg.channel.send(`<:check:411976443522711552> <#${gchannel.id}> is no longer locked-down.`);
				clearTimeout(bot.lockit[gchannel.id]);
				delete bot.lockit[gchannel.id];
			}).catch(error => {
				console.log(error);
			});
		} else {
			gchannel.overwritePermissions(msg.guild.id, {
				SEND_MESSAGES: false
			}).then(() => {
				msg.channel.send(`<:check:411976443522711552> <#${gchannel.id}> locked down for ${ms(ms(time), { long:true })}`).then(() => {
					bot.lockit[gchannel.id] = setTimeout(() => {
						gchannel.overwritePermissions(msg.guild.id, {
							SEND_MESSAGES: null
						}).then(msg.channel.send(`<:check:411976443522711552> <#${gchannel.id}> is no longer locked-down.`)).catch(console.error);
						delete bot.lockit[gchannel.id];
					}, ms(time));
				}).catch(error => {
					console.log(error);
				});
			});
		}
	} catch (err) {
		console.error(err.toString());
	}
};

exports.info = {
	name: 'lock-down',
	userPermissions: ["MANAGE_CHANNELS"],
	clientPermissions: ["MANAGE_CHANNELS"],
	aliases: ['channel-lock-down','lock-down-channel','lockdown'],
	description: 'Lock down a channel, to prevent anyone sending messages. (Unless they have Administrator permission, or Send Messages is set to Allow in channel permissions for a role they have.). Example 1s, 1m, 1h .etc you can use `unlock` or `release` to un-lockdown a channel.',
	usage: 'lock-down [channel] [duration]'
};
