exports.run = async (bot, msg) => {
let i = 0;
let shardids = "";
let spaces;
let ss = " "; // ss stands for 'single spaced'
//while(i < parseInt(bot.shard.count)+1) { // search 'i' until it equals the current guilds shard id for numbers 0-9
while(i < parseInt(bot.shard.count)) { // search 'i' until it equals the current guilds shard id for numbers 0-9
  if (i < 10) {
    if (i === parseInt(bot.shard.id)) {
      spaces = "#  ";
    } else {
      spaces = "   ";
    }
  } else if (i > 9 && i < 100) { // search 'i' until it equals the current guilds shard id for numbers 10-99
    if (i === parseInt(bot.shard.id)) {
      spaces = "# ";
    } else {
      spaces = "  ";
    }
  } else if (i > 99 && i < 1000) { // search 'i' until it equals the current guilds shard id for numbers 100-999
    if (i === parseInt(bot.shard.id)) {
      spaces = "#";
    } else {
      spaces = " ";
    }
  }
  //shardids += "\n" + spaces + i;
  shardids += "\n" + spaces + i + ss + ss + ss + ss + ss + ss + "110ms" + ss + ss + ss + ss + ss + ss + "947" + ss + ss + ss + ss + ss + ss + "55,011" + ss + ss + ss + "281mb" + ss + ss + ss + ss + ss + ss + ss + "1 day";
  i++;
}
/*
* Shard # - 0
* Shard Ping - 124ms
* Shard Guilds # - 36,080
* Shard Users # - 2,218,146
* Shard Memery Usage , 9723mb
* Shard Uptime - 1 day
*/


msg.channel.send(`\`\`\`md
 shard${ss}|${ss}${ss}ping${ss}${ss}|${ss}${ss}guilds${ss}${ss}|${ss}${ss}users${ss}${ss}|${ss}memory${ss}|${ss}${ss}uptime${shardids}
 
 total:${ss}${ss}${ss}124ms${ss}${ss}${ss}36,080${ss}${ss}${ss}2,218,146${ss}${ss}9723mb${ss}${ss}${ss}${ss}${ss}${ss}${ss}1 day
\`\`\``);
};

exports.info = {
 name: 'shards',
 hidden: true,
 usage: 'shards',
 description: 'Displays information on each shard of the bot.'
};
