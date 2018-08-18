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
	let user;
	if (args.length <= 0) {
		user = bot.utils.getMembers(msg,`${msg.member.id}`); //msg.guild.members.get(`${msg.member.id}`);
		//let gtoprole = user.roles.filter(m => m.name).map(m => m.position).sort(function(a, b){return b-a});
		//toprole = user.roles.filter(m => m.position === gtoprole[0]).map(m => m.id);
	} else {
		user = bot.utils.getMembers(msg,args.join(' '));
	}
	
	if (!user) return msg.channel.send(`<:redx:411978781226696705> I could not find that user.`);
	if (user.toString().includes("I could not find that user.")) return;
	if (user.presence === undefined || user.presence.status === undefined) return;
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
	let gdate;
	if (msg.guild.members.get(`${user.id}`)) { // get when the user created their account
		gdate = new Date(user.user.createdTimestamp);
	} else if (!msg.guild.members.get(`${user.id}`)) {
		gdate = new Date(user.createdTimestamp);
	}
	//let months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
	//let days = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];
	//let gmonth = months[gdate.getMonth()];
	//let gday = days[gdate.getDate()]; // +1
	//let gyear = gdate.getYear()-100;
	let nowdate = new Date();
	//let gnewmonth = months[newyear.getMonth()];
	//let gnewyear = newyear.getYear()-100;
	let jdate = new Date(user.joinedTimestamp); // get when the user joined the server
	//let jmonth = months[jdate.getMonth()];
	//let jday = days[jdate.getDate()];
	//let jyear = jdate.getYear()-100;
	let ggame;
	if (user.presence.game !== null) {
		ggame = `\n <:transparent:411703305467854889>${activityTypes[user.presence.game.type]} **${user.presence.game.name}**`; // For bot.user.localPresence.game.since
	} else {
		ggame = "";
	}
	
	if (msg.guild.members.get(`${user.id}`)) {
	let membernum;
	if (msg.guild.owner.id === user.id) {
		membernum = '1';
	} else {
		membernum = 'N/A';
	}
	msg.channel.send({embed: ({
		color: 3447003,
		description: `${statusemoji} <@${user.id}>${ggame}`,
		thumbnail: {
			url: `${user.user.displayAvatarURL}`
		}, author: {
			name: `${user.user.tag}`,
			icon_url: `${user.user.displayAvatarURL}`
		}, fields: [
		{
			name: 'User ID',
			value: `${user.id}`
		}, {
			name: 'Joined Discord',
			value: `${moment.utc(gdate).format("DD-MM-YY")} (${moment.duration(nowdate - gdate).format()} ago)`
		}, {
			name: 'Joined Server',
			//value: `${gsday}-${gsmonth}-${gsyear} (${gsmonth-gmonth} month ago)`
			//value: `${moment.utc(jdate).format(`${jday}-${jmonth}-${jyear}`, "DD-MM-YY")}`
			value: `${moment.utc(jdate).format("DD-MM-YY")} (${moment.duration(nowdate - jdate).format()} ago)`
		}, {
			name: 'Highest Role',
			value: `<@&${msg.guild.members.get("269247101697916939").highestRole.id}>`,
			inline: true
		}, {
			name: 'Member #',
			value: `${membernum}`,
			inline: true
		}
	],
})})
	} else if (!msg.guild.members.get(`${user.id}`)) {
		msg.channel.send({embed: ({
		color: 3447003,
		description: `${statusemoji} <@${user.id}>${ggame}`,
		thumbnail: {
			url: `${user.displayAvatarURL}`
		}, author: {
			name: `${user.tag}`,
			icon_url: `${user.displayAvatarURL}`
		}, fields: [
		{
			name: 'User ID',
			value: `${user.id}`
		}, {
			name: 'Joined Discord',
			value: `${moment.utc(gdate).format("DD-MM-YY")} (${moment.duration(nowdate - gdate).format()} ago)`
		}
	],
})})
	}
}
exports.info = {
	name: 'user-info',
	aliases: ['user','userinfo','member','member-info','profile'],
	usage: 'user-info <user>',
	examples: [
		'user-info BannerBomb',
		'user-info @BannerBomb',
		'user-info 9772'
	],
	description: 'Shows various information and data on the mentioned user.'
};
