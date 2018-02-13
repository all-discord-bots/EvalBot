exports.run = async (bot, msg) => {
    if (msg.author.id !== bot.config.botCreatorID) return;
    (await msg.channel.send(`<:check:411976443522711552> Rebooting bot...`).then((msg)=>{
		(await process.exit(1).then((msg)=> {
			msg.edit(`<:check:411976443522711552> Bot rebooted successfully.`);
		}));
	}));
};

exports.info = {
    name: 'reboot',
    hidden: true,
    usage: 'reboot',
    description: 'Reboots the bot'
};
