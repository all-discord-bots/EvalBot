const moment = require('moment');
require('moment-duration-format');

exports.run = async (bot, msg, args) => {
	try {
		const activityTypes = {
			'PLAYING': {
				'status': 'Playing'
			},
			'STREAMING': {
				'status': 'Streaming'
			},
			'LISTENING TO': {
				'status': 'Listening to'
			},
			'WATCHING': {
				'status': 'Watching'
			}
		};
		const statusEmoji = {
			'online': {
				'normal': '<:online:411637359398879232>',
				'color_blind': '<:cb_online:491157259108483074>'
			},
			'idle': {
				'normal': '<:away:411637359214460939>',
				'color_blind': '<:cb_away:491157259175460864>'
			},
			'dnd': {
				'normal': '<:dnd:411636698993262593>',
				'color_blind': '<:cb_dnd:491157259078991882>'
			},
			'offline': {
				'normal': '<:offline:411637359361392650>',
				'color_blind': '<:cb_offline:491157259070603286>'
			}
		};
		let user;
		if (args.length <= 0) {
			user = bot.utils.getMembers(msg,`${msg.member.id}`); //msg.guild.members.get(`${msg.member.id}`);
			//let gtoprole = user.roles.filter((m) => m.name).map((m) => m.position).sort(function(a, b){return b-a});
			//toprole = user.roles.filter((m) => m.position === gtoprole[0]).map(m => m.id);
		} else {
			user = bot.utils.getMembers(msg,args.join(' '));
		}
		
		if (!user) return msg.channel.send(`<:redx:411978781226696705> I could not find that user.`);
		if (user.toString().includes("I could not find that user.")) return;
		if (!user.presence || !user.presence.status) return;

		let ggame = '';
		if (user.presence.activity !== null) {
			ggame = `\n <:transparent:411703305467854889>${activityTypes[user.presence.activity.type].status} **${user.presence.activity.name}**${user.presence.activity.timestamps ? ` for ${moment.duration(new Date().getTime() + new Date(user.presence.activity.timestamps.start).getTime(), 'milliseconds').format('y [years], w [weeks], d [days], h [hours], m [minutes], s [seconds]', { largest: 1 }) : ''}`}`;
		}
		
		if (msg.guild.members.get(`${user.id}`)) {
			msg.channel.send({
				embed:({
					color: 3447003,
					description: `${statusEmoji[user.presence.status].normal} <@${user.id}>${user.user.bot ? ' <:bot:491157258915414016>' : ''}${ggame}`,
					thumbnail: {
						url: `${user.user.displayAvatarURL()}`
					},
					author: {
						name: `${user.user.tag}`,
						icon_url: `${user.user.displayAvatarURL()}`
					},
					fields: [
						{
							name: 'User ID',
							value: `${user.id}`
						},{
							name: 'Joined Discord',
							value: `${moment.utc(new Date(user.user.createdTimestamp)).format("DD-MM-YY")} (${moment.duration(new Date() - new Date(user.user.createdTimestamp)).format()} ago)`
						},{
							name: 'Joined Server',
							value: `${moment.utc(new Date(user.joinedTimestamp)).format("DD-MM-YY")} (${moment.duration(new Date() - new Date(user.joinedTimestamp)).format()} ago)`
						},{
							name: 'Highest Role',
							value: `<@&${user.roles.highest.id}>`,
							inline: true
						},{
							name: 'Member #',
							value: `${msg.guild.members.map((member) => member.joinedTimestamp.toString()).sort().indexOf(`${user.joinedTimestamp}`) + 1}`,
							inline: true
						}
					],
				})
			});
		} else if (!msg.guild.members.get(`${user.id}`)) {
			msg.channel.send({
				embed:({
					color: 3447003,
					description: `${statusEmoji[user.presence.status].normal} <@${user.id}>${user.bot ? ' <:bot:491157258915414016>' : ''}${ggame}`,
					thumbnail: {
						url: `${user.displayAvatarURL()}`
					},
					author: {
						name: `${user.tag}`,
						icon_url: `${user.displayAvatarURL()}`
					},
					fields: [
						{
							name: 'User ID',
							value: `${user.id}`
						},{
							name: 'Joined Discord',
							value: `${moment.utc(new Date(user.createdTimestamp)).format("DD-MM-YY")} (${moment.duration(new Date() - new Date(user.createdTimestamp)).format()} ago)`
						}
					],
				})
			});
		}
	} catch (err) {
		console.error(err.toString());
	}
};
	
exports.info = {
	name: 'user-info',
	aliases: ['user','userinfo','member','member-info','profile'],
	usage: 'user-info <user>',
	examples: [
		'user-info BannerBomb',
		'user-info @BannerBomb',
		'user-info 9772'
	],
	description: 'Shows various information and data for a specific user.'
};
