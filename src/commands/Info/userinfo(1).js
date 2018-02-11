const https = require('https')
const dateformat = require('dateformat')
exports.run = async (bot, msg) => {
	var user = msg.mentions.users.first()
	msg.channel.send({embed: ({
		color: 3447003,
		thumbnail: {
			url: 'https://cdn.discordapp.com/avatars/' + user.id + '/' + user.avatar + '.png'
		}, author: {
			name: 'Userinfo for ' + user.username + '#' + user.discriminator
		}, fields: [
			{
				name: 'Created',
				value: dateformat(user.createdAt)
			}, {
				name: 'Presence',
				value: 'Status: ' + user.presence.status
			}, {
				name: 'User Notes',
				value: ((user.note === null || user.note === '') ? 'None' : user.note)
			}
		],
		footer: {
			text: 'User ID: ' + user.id,
			timestamp: new Date()
		}
	})})
}
exports.info = {
	name: 'userinfo(1)',
	hidden: true,
	usage: 'userinfo(1) <user>',
	description: 'Shows info about a user.'
};
