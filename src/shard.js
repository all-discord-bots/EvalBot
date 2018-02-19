/*
    The following code goes into it's own file, and you run this file
    instead of your main bot file.
*/

const Discord = require('discord.js');
const SpawnShards = require('../data/configs/config.json');
const Webhook = require("webhook-discord");
const Hook = new Webhook(process.env.WEBHOOK_SHARD_LOGGER);
const Manager = new Discord.ShardingManager('./src/bot.js', {
    respawn: true,
    //token: SpawnShards.botToken,
    token: process.env.BOT_TOKEN,
    totalShards: "auto"
});

let guilds = 0;
let users = 0;

Manager.spawn(this.totalShards, 15000);

/*
Manager.spawn(this.totalShards, 15000).then(shards => {
    TFS();
}).catch(e=> {
    let a = (new Error);
});

function TFS() {
    setTimeout(() => {
        getServs();
        setInterval(() => {
            getServs();
        }, 1000 * 60 * 5);
    }, 1000 * 10);
}

function getServs() {
    Manager.fetchClientValues('guilds.size').then(rst => {
        Manager.broadcastEval('var x=0;this.guilds.map(g => {x += g.memberCount});x;').then(r => {
            r = r.reduce((a, b) => a + b);
            let users = r;
            let g = rst.reduce((prev, val) => prev + val, 0);
            updateStats(g);
        }).catch(e=> {});
    }).catch(e=> {});
}

function updateStats(guilds) {

    let rqOptions = {
        headers: {
            Authorization: cfg.pwTok3
        },
        url: `https://bots.discord.pw/api/bots/${cfg.pwID}/stats`,
        method: 'POST',
        json: {
            "server_count": guilds
        }
    };

    rq(rqOptions, function (err, response, body) {
        if (err) {
            console.log(err)
        }

            console.log(body)
    });

    let rqCarbon = {
        url: `https://www.carbonitex.net/discord/data/botdata.php`,
        method: 'POST',
        json: {
            "server_count": guilds,
            "key": cfg.carbon_token
        }
    };

    rq(rqCarbon, function (err, response, body) {
        if (err) {
            console.log(err)
        }

    });

}
*/
Manager.on('launch', shard => Hook.success("Shard Launched!",`Successfully launched shard ${shard.id}`));// console.log(`Successfully launched shard ${shard.id}`));
