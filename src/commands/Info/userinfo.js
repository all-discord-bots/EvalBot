const https = require('https')
const moment = require('moment');
require('moment-duration-format');
exports.run = async (bot, msg, args) => {
	const activityTypes = [
		'Playing',
		'Streaming',
		'Listening to',
		'Watching',
	];
	if (args[0]) {
		let gusers = args.join(' ');
	}
	let user;
	if (msg.mentions.users.first()) {
		user = msg.mentions.users.first();
	} else if (bot.users.find(`id`, `${gusers}`)) {
		user = msg.guild.members.get(`${gusers}`);
	} else if (!msg.mentions.users.first() && !bot.users.find(`id`, `${gusers}`)) {
		user = msg.guild.members.get(`${msg.member.id}`);
	} // meed to get the user by plain name eg. BannerBomb
	let statusemoji;
	if (user.presence.status === "online") {
		statusemoji = `<:online:411637359398879232>`;
	} else if (user.presence.status === "idle") {
		statusemoji = `<:away:411637359214460939>`;
	} else if (user.presence.status === "dnd") {
		statusemoji = `<:dnd:411636698993262593>`;
	} else if (user.presence.status === "offline") {
		statusemoji = `<:offline:411637359361392650>`;
	}
	let gdate = new Date(user.createdTimestamp);
	let months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
	let days = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];
	let gmonth = months[gdate.getMonth()];
	let gday = days[gdate.getDate()+1];
	let gyear = gdate.getYear()-100;
	let newyear = new Date();
	let gnewmonth = months[newyear.getMonth()];
	let gnewyear = newyear.getYear()-100;
	let jdate = new Date(user.joinedTimestamp); // msg.member.joinedTimestamp
	let jmonth = jdate.getMonth()+1;
	let jday = jdate.getDate();
	let jyear = jdate.getFullYear();
	let ggame;
	if (user.presence.game !== null) {
		ggame = `\n <:transparent:411703305467854889>${activityTypes[user.presence.game.type]} **${user.presence.game.name}**`; // For bot.user.localPresence.game.since
	} else {
		ggame = "";
	}
	msg.channel.send({embed: ({
		color: 3447003,
		description: `${statusemoji} <@${user.id}>${ggame}`,
		thumbnail: {
			url: `${user.avatarURL}`
		}, author: {
			name: `${user.tag}`,
			icon_url: `${user.avatarURL}`
		}, fields: [
		{
			name: 'User ID',
			value: `${user.id}`
		}, {
			name: 'Joined Discord',
			value: `${gday}-${gmonth}-${gyear} (${gnewyear-gyear} year and ${gnewmonth-gmonth} month ago)`
			//value: `${moment.utc(cdate).format(`${cday}-${jmonth}-${jyear}`, "DD-MM-YY")}`
		}, {
			name: 'Joined Server',
			//value: `${gsday}-${gsmonth}-${gsyear} (${gsmonth-gmonth} month ago)`
			value: `${moment.utc(jdate).format(`${jday}-${jmonth}-${jyear}`, "DD-MM-YY")}`
		}, {
			name: 'Highest Role',
			value: 'N/A',
			inline: true
		}, {
			name: 'Member #',
			value: 'N/A',
			inline: true
		}
	],
})})
}
exports.info = {
	name: 'user-info',
	aliases: ['user','userinfo','member','member-info','profile'],
	usage: 'user-info <user>',
	description: 'Shows various information and data on the mentioned user.'
};
