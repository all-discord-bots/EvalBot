//const musiccfg = require('../../../conf/musicconfig');
// TODO: Setup FS functions to write to /conf/musicconfig.json
exports.run = async (bot, msg) => {
	if (msg.author.id !== bot.config.botCreatorID) return;
	/*
	musicbot.loopState = (server) => {
    if (musicbot.global) return false;
    if (!musicbot.loops[server]) {
      musicbot.loops[server] = {
        looping: false,
        last: null
      };
    };
    if (musicbot.loops[server].looping) return true;
    else if (!musicbot.loops[server].looping) return false;
  };
  
  musicbot.setLoopState = (server, state) => {
    if (state && typeof state !== 'boolean') return console.log(`[loopingSet] ${new Error(`state wasnt a boolean`)}`);
    if (!musicbot.loops[server]) {
      musicbot.loops[server] = {
        looping: false,
        last: null
      };
    };
    if (!state) return musicbot.loops[server].looping = false;
    if (state) return musicbot.loops[server].looping = true;
  };
	*/
/*	const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
	if (voiceConnection === null) return msg.channel.send(`No music is being played.`).catch(console.error);
	const looping = musiccfg.loopState[msg.guild.id];
	if (looping) {
		musiccfg.setLoopState(msg.guild.id, false);
		return msg.channel.send(`Looping disabled! :arrow_forward:`);
	} else if (!looping) {
		musiccfg.setLoopState(msg.guild.id, true);
		return msg.channel.send(`Looping enabled! :repeat_one:`);
	};
*/
};

exports.info = {
	hidden: true,
	name: 'loop',
	usage: 'loop',
	description: 'Changes the loop state.'
};
