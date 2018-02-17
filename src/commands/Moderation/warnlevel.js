const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));

exports.run = async (bot, msg, args) => {

//  if(!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.reply("You can't do that.");
  let wUser = msg.guild.member(msg.mentions.users.first()) || msg.guild.members.get(args[0])
  if(!wUser) return msg.channel.send(`<:redx:411978781226696705> Can't find user!`);
  let warnlevel = warns[wUser.id].warns;

  msg.channel.send(`<@${wUser.id}> has ${warnlevel} warnings.`);

};

exports.info = {
  name: 'warnlevel',
  hidden: true, // broken atm
  aliases: ['warnlvl','warn-level'],
  usage: 'warnlevel <user>',
  description: 'Displays the number of a users warnings on the current guild.'
};
