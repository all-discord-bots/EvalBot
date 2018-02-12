exports.run = async (bot, msg) => {
  // const m = await msg.channel.send("Pinging...");
  var start = new Date().getTime();
  (await msg.channel.send("Pinging...").then((msg)=> {
    var end = new Date().getTime();
    //msg.edit(`Latency: \`${msg.createdTimestamp - msg.createdTimestamp}ms\`\nAPI Latency: \`${Math.round(bot.ping)}ms\``);
    msg.edit(`Latency: \`${end-start}ms\`\nAPI Latency: \`${Math.round(bot.ping)}ms\``);
  }));
};

exports.info = {
  name: 'ping',
  hidden: true,
  usage: 'ping',
  description: 'Get the API Latency'
};
