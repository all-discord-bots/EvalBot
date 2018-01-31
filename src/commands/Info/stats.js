const formatTime = (time) => {
    let seconds = time[0] + time[1] / 1e9;

    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    return `${hours.toFixed(0)}h ${minutes.toFixed(0)}m ${seconds.toFixed(0)}s`;
};

const activityTypes = [
    'playing',
    'streaming',
    'listening to',
    'watching',
];

exports.run = async (bot, msg) => {
  if (msg.author.id !== bot.config.botCreatorID) return;
    const game = bot.user.presence.game || {};
    (await msg.channel.send("Loading stats...").then((msg)=>{
        msg.edit({
        //embed: bot.utils.embed('EvalBot Stats', '***This message will dissappear in 30 seconds.***', [
        embed: bot.utils.embed('EvalBot Stats', '***Stats***', [
//            {
//                name: ':outbox_tray: Messages sent',
//                value: bot.managers.stats.get('messages-sent') || 0,
//            },
//            {
//                name: ':inbox_tray: Messages received',
//                value: bot.managers.stats.get('messages-received') || 0,
//            },
//            {
//                name: ':mailbox: Mentions',
//                value: bot.managers.stats.get('mentions') || 0
//            },
            {
                name: ':baby: Users',
                value: `${bot.guilds.reduce((mem, g) => mem += g.memberCount, 0)}`,
            },
            {
                name: ':desktop: Servers',
                value: `${bot.guilds.size.toLocaleString()}`,
            },
            {
                name: ':keyboard: Channels',
                value: `${bot.channels.size.toLocaleString()}`,
            },
            {
                name: ':thinking: RAM usage',
                value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
            },
            {
                name: ':stopwatch: Shard Uptime',
                value: formatTime(process.hrtime(bot.managers.stats.get('start-time')))
            },
//            {
//                name: ':video_game: Game',
//                value: (game.name) ? `*${activityTypes[game.type]}* ${game.name} ${game.streaming ? `[(Streaming)](${game.url})` : ''}` : 'none'
//            },
            {
                name: ':robot: Total Shards',
                value: `${bot.options.shardCount.toLocaleString()}`,
            },
            {
                name: ':1234: Shard ID',
                value: `${bot.options.shardId.toLocaleString()}`,
            }
        ], { inline: true })
    }); //.delete(30000);
  }));
};

exports.info = {
    name: 'stats',
    usage: 'stats',
    description: 'Shows you stats about EvalBot'
};
