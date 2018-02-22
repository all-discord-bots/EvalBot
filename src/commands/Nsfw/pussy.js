const Pornhub = require("pornhub-api")
const Videos = new Pornhub.Videos()

exports.run = async (bot, msg, args) => {
if (args.length < 1) return msg.channel.send(`<:redx:411978781226696705> Please provide a search string!`).catch(console.error);
if (!msg.channel.nsfw) return msg.channel.send(`<:redx:411978781226696705> This channel has not been marked as NSFW!`).catch(console.error);
let gbot = msg.guild.members.get(bot.user.id);
if (!gbot.hasPermission(0x00008000)) return msg.channel.send(`<:redx:411978781226696705> I am missing \`Attach Files\`!`).catch(console.error);
if (!msg.member.hasPermission('ATTACH_FILES')) return msg.channel.send(`<:redx:411978781226696705> You are missing the permissions \`Attach Files\`!`).catch(console.error);
let searchqueue = args.join(' ');

Videos.search({
    search: `${searchqueue}`
}).then(videos => {
    console.log(videos);
}).catch(console.error);
};

exports.info = {
  name: 'pornhub',
  aliases: ['phub','ph','pornh','p0rnhub','cornhub','c0rnhub','p0rnh','porn-hub','p0rn-hub'],
  usage: 'pornhub <search>',
  description: 'Sends a video straight from pornhub.'
};
