const Discord = require("discord.js");
const ms = require("ms");

exports.run = async (bot, msg, args) => {
let mutedrole = "Muted"; // name of the 'muted' role
  //!tempmute @user 1s/m/h/d
  let gbot = msg.guild.members.get(bot.user.id);
  if (!gbot.hasPermission(0x10000000)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Manage Roles\`!`).catch(console.error);
  if (!gbot.hasPermission(0x00000002)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Kick Members\`!`).catch(console.error);
  if (msg.author.id !== bot.config.botCreatorID) {
    if(!msg.member.hasPermission("KICK_MEMBERS")) return msg.channel.send(`<:redx:411978781226696705> You are missing permissions \`Kick Members\`!`).catch(console.error);
    if(!msg.member.hasPermission("MANAGE_ROLES")) return msg.channel.send(`<:redx:411978781226696705> You are missing permissions \`Manage Roles\`!`).catch(console.error);
  }
  let tomute = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));
  if(!tomute) return msg.channel.send(`<:redx:411978781226696705> Can't find that user.`).catch(console.error);
  //if(tomute.hasPermission("MANAGE_MESSAGES")) return msg.channel.send(`<:redx:411978781226696705> Can't mute them!`);
  let muterole = msg.guild.roles.find(`name`, `${mutedrole}`);
  //start of create role
  if(!muterole){
    try{
      muterole = await msg.guild.createRole({
        name: `${mutedrole}`,
        color: "#818386",
        permissions:[]
      }).catch(console.error);
      msg.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    }catch(e){
      console.log(e.stack);
    }
  }
  //end of create role
  let mutetime = args[1];
  if(mutetime) {
    await(tomute.addRole(muterole.id)).catch(console.error);
    msg.channel.send(`<:check:411976443522711552> <@${tomute.id}> has been muted for ${ms(ms(mutetime))}`);

    setTimeout(function(){
      tomute.removeRole(muterole.id).catch(console.error);
      msg.channel.send(`<@${tomute.id}> has been unmuted!`);
    }, ms(mutetime));
  } else if (!mutetime) {
    msg.channel.send(`<:check:411976443522711552> <@${tomute.id}> has been muted for ${ms(ms(mutetime))}`);
    await(tomute.addRole(muterole.id)).catch(console.error);
  }


//end of module
}

exports.info = {
  name: 'tempmute',
  aliases: ['temp-mute','c-mute','chat-mute','t-mute','text-mute','m'],
  usage: 'tempmute <user> [1s/m/h/d]',
  description: 'Mutes a member from the server. This prevents them from sending messages. If no length is given they will be muted until un-muted. Length format examples: `1s`, `1m`, `1h`, `1d`, `1w`, `1mth`, `1y`.',
}
