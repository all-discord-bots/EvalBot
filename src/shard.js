/*
    The following code goes into it's own file, and you run this file
    instead of your main bot file.
*/

const Webhook = require('webhook-discord');
const wbhook = new Webhook(process.env.WEBHOOK_SHARD_LOGGER);
const path = require('path');
const { ShardingManager } = require('discord.js');

const ShardingManager = global.ShardingManager = new ShardingManager(path.resolve(__dirname, '../bin/cripsbot'), {
	respawn: true,
	token: process.env.BOT_TOKEN,
	totalShards: 'auto',
	delay: 15000
});

//Manager.spawn(Manager.totalShards, 15000);
ShardingManager.spawn();
ShardingManager.on('launch', (shard) => {
	wbhook.success('CripsBot', `Successfully launched shard \`${shard.id}\`.`);
	console.log(`Successfully launched shard ${shard.id}`);
});

ShardingManager.on('message', (shard,message) => {
	//wbhook.success('CripsBot', `Shard \`${shard.id}\` has broadcasted the message \`${message}\`.`);
	console.log(`Shard ${shard.id} has broadcasted the message ${message}.`);
});
