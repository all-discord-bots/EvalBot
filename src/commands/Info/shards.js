exports.run = async (bot, msg) => {
let text = "";
let shardcount = [];
//while (i < gshards) { text += i; shardcount = i; i++; msg.channel.send(i - 1); }
let listshards;
let gshards = bot.shard.count;
var i = 0;
while (i < gshards + 1) {
text += i;
shardcount = i;
i++;
let tag;
if (i === bot.shard.id) {
if (i < 10) {
tag = "#  ";
} else if (i > 9 && i < 100) {
tag = "# ";
}
} else {
if (i < 10) {
tag = "   ";
} else if (i > 9 && i < 100) {
tag = "  ";
}
listshards = tag + i - 1;
}
msg.channel.send(`\`\`\`md
 shard |  ping  |  guilds  |  users  | memory |  uptime\n
${listshards + "\n"}
\`\`\``);
};

exports.info = {
name: 'shards',
hidden: true,
usage: 'shards',
description: 'Displays information on each shard of the bot.'
};
