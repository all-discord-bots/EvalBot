/*
    The following code goes into it's own file, and you run this file
    instead of your main bot file.
*/

const utils = require('./utils');
const Webhook = require('webhook-discord');
const wbhook = new Webhook(process.env.WEBHOOK_SHARD_LOGGER);
const path = require('path');
const { ShardingManager } = require('discord.js');

let collected_shards = global.collected_shards = [];

const ShardManager = new ShardingManager(path.resolve(__dirname, '../bin/cripsbot'), {
	respawn: true,
	token: process.env.BOT_TOKEN,
	totalShards: 'auto',
	delay: 15000
});

//Manager.spawn(Manager.totalShards, 15000);
ShardManager.spawn();
ShardManager.on('launch', (shard) => {
	try {
		collected_shards.push(shard);
		if (collected_shards.length >= ShardManager.totalShards) {
			utils.shards.shift();
			utils.shards.push(collected_shards);
			collected_shards = [];
		}
		wbhook.success('CripsBot', `Successfully launched shard \`${shard.id}\`.`);
		console.log(`Successfully launched shard ${shard.id}`);
	} catch (err) {
		console.error(err.toString());
	}
});

ShardManager.on('message', (shard,message) => {
	//wbhook.success('CripsBot', `Shard \`${shard.id}\` has broadcasted the message \`${message}\`.`);
	console.log(`Shard ${shard.id} has broadcasted the message ${message}.`);
});
