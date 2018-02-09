/*
    The following code goes into it's own file, and you run this file
    instead of your main bot file.
*/

const Discord = require('discord.js');
const SpawnShards = require('../data/configs/config.json');
const Manager = new Discord.ShardingManager('./src/bot.js', {
    token: SpawnShards.botToken,
    totalShards: "auto"
});
Manager.spawn(this.totalShards, 15000);
//const Manager = new Discord.ShardingManager('./src/bot.js');
//Manager.spawn(SpawnShards.shards); // Current set will spawn 1 shard // This example will spawn 2 shards (5,000 guilds);
//'auto'
