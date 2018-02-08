const Discord = require("discord.js");
const ms = require("ms");

exports.run = async (bot, msg, args) => {
let mutedrole = "muted"; // name of the 'muted' role
  //!tempmute @user 1s/m/h/d
  if (msg.author.id !== bot.config.botCreatorID) {
    if(!msg.member.hasPermission("KICK_MEMBERS")) return msg.channel.send("You are missing permissions `Kick Members`!");
  }
  let tomute = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));
  if(!tomute) return msg.reply("Couldn't find user.");
  //if(tomute.hasPermission("MANAGE_MESSAGES")) return msg.reply("Can't mute them!");
  let muterole = msg.guild.roles.find(`name`, `${mutedrole}`);
  //start of create role
  if(!muterole){
    try{
      muterole = await msg.guild.createRole({
        name: `${mutedrole}`,
        color: "#000000",
        permissions:[]
      })
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
  if(!mutetime) return msg.reply("You didn't specify a time!");

  await(tomute.addRole(muterole.id));
  msg.reply(`<@${tomute.id}> has been muted for ${ms(ms(mutetime))}`);

  setTimeout(function(){
    tomute.removeRole(muterole.id);
    msg.channel.send(`<@${tomute.id}> has been unmuted!`);
  }, ms(mutetime));


//end of module
}

exports.info = {
  name: 'tempmute',
  aliases: ['temp-mute'],
  usage: 'tempmute <user> <1s/m/h/d>',
  description: 'Temporarily mute a user.',
}
