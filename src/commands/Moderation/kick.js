const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
    let modlogs = "mod-logs"; // mod_logs channel
    let kUser = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));
    if(!kUser) return msg.channel.send(`<:redx:411978781226696705> Can't find that user!`).catch(console.error);
    let kReason = args.join(" ").slice(22);
    let gbot = msg.guild.members.get(bot.user.id);
    if (!gbot.hasPermission(0x00000002)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Kick Members\`!`).catch(console.error);
    if (msg.author.id !== bot.config.botCreatorID) {
        if(!msg.member.hasPermission("KICK_MEMBERS")) return msg.channel.send(`<:redx:411978781226696705> You are missing the permissions \`Kick Members\`!`).catch(console.error);
    }
    if(!msg.guild.member(kUser).kickable) return msg.channel.send(`<:redx:411978781226696705> I may need my role moved higher!`).catch(console.error);
    
   
    if (msg.author.id !== bot.config.botCreatorID) {
      if(!msg.member.hasPermission("BAN_MEMBERS")) return msg.channel.send(`<:redx:411978781226696705> You are missing the permissions \`Ban Members\`!`).catch(console.error);
    }
    
//    if(kUser.hasPermission("MANAGE_MESSAGES")) return msg.channel.send("That person can't be kicked!");
    if (kUser.user.id === msg.author.id) return msg.channel.send(`<:redx:411978781226696705> I cannot allow self-harm!`).catch(console.error);
    let kickChannel = msg.guild.channels.find(`name`, `${modlogs}`);
    //if(!kickChannel) return msg.channel.send(`Can't find ${modlogs} channel.`).catch(console.error);

    msg.guild.member(kUser).kick(kReason).catch(err => msg.channel.send(`I could not kick this user due to the error: ${err}`));
    if (kickChannel) {
        let kickEmbed = new Discord.RichEmbed()
        .setDescription("~Kick~")
        .setColor("#e56b00")
        .addField("Kicked User", `${kUser} with ID ${kUser.id}`)
        .addField("Kicked By", `<@${msg.author.id}> with ID ${msg.author.id}`)
        .addField("Kicked In", msg.channel)
        .addField("Time", msg.createdAt)
        .addField("Reason", kReason);
        kickChannel.send(kickEmbed).catch(console.error);
    }
    msg.channel.send(`<:check:411976443522711552> Successfully kicked <@${kUser.id}>`).catch(console.error);
}

exports.info = {
  name: 'kick',
  aliases: ['smear'],
  usage: 'kick <member> <reason>',
  description: 'Kick a user from the server. If you would like to let the bot keep logs of moderations create a text channel named `mod-logs`'
}
