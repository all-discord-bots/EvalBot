/*
    The following code goes into it's own file, and you run this file
    instead of your main bot file.
*/

const Webhook = require('webhook-discord');
const wbhook = new Webhook(process.env.WEBHOOK_SHARD_LOGGER);
const { ShardingManager } = require('discord.js');
const Manager = new ShardingManager('./src/bot.js', {
    respawn: true,
    //token: SpawnShards.botToken,
    token: process.env.BOT_TOKEN,
    totalShards: 1
});

console.log(`BOT_TOKEN: ${process.env.BOT_TOKEN}`);

let guilds = 0;
let users = 0;

console.log(`Value: ${this.totalShards} || Type: ${typeof(this.totalShards)} || ManagerConstValue: ${Manager.totalShards}`);
Manager.spawn(this.totalShards, 15000);
//Manager.spawn();
Manager.on('launch', (shard) => {
	wbhook.success('CripsBot', `Successfully launched shard \`${shard.id}\`.`);
	console.log(`Successfully launched shard ${shard.id}`);
});
