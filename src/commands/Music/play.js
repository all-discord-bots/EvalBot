const stream = require('youtube-audio-stream');
const ytdl = require('ytdl-core');
const { YTSearcher } = require('ytsearcher');
const ypi = require('youtube-playlist-info');
const Discord = require('discord.js');
require('../../conf/globals.js');

exports.run = async (bot, msg, args) => {
  let gbot = msg.guild.members.get(bot.user.id);
  if (!gbot.hasPermission(0x00100000)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Connect\` permissions!`).catch(console.error);
  if (!gbot.hasPermission(0x00200000)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Speak\` permissions!`).catch(console.error);
  let gprefix;
  if (bot.config[msg.guild.id]) {
    gprefix = bot.config[msg.guild.id].prefix;
  } else if (!bot.config[msg.guild.id]) {
    gprefix = bot.config.prefix;
  }
  let arg = args.join(' ');
  if (arg.length < 1) return msg.channel.send(`<:redx:411978781226696705> You must provide a url or search string!`).catch(console.error);
  if (!msg.member.voiceChannel) return msg.channel.send(`<:redx:411978781226696705> You must be in a voice channel!`).catch(console.error);
  const search = new YTSearcher({
    key: `AIzaSyA_wwB0QLuNaFbI65OdRkuyzeu6_PTvkWk`,
    revealkey: true
  });
  
  //if (!musicqueue[msg.guild.id]) musicqueue[msg.guild.id] = [];
  //if (!songqueue[msg.guild.id]) songqueue[msg.guild.id] = [];
  //if (!musicqueue[msg.guild.id]['streaming']) musicqueue[msg.guild.id]['streaming'] = false;
  //if (!musicqueue[msg.guild.id]['looped']) musicqueue[msg.guild.id]['looped'] = false;
  //if (!musicqueue[msg.guild.id]['loopone']) musicqueue[msg.guild.id]['loopone'] = false;
  //if (!musicqueue[msg.guild.id]['shuffle']) musicqueue[msg.guild.id]['shuffle'] = false;
  //if (!musicqueue[msg.guild.id]['music']) musicqueue[msg.guild.id]['music'] = [];
  search.search(arg, { type: 'video' }).then(searchResult => {
    let result = searchResult.first;
    //if (!result) return msg.channel.send(`<:redx:411978781226696705> Could not find this video.`).catch(console.error);
    // result.id = video id // result.channelID = channel id // result.url = full video url // result.title = video name // result.description = video description
    musicqueue[msg.guild.id]['music'].push(`${result.url}`);
    //if (musicqueue[msg.guild.id]['music'].length === 1 || !bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id)) executeQueue(musicqueue[msg.guild.id]['music']);
    if (musicqueue[msg.guild.id]['music'].length === 1 && bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id)) executeQueue(musicqueue[msg.guild.id]['music']);
    if (result.url) { // message information about the video on playing the video
      let thumbnail;
      if (result.thumbnails.default.url && !result.thumbnails.medium.url && !result.thumbnails.high.url) {
        thumbnail = `${result.thumbnails.default.url}`;
      } else if (result.thumbnails.default.url && result.thumbnails.medium.url && !result.thumbnails.high.url) {
        thumbnail = `${result.thumbnails.medium.url}`;
      } else if (result.thumbnails.default.url && result.thumbnails.medium.url && result.thumbnails.high.url) {
        thumbnail = `${result.thumbnails.high.url}`;
      }
      msg.channel.send({embed: ({
        color: 3447003,
        title: `${result.title} by ${result.channelTitle}`,
        url: `${result.url}`,
        description: `${result.description}`,
        "thumbnail": {
          url: `${thumbnail}`
        },
        timestamp: new Date()
      })});
    }
  }).catch(console.error);
  console.log(`${musicqueue[msg.guild.id].music}`);
  
  let musicbot = {
    youtubeKey: process.env.YOUTUBE_API_KEY, // A YouTube Data API3 key. Required to run.
    prefix: gprefix, // The prefix of the bot. Defaults to "!".
    thumbnailType: 'high', // Type of thumbnails to use for videos on embeds. Can equal: default, medium, high.
    global: false, // Whether to use one global queue or server specific ones.
    maxQueueSize: 100, // Max queue size allowed. Defaults 20.
    defVolume: 100, // The default volume of music. 1 - 200, defaults 50.
    anyoneCanSkip: true, // Whether or not anyone can skip.
    clearInvoker: false, // Whether to delete command messages.
    messageHelp: false, // Whether to message the user on help command usage. If it can't, it will send it in the channel like normal.
    //botAdmins: [], // An array of Discord user ID's to be admins as the bot. They will ignore permissions for the bot, including the set command.
    enableQueueStat: true, // Whether to enable the queue status, old fix for an error that occurs for a few people.
    anyoneCanAdjust: true, // Whether anyone can adjust volume.
    ownerOverMember: false, // Whether the owner over-rides CanAdjust and CanSkip.
    anyoneCanLeave: true, // Whether anyone can make the bot leave the currently connected channel. // false because of a bug with permissions atm
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
  
  function executeQueue(queue) {
    // If the queue is empty, finish.
    if (queue.length === 0) {
      msg.channel.send(`<:check:411976443522711552> Playback finished.`);
      // Leave the voice channel.
      const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
      if (voiceConnection !== null) return voiceConnection.disconnect();
    }
    
    new Promise((resolve, reject) => {
      // Join the voice channel if not already in one.
      const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
      if (!msg.member.voiceChannel) return msg.channel.send(`<:redx:411978781226696705> You must be in a voice channel!`).catch(console.error);
      if (voiceConnection === null) {
        // Check if the user is in a voice channel.
        if (msg.member.voiceChannel && msg.member.voiceChannel.joinable) {
          msg.member.voiceChannel.join().then(connection => {
            resolve(connection);
          }).catch((error) => {
            console.log(error);
          });
        } else if (!msg.member.voiceChannel.joinable) {
          msg.channel.send(`<:redx:411978781226696705> I do not have permission to join your voice channel!`);
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
        //if (!musicbot.global) {
        //  const lvid = musicbot.getLast(msg.guild.id);
        //  musicbot.setLast(msg.guild.id, video);
        //  if (lvid !== video) musicbot.np(msg);
        //};
        musicqueue[msg.guild.id].streaming = false;
        let dispatcher = musicbot.streamMode == 0 ? connection.playStream(ytdl(video.toString(), {filter: 'audioonly'}), { volume: (musicbot.defVolume / 100) }) : connection.playStream(stream(video.toString()), { volume: (musicbot.defVolume / 100) }); // YouTube, and Streams stream (1) is broken
        connection.on('error', (error) => {
          // Skip to the next song.
          console.log(`Dispatcher/connection: ${error}`);
          if (msg && msg.channel) msg.channel.send(`<:redx:411978781226696705> Dispatcher error!\n\`${error}\``);
          queue.shift();
          executeQueue(musicqueue[msg.guild.id].music);
        });
        
        dispatcher.on('error', (error) => {
          // Skip to the next song.
          console.log(error);
          console.log(`Dispatcher: ${error}`);
          if (msg && msg.channel) msg.channel.send(`<:redx:411978781226696705> Dispatcher error!\n\`${error}\``);
          queue.shift();
          executeQueue(musicqueue[msg.guild.id].music);
        });
        
        dispatcher.on('end', () => {
          // Wait a second.
          setTimeout(() => {
            if (musicqueue[msg.guild.id]['looped'] && !musicqueue[msg.guild.id]['loopone']) {
              if (songqueue[msg.guild.id].length > 0) {
                songqueue[msg.guild.id].splice(0, songqueue[msg.guild.id].length);
              }
              executeQueue(musicqueue[msg.guild.id]['music']);
            } else if (musicqueue[msg.guild.id]['loopone'] && !musicqueue[msg.guild.id]['looped']) {
              if (songqueue[msg.guild.id].length < 1) {
                songqueue[msg.guild.id].push(musicqueue[msg.guild.id]['music'][0]);
              } else if (songqueue[msg.guild.id].length > 0) {
                songqueue[msg.guild.id].splice(0, songqueue[msg.guild.id].length);
                songqueue[msg.guild.id].push(musicqueue[msg.guild.id]['music'][0]);
              }
              executeQueue(songqueue[msg.guild.id]);
            } else if (!musicqueue[msg.guild.id].looped && !musicqueue[msg.guild.id].loopone) {
              if (queue.length > 0) {
                // Remove the song from the queue.
                queue.shift();
                // Play the next song in the queue.
                executeQueue(musicqueue[msg.guild.id].music);
              }
            } else {
              if (queue.length > 0) {
                // Remove the song from the queue.
                queue.shift();
                // Play the next song in the queue.
                executeQueue(musicqueue[msg.guild.id].music);
              }
            }
          }, 1000);
        });
      } catch (error) {
        console.log(error);
      }
    }).catch((error) => {
      console.log(error);
    });
  }
};

exports.info = {
  name: 'play',
  usage: 'play <url|search>',
  description: 'Play audio from YouTube.'
};
