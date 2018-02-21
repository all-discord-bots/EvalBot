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
  let gbot = msg.guild.members.get(bot.user.id);
  if (!gbot.hasPermission(0x00000002)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Kick Members\`!`).catch(console.error);
  if (msg.author.id !== bot.config.botCreatorID) {
    if(!msg.member.hasPermission("KICK_MEMBERS")) return msg.channel.send(`<:redx:411978781226696705> You are missing the permissions \`Kick Members\`!`).catch(console.error);
  }
  let wUser = msg.guild.member(msg.mentions.users.first()) || msg.guild.members.get(args[0])
  if(!wUser) return msg.channel.send(`<:redx:411978781226696705> Can't find that user!`).catch(console.error);
//  if(wUser.hasPermission("MANAGE_MESSAGES")) return message.reply("They waaaay too kewl");
  let reason = args.join(" ").slice(22);
  if (!reason) return msg.channel.send(`<:redx:411978781226696705> Please provide a reason.`).catch(console.error);
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
  if(!warnchannel) return msg.channel.send(`<:redx:411978781226696705> Couldn't find ${modlogs} channel!`).catch(console.error);

  warnchannel.send(warnEmbed);

  if (automute) {
    if(warns[wUser.id].warns === 2){
      let muterole = msg.guild.roles.find(`name`, `${mutedrole}`);
      if(!muterole) return msg.channel.send(`<:redx:411978781226696705> Cannot find ${mutedrole} role!`).catch(console.error);

      let mutetime = "10s";
      await(wUser.addRole(muterole.id)).catch(console.error);
      msg.channel.send(`<:check:411976443522711552> <@${wUser.id}> has been temporarily muted.`);

      setTimeout(function() {
        wUser.removeRole(muterole.id).catch(console.error);
        msg.channel.send(`<:check:411976443522711552> <@${wUser.id}> has been unmuted.`);
      }, ms(mutetime));
    }
  }
  if (autoban) {
    if(warns[wUser.id].warns === 3) {
      msg.guild.member(wUser).ban(reason).catch(err => msg.channel.send(`Could not ban ${wUser.username}: ${err}`));
      msg.reply(`<:check:411976443522711552> <@${wUser.id}> has been banned.`);
    }
  }

}

exports.info = {
  name: 'warn',
  usage: 'warn <member> <reason>',
  description: 'Gives member a warning, usually for breaking the rules.'
}
