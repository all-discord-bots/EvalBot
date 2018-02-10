const ms = require('ms');
exports.run = async (bot, msg, args) => {
  if (msg.author.id !== bot.config.botCreatorID) {
    if (!msg.member.hasPermission('MANAGE_CHANNELS')) return msg.channel.send(`<:redx:411978781226696705> You are missing the permissions \`Manage Channels\`!`);
  }
  let gchannel;
  if (msg.guild.channels.find(`name`, `${args[0]}`)) {
    gchannel = msg.guild.channels.find(`name`, `${args[0]}`);
  } else if (msg.guild.channels.find(`id`, `${args[0]}`)) {
    gchannel = msg.guild.channels.find(`id`, `${args[0]}`);
  } else {
    gchannel = msg.guild.channels.find(`id`, `${msg.channel.id}`);
  }
  if (!bot.lockit) bot.lockit = [];
  //let time = args.join(' ');
  let time = args[1];
  let validUnlocks = ['release', 'unlock'];
  if (!time) return msg.channel.send(`<:redx:411978781226696705> You must set a duration for the lockdown in either hours, minutes or seconds`);
  if (validUnlocks.includes(time)) {
    gchannel.overwritePermissions(msg.guild.id, {
      SEND_MESSAGES: null
    }).then(() => {
      msg.channel.send(`<:check:411976443522711552> <#${bot.lockit[gchannel.id]}> is no longer locked-down.`);
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
          }).then(msg.channel.send(`<:check:411976443522711552> <#${bot.lockit[gchannel.id]}> is no longer locked-down.`)).catch(console.error);
          delete bot.lockit[gchannel.id];
        }, ms(time));

      }).catch(error => {
        console.log(error);
      });
    });
  }
};

exports.info = {
  name: 'lock-down',
  aliases: ['channel-lock-down','lock-down-channel','lockdown'],
  description: 'Lock down a channel, to prevent anyone sending messages. (Unless they have Administrator permission, or Send Messages is set to Allow in channel permissions for a role they have.) If no duration is provided, the channel is locked-down until the command is run again.',
  usage: 'lock-down [channel] [duration]'
};
