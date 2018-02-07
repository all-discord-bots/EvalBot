const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));

exports.run = async (bot, msg, args) => {
  let autoban = false;
  let automute = false;
  let mutedrole = "muted";
  let modlogs = "mod_logs";
  //!warn @daeshan <reason>
  if(!msg.member.hasPermission("KICK_MEMBERS")) return msg.reply("You are missing the permissions `Kick Members`!");
  let wUser = msg.guild.member(message.mentions.users.first()) || msg.guild.members.get(args[0])
  if(!wUser) return msg.reply("Can't find user!");
//  if(wUser.hasPermission("MANAGE_MESSAGES")) return message.reply("They waaaay too kewl");
  let reason = args.join(" ").slice(22);

  if(!warns[wUser.id]) warns[wUser.id] = {
    warns: 0
  };

  warns[wUser.id].warns++;

  fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
    if (err) console.log(err)
  });

  let warnEmbed = new Discord.RichEmbed()
  .setDescription("Warns")
  .setAuthor(msg.author.username)
  .setColor("#fc6400")
  .addField("Warned User", `<@${wUser.id}>`)
  .addField("Warned In", msg.channel)
  .addField("Number of Warnings", warns[wUser.id].warns)
  .addField("Reason", reason);

  let warnchannel = msg.guild.channels.find(`name`, `${modlogs}`);
  if(!warnchannel) return msg.reply(`Couldn't find ${modlogs} channel`);

  warnchannel.send(warnEmbed);

  if (automute) {
    if(warns[wUser.id].warns == 2){
      let muterole = msg.guild.roles.find(`name`, `${mutedrole}`);
      if(!muterole) return msg.reply(`Cannot find ${mutedrole} role!`);

      let mutetime = "10s";
      await(wUser.addRole(muterole.id));
      msg.channel.send(`<@${wUser.id}> has been temporarily muted`);

      setTimeout(function(){
        wUser.removeRole(muterole.id)
        msg.reply(`<@${wUser.id}> has been unmuted.`)
      }, ms(mutetime))
    }
  }
  if (autoban) {
    if(warns[wUser.id].warns == 3){
      msg.guild.member(wUser).ban(reason);
      msg.reply(`<@${wUser.id}> has been banned.`)
    }
  }

}

exports.info = {
  name: 'warn',
  usage: 'warn <member> <reason>',
  description: 'Gives member a warning, usually for breaking the rules.'
}
