const stream = require('youtube-audio-stream')
const ytdl = require('ytdl-core');
const { YTSearcher } = require('ytsearcher');
const ypi = require('youtube-playlist-info');
const Discord = require('discord.js');

exports.run = async (bot, msg, args) => {
  let gprefix;
  if (bot.config[msg.guild.id]) {
	  gprefix = bot.config[msg.guild.id].prefix;
  } else if (!bot.config[msg.guild.id]) {
	  gprefix = bot.config.prefix;
  }
  let arg = args.join(' ');
  let queue = [];
  queue[queue.length] = arg;
  
  var musicbot = {
	  youtubeKey: process.env.YOUTUBE_API_KEY, // A YouTube Data API3 key. Required to run.
	  prefix: gprefix, // The prefix of the bot. Defaults to "!".
	  thumbnailType: 'high', // Type of thumbnails to use for videos on embeds. Can equal: default, medium, high.
	  global: false, // Whether to use one global queue or server specific ones.
	  maxQueueSize: 100, // Max queue size allowed. Defaults 20.
	  defVolume: 200, // The default volume of music. 1 - 200, defaults 50.
	  anyoneCanSkip: true, // Whether or not anyone can skip.
	  clearInvoker: false, // Whether to delete command messages.
	  messageHelp: false, // Whether to message the user on help command usage. If it can't, it will send it in the channel like normal.
	  //botAdmins: [], // An array of Discord user ID's to be admins as the bot. They will ignore permissions for the bot, including the set command.
	  enableQueueStat: true, // Whether to enable the queue status, old fix for an error that occurs for a few people.
	  anyoneCanAdjust: true, // Whether anyone can adjust volume.
	  ownerOverMember: false, // Whether the owner over-rides CanAdjust and CanSkip.
	  anyoneCanLeave: false, // Whether anyone can make the bot leave the currently connected channel. // false because of a bug with permissions atm
	  //botOwner: '269247101697916939', // The ID of the Discord user to be seen as the owner. Required if using ownerOverMember.
	  logging: true, // Some extra none needed logging (such as caught errors that didn't crash the bot, etc).
	  requesterName: true, // Whether or not to display the username of the song requester.
	  inlineEmbeds: false, // Whether or not to make embed fields inline (help command and some fields are excluded).
	  disableHelp: true, // Disable the help command.
	  disableSet: true, // Disable the set command.
	  disableOwnerCmd: true, // Disable the owner command.
	  streamMode: 0
	  //disableLeaveCmd: true // Disable the leave command. // Because this command is broken at the moment
	  // https://www.npmjs.com/package/discord.js-musicbot-addon
  };
	
    // If the queue is empty, finish.
    if (queue.length === 0) {
      msg.channel.send('Playback finished.');

      // Leave the voice channel.
      const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
      if (voiceConnection !== null) return voiceConnection.disconnect();
    }

    new Promise((resolve, reject) => {
      // Join the voice channel if not already in one.
      const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
      if (voiceConnection === null) {
        // Check if the user is in a voice channel.
        if (msg.member.voiceChannel && msg.member.voiceChannel.joinable) {
          msg.member.voiceChannel.join().then(connection => {
            resolve(connection);
          }).catch((error) => {
            console.log(error);
          });
        } else if (!msg.member.voiceChannel.joinable) {
          msg.channel.send('I do not have permission to join your voice channel!')
          reject();
        } else {
          // Otherwise, clear the queue and do nothing.
          queue.splice(0, queue.length);
          reject();
        }
      } else {
        resolve(voiceConnection);
      }
    }).then(connection => {
      // Get the first item in the queue.
      const video = queue[0];

      // Play the video.
      try {
        let dispatcher = musicbot.streamMode == 0 ? connection.playStream(ytdl(video.toString(), {filter: 'audioonly'}), { volume: (musicbot.defVolume / 100) }) : connection.playStream(stream(video.toString()), { volume: (musicbot.defVolume / 100) });

        connection.on('error', (error) => {
          // Skip to the next song.
          console.log(error);
          queue.shift();
        });

        dispatcher.on('error', (error) => {
          // Skip to the next song.
          console.log(error);
          queue.shift();
        });
      } catch (error) {
        console.log(error);
      }
    }).catch((error) => {
      console.log(error);
    });
};

exports.info = {
	name: 'play',
	usage: 'play <url>',
	description: 'Play audio from YouTube.'
};
