const Discord = require('discord.js');
const economy = require('discord-eco');

exports.run = async (bot, msg, args) => {
  // Additional Tip: If you want to make the values guild-unique, simply add + msg.guild.id whenever you request.
  economy.fetchBalance(msg.author.id + msg.guild.id).then((i) => { // economy.fetchBalance grabs the userID, finds it, and puts the data with it into i.
    // Lets use an embed for This
    const embed = new Discord.RichEmbed()
      .setDescription(`**${msg.guild.name} Bank**`)
      .setColor(0xD4AF37) // You can set any HEX color if you put 0x before it.
      .addField('Account Holder',msg.author.username,true) // The TRUE makes the embed inline. Account Holder is the title, and message.author is the value
      .addField('Account Balance',i.money,true)
      // Now we need to send the message
      msg.channel.send({embed});
  });
};

exports.info = {
  name: 'balance',
  aliases: ['bal','money'],
  usage: 'balance',
  description: 'shows your current balance'
};
