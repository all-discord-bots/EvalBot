exports.run = async (bot, msg) => {
	if (msg.author.id !== bot.config.botCreatorID) return;
	let i = 0;
	let shardids = "";
	let usersize = parseInt(bot.users.size);
	let numguilds = parseInt(bot.guilds.size);
	let botping = parseInt(Math.floor(bot.ping));
	let spaces;
	let ss = " "; // ss stands for 'single spaced'
	let a = 0;
	while(i < parseInt(bot.shard.count)) { // search 'i' until it equals the current guilds shard id for numbers 0-9
	let time = setInterval(function() {
		if (a == 3) {
			clearInterval(time);
		}
		bot.shard.broadcastEval('bot.guilds.size').then(results => {
			let sguildsone = results[i];
			bot.managers.config.set(`Shard ${i}`, {'mcount': sguildsone});
			
		}).catch(console.error);
		a++;
	}, 500);
		let title = `Shard ${i}`;
		let sguilds = bot.config[title].mcount;
		// begin the shard id specifier / mapper
		if (i < 10) {
			if (i === parseInt(bot.shard.id)) {
				spaces = "#  ";
			} else {
				spaces = "   ";
			}
		} else if (i > 9 && i < 100) { // search 'i' until it equals the current guilds shard id for numbers 10-99
			if (i === parseInt(bot.shard.id)) {
				spaces = "# ";
			} else {
				spaces = "  ";
			}
		} else if (i > 99 && i < 1000) { // search 'i' until it equals the current guilds shard id for numbers 100-999
			if (i === parseInt(bot.shard.id)) {
				spaces = "#";
			} else {
				spaces = " ";
			}
		}
		// end the shard id specifier / mapper
		// begin guild count per shard
		//let sguilds;
		let gcount;
		if (sguilds < 10) {
			gcount = `${ss}${ss}${ss}${ss}${ss}${ss}${ss}${ss}${sguilds}`;
		} else if (sguilds > 9 && sguilds < 100) {
			gcount = `${ss}${ss}${ss}${ss}${ss}${ss}${ss}${sguilds}`;
		} else if (sguilds > 99 && sguilds < 1000) {
			gcount = `${ss}${ss}${ss}${ss}${ss}${ss}${sguilds}`;
		} else if (sguilds > 999 && sguilds < 10000) {
			gcount = `${ss}${ss}${ss}${ss}${ss}${sguilds}`;
		} else if (sguilds > 9999 && sguilds < 100000) {
			gcount = `${ss}${ss}${ss}${ss}${sguilds}`;
		} else if (sguilds > 99999 && sguilds < 1000000) {
			gcount = `${ss}${ss}${ss}${sguilds}`;
		} else if (sguilds > 999999 && sguilds < 10000000) {
			gcount = `${ss}${ss}${sguilds}`;
		} else if (sguilds > 9999999 && sguilds < 100000000) {
			gcount = `${ss}${sguilds}`;
		}
		// end guild count per shard
		shardids += "\n" + spaces + i + ss + ss + ss + ss + ss + ss + "110ms" + gcount + ss + ss + ss + ss + ss + ss + "55,011" + ss + ss + ss + "281mb" + ss + ss + ss + ss + ss + ss + ss + "1 day";
		i++;
	}
	/*
	* Shard # - 0
	* Shard Ping - 124ms
	* Shard Guilds # - 36,080
	* Shard Users # - 2,218,146
	* Shard Memery Usage , 9723mb
	* Shard Uptime - 1 day
	*/
	
	let tping;
	if (botping < 10) {
		tping = `${ss}${ss}${ss}${ss}${ss}${botping}ms`; // 1
	} else if (botping > 9 && botping < 100) {
		tping = `${ss}${ss}${ss}${ss}${botping}ms`;
	} else if (botping > 99 && botping < 1000) {
		tping = `${ss}${ss}${ss}${botping}ms`;
	} else if (botping > 999 && botping < 10000) {
		tping = `${ss}${ss}${botping}ms`;
	} else if (botping > 9999 && botping < 100000) {
		tping = `${ss}${botping}ms`;
	}
	let tguilds;
	if (numguilds < 10) {
		tguilds = `${ss}${ss}${ss}${ss}${ss}${ss}${ss}${ss}${numguilds}`; // 1
	} else if (numguilds > 9 && numguilds < 100) {
		tguilds = `${ss}${ss}${ss}${ss}${ss}${ss}${ss}${numguilds}`;
	} else if (numguilds > 99 && numguilds < 1000) {
		tguilds = `${ss}${ss}${ss}${ss}${ss}${ss}${numguilds}`;
	} else if (numguilds > 999 && numguilds < 10000) {
		tguilds = `${ss}${ss}${ss}${ss}${ss}${numguilds}`;
	} else if (numguilds > 9999 && numguilds < 100000) {
		tguilds = `${ss}${ss}${ss}${ss}${numguilds}`;
	} else if (numguilds > 99999 && numguilds < 1000000) {
		tguilds = `${ss}${ss}${ss}${numguilds}`;
	} else if (numguilds > 999999 && numguilds < 10000000) {
		tguilds = `${ss}${ss}${numguilds}`;
	} else if (numguilds > 9999999 && numguilds < 100000000) {
		tguilds = `${ss}${numguilds}`;
	}
	let tusers;
	if (usersize < 10) {
		tusers = `${ss}${ss}${ss}${ss}${ss}${ss}${ss}${ss}${ss}${ss}${ss}${usersize}`;
	} else if (usersize > 9 && usersize < 100) {
		tusers = `${ss}${ss}${ss}${ss}${ss}${ss}${ss}${ss}${ss}${ss}${usersize}`;
	} else if (usersize > 99 && usersize < 1000) {
		tusers = `${ss}${ss}${ss}${ss}${ss}${ss}${ss}${ss}${ss}${usersize}`;
	} else if (usersize > 999 && usersize < 10000) {
		tusers = `${ss}${ss}${ss}${ss}${ss}${ss}${ss}${ss}${usersize}`;
	} else if (usersize > 9999 && usersize < 100000) {
		tusers = `${ss}${ss}${ss}${ss}${ss}${ss}${ss}${usersize}`;
	} else if (usersize > 99999 && usersize < 1000000) {
		tusers = `${ss}${ss}${ss}${ss}${ss}${ss}${usersize}`;
	} else if (usersize > 999999 && usersize < 10000000) {
		tusers = `${ss}${ss}${ss}${ss}${ss}${usersize}`;
	} else if (usersize > 9999999 && usersize < 100000000) {
		tusers = `${ss}${ss}${ss}${ss}${usersize}`;
	} else if (usersize > 99999999 && usersize < 1000000000) {
		tusers = `${ss}${ss}${ss}${usersize}`;
	} else if (usersize > 999999999 && usersize < 10000000000) {
		tusers = `${ss}${ss}${usersize}`;
	} else if (usersize > 9999999999 && usersize < 100000000000) {
		tusers = `${ss}${usersize}`;
	}

msg.channel.send(`\`\`\`md
 shard${ss}|${ss}${ss}ping${ss}${ss}|${ss}${ss}guilds${ss}${ss}|${ss}${ss}users${ss}${ss}|${ss}memory${ss}|${ss}${ss}uptime${shardids}
 
 total:${tping}${tguilds}${tusers}${ss}${ss}9723mb${ss}${ss}${ss}${ss}${ss}${ss}${ss}1 day
\`\`\``);
};

exports.info = {
	name: 'shards',
	ownerOnly: true,
	hidden: true,
	usage: 'shards',
	description: 'Displays information on each shard of the bot.'
};
