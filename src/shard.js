/*
    The following code goes into it's own file, and you run this file
    instead of your main bot file.
*/

const Discord = require('discord.js');
const Manager = new Discord.ShardingManager('./src/bot.js');
Manager.spawn(1); // Current set will spawn 1 shard // This example will spawn 2 shards (5,000 guilds);
