const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));

module.exports.run = async (bot, msg, args) => {

//  if(!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.reply("You can't do that.");
  let wUser = msg.guild.member(msg.msg.users.first()) || msg.guild.members.get(args[0])
  if(!wUser) return msg.reply("Can't find user!");
  let warnlevel = warns[wUser.id].warns;

  message.reply(`<@${wUser.id}> has ${warnlevel} warnings.`);

}

exports.info = {
  name: 'warnlevel',
  aliases: ['warnlvl','warn-level'],
  usage: 'warnlevel <user>',
  description: 'Displays the number of a users warnings on the current guild.'
}
