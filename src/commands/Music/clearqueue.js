require('../../conf/globals.js');
exports.run = async (bot, msg) => {
	musicqueue[msg.guild.id]['loopqueue'] = false;
	musicqueue[msg.guild.id]['loopsong'] = false;
	if (musicqueue[msg.guild.id]['music'].length > 0) {
		musicqueue[msg.guild.id]['music'].splice(0, musicqueue[msg.guild.id]['music'].length);
		msg.channel.send(`<:check:411976443522711552> Queue has been cleared!`);
	} else {
		msg.channel.send(`<:redx:411978781226696705> Queue is already empty!`);
	}
};

exports.info = {
	name: 'clearqueue',
	usage: 'clearqueue',
	description: 'Clears the current queue.'
};
