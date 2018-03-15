const Discord = require('discord.js');
const economy = require('discord-eco');

exports.run = async (bot, msg, args) => {
  if (msg.author.id !== bot.config.botCreatorID) {
    //let botCommanderRole = bot.config.botCommanderRole;
//    if (!msg.member.hasPermission('MANAGE_SERVER') || !msg.member.roles.has(botCommanderRole)) return msg.channel.send(`<:redx:411978781226696705> You are missing the permissions \`Manage Server\` or the \`${botCommanderRole}\` role!`);
    if (!msg.member.hasPermission('MANAGE_SERVER')) return msg.channel.send(`<:redx:411978781226696705> You are missing the permissions \`Manage Server\`!`).catch(console.error);
    //msg.channel.send('**You need the role `' + botCommanderRole + '` to use this command...**');
  }
  // Check if they defined a user
  let defineduser = '';
  if (!args[0]) { // If they didn't define anyone, set it to their own.
    defineduser = msg.author.id;
  } else if(msg.mentions.users.first()) { // Run this if they did define someone...
    let firstMentioned = msg.mentions.users.first();
    defineduser = firstMentioned.id;
  } else {
    return msg.channel.send(`<:redx:411978781226696705> User could not be found!`).catch(console.error).catch(console.error);
  }
  if (!args[1]) {
    msg.channel.send(`<:redx:411978781226696705> **You need to define an amount. Usage: ${bot.config.prefix}add-money [user] <amount>**`);
    return;
  }
  if (isNaN(args[1])) {
    msg.channel.send(`<:redx:411978781226696705> **The amount has to be a number. Usage: ${bot.config.prefix}add-money [user] <amount>**`);
    return; // Remember to return if you are sending an error message! So the rest of the code doesn't run.
  }
  // Finally, run this.. REMEMBER IF you are doing the guild-unique method, make sure you add the guild ID to the end,
  economy.updateBalance(defineduser + msg.guild.id, parseInt(args[1])).then((i) => { // AND MAKE SURE YOU ALWAYS PARSE THE NUMBER YOU ARE ADDING AS AN INTEGER
    msg.channel.send(`<:check:411976443522711552> **User defined had ${args[1]} added/subtracted from their account.**`);
  });
};

exports.info = {
  name: 'add-money',
  aliases: ['remove-money','addmoney','removemoney'],
  usage: 'add-money [user] <amount>',
  description: 'add/subtract money from a users balance'
};
