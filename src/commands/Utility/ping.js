exports.run = async (bot, msg) => {
  // const m = await msg.channel.send("Pinging...");
  (await msg.channel.send("Pinging...").then((msg)=>{
    msg.edit(`Latency: \`${msg.createdTimestamp - msg.createdTimestamp}ms\`\nAPI Latency: \`${Math.round(bot.ping)}ms\``);
  }));
};

exports.info = {
  name: 'ping',
  hidden: true,
  usage: 'ping',
  description: 'Get the API Latency'
};
