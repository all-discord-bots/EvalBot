const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
const warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));

exports.run = async (bot, msg, args) => {

//  if(!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.reply("You can't do that.");
  let wUser;
  if (msg.guild.member(msg.mentions.user.first())) {
      wUser = msg.guild.member(msg.mentions.users.first());
  } else if (msg.guild.members.get(args[0])) {
      wUser = msg.guild.members.get(args[0]);
  }
  if(!wUser) return msg.channel.send(`<:redx:411978781226696705> Can't find that user!`).catch(console.error);
  let warnlevel = warns[wUser.id].warns;
  let s;
  if (warnlevel === 1) {
    s = '';
  } else {
    s = 's';
  }
  msg.channel.send(`<@${wUser.id}> has \`${warnlevel}\` warning${s}.`);

};

exports.info = {
  name: 'warnlevel',
  hidden: true, // broken atm
  aliases: ['warnlvl','warn-level'],
  usage: 'warnlevel <user>',
  description: 'Displays the number of a users warnings on the current guild.'
};
