exports.run = async (bot, msg) => {
let i = 0;
let shardids = "";
let usersize = parseInt(bot.users.size);
let numguilds = parseInt(bot.guilds.size);
let botping = parseInt(Math.floor(bot.ping));
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
	let bspace;
	if (botping < 10) {
		bspace = `${ss}${ss}${ss}${ss}${ss}${ss}${botping}ms`;
	} else if (botping > 9 && botping < 100) {
		bspace = `${ss}${ss}${ss}${ss}${ss}${botping}ms`;
	} else if (botping > 999 && botping < 1000) {
		bspace = `${ss}${ss}${ss}${ss}${botping}ms`;
	} else if (botping > 9999 && botping < 10000) {
		bspace = `${ss}${ss}${ss}${botping}ms`;
	} else if (botping > 99999 && botping < 100000) {
		bspace = `${ss}${ss}${botping}ms`;
	} else if (botping > 999999 && botping < 1000000) {
		bspace = `${ss}${botping}ms`;
	}
	let gspace;
	if (numguilds < 10) {
		gspace = `${ss}${ss}${ss}${ss}${ss}${ss}${ss}${ss}${ss}${numguilds}`;
	} else if (numguilds > 9 && numguilds < 100) {
		gspace = `${ss}${ss}${ss}${ss}${ss}${ss}${ss}${ss}${numguilds}`;
	} else if (numguilds > 99 && numguilds < 1000) {
		gspace = `${ss}${ss}${ss}${ss}${ss}${ss}${ss}${numguilds}`;
	} else if (numguilds > 999 && numguilds < 10000) {
		gspace = `${ss}${ss}${ss}${ss}${ss}${ss}${numguilds}`;
	} else if (numguilds > 9999 && numguilds < 100000) {
		gspace = `${ss}${ss}${ss}${ss}${ss}${numguilds}`;
	} else if (numguilds > 99999 && numguilds < 1000000) {
		gspace = `${ss}${ss}${ss}${ss}${numguilds}`;
	} else if (numguilds > 999999 && numguilds < 10000000) {
		gspace = `${ss}${ss}${ss}${numguilds}`;
	} else if (numguilds > 9999999 && numguilds < 100000000) {
		gspace = `${ss}${ss}${numguilds}`;
	} else if (numguilds > 99999999 && numguilds < 1000000000) {
		gspace = `${ss}${numguilds}`;
	}
	let uspace;
	if (usersize < 10) {
		uspace = `${ss}${ss}${ss}${ss}${ss}${ss}${ss}${ss}${ss}${ss}${ss}${usersize}`;
	} else if (usersize > 9 && usersize < 100) {
		uspace = `${ss}${ss}${ss}${ss}${ss}${ss}${ss}${ss}${ss}${ss}${usersize}`;
	} else if (usersize > 99 && usersize < 1000) {
		uspace = `${ss}${ss}${ss}${ss}${ss}${ss}${ss}${ss}${ss}${usersize}`;
	} else if (usersize > 999 && usersize < 10000) {
		uspace = `${ss}${ss}${ss}${ss}${ss}${ss}${ss}${ss}${usersize}`;
	} else if (usersize > 9999 && usersize < 100000) {
		uspace = `${ss}${ss}${ss}${ss}${ss}${ss}${ss}${usersize}`;
	} else if (usersize > 99999 && usersize < 1000000) {
		uspace = `${ss}${ss}${ss}${ss}${ss}${ss}${usersize}`;
	} else if (usersize > 999999 && usersize < 10000000) {
		uspace = `${ss}${ss}${ss}${ss}${ss}${usersize}`;
	} else if (usersize > 9999999 && usersize < 100000000) {
		uspace = `${ss}${ss}${ss}${ss}${usersize}`;
	} else if (usersize > 99999999 && usersize < 1000000000) {
		uspace = `${ss}${ss}${ss}${usersize}`;
	} else if (usersize > 999999999 && usersize < 10000000000) {
		uspace = `${ss}${ss}${usersize}`;
	} else if (usersize > 9999999999 && usersize < 100000000000) {
		uspace = `${ss}${usersize}`;
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
 
 total:${bspace}${gspace}${uspace}${ss}${ss}9723mb${ss}${ss}${ss}${ss}${ss}${ss}${ss}1 day
\`\`\``);
};

exports.info = {
 name: 'shards',
 hidden: true,
 usage: 'shards',
 description: 'Displays information on each shard of the bot.'
};
