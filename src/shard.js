/*
    The following code goes into it's own file, and you run this file
    instead of your main bot file.
*/

const Webhook = require('webhook-discord');
const wbhook = new Webhook(process.env.WEBHOOK_SHARD_LOGGER);
const Discord = require('discord.js');
const SpawnShards = require('../data/configs/config.json');
const Manager = new Discord.ShardingManager('./src/bot.js', {
    respawn: true,
    //token: SpawnShards.botToken,
    token: process.env.BOT_TOKEN,
    totalShards: "auto"
});

let guilds = 0;
let users = 0;

Manager.spawn(this.totalShards, 15000);
Manager.on('launch', (shard) => {
	wbhook.success('CripsBot', `Successfully launched shard \`${shard.id}\`.`);
	console.log(`Successfully launched shard ${shard.id}`);
});
