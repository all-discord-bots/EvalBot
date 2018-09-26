const { MessageEmbed } = require('discord.js');

module.exports = async (bot,msg,args) => {
	let bet = 50; //Number(args[0]);
	let min_bet = 50;
	if (!bet) {
		return await msg.channel.send(new MessageEmbed()
			.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
			.addField('Invalid usage', `bj \`<bet>\``)
			.setColor('#FC2323'));
	}
	
	if (bet < min_bet) {
		return await msg.channel.send(new MessageEmbed()
			.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
			.setDescription(`<:redx:411978781226696705> You **must** bet at least **${min_bet}**`)
			.setColor('#FC2323'));
	}
	
	// Cards Variables
	const deck = [],
		suits = ['♥', '♦', '♠', '♣'],
		values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
	
	// Creating deck
	for (const value of values) {
		for (const suit of suits) {
			let points = parseInt(value) || (value === 'A' ? 11 : 10)
			deck.push({
				value,
				suit,
				points
			});
		}
	}
	
	// Shuffles the deck
	for (let i = deck.length - 1; i > 0; i--) {
		let r = ~~(Math.random() * (i + 1));
		// Switches cards
		[deck[i], deck[r]] = [deck[r], deck[i]]
	}
	class Player {
		constructor( /*bet = null, split = false*/ ) {
			this._cards = [];
			/*this.bet = bet;
			this.split = split;*/
		}
		
		hit() {
			this._cards.push(deck.shift());
		}
		
		double() {
			// this.bet *= 2;
			bet *= 2
			this.hit();
		}
		
		get points() {
			return this._cards.map((c) => c.points)
		}
		
		get value() {
			let val = this.points.reduce((a,b) => a + b);
			let aces = this.points.filter((p) => p === 11).length;
			while (val > 21 && aces--)
				val -= 10;
			
			if (isNaN(val)) throw new Error('Value is NaN');
			return val;
		}
		
		get print() {
			return this._cards.map((a) => a.value + a.suit).join(' ');
		}
	}
	
	// Declaring player and dealer
	const player = new Player( /*bet*/ );
	const dealer = new Player();
	
	// To start the game - Player - 2 cards / Dealer - 1
	player.hit();
	player.hit();
	player.hit();
	
	let EmbedObj = new MessageEmbed()
		.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
		.setDescription('Type `hit` to draw another card, `double` to double down, or `stand` to pass.')
		.addField(`Your hand`, player.print + "\n\nValue: " + player.value, true)
		.addBlankField(true)
		.addField("Dealer hand", dealer.print + "\n\nValue: " + dealer.value, true)
		.setColor("#4286f4");
	const start = await msg.channel.send(EmbedObj);
	
	if (player.value === 21) {
		if (dealer.value === 21) return await start.edit(EmbedObj.setDescription(`:recycle: **DRAW  returned**`).setColor('#f9f400'));
		
		return await start.edit(EmbedObj.setDescription(`:b:**BLACKJACK ${bet * 1.5}**`).setColor('#000000'));
	}
	
	// BLUE - #4286f4 - START
	// RED - #f20202 - LOST
	// GREEN - #00f91d - WON'
	// YELLOW - #f9f400 - EVEN
	// BLACK - #000000 - Blackjack
	
	// Making a filter for all the available commands once entered a blackjack game
	let turn = 0,
		state = true;
	const filter = (m) => ['hit', 'double', 'doubledown', 'double down', 'stand'].includes(m.content.toLowerCase()) && m.author.id === msg.author.id;
	
	const collector = msg.channel.createMessageCollector(filter);
	collector.on('collect', async (m) => {
		turn++;
		let cmd = m.content.toLowerCase();
		switch (cmd) {
			// fall through
			case 'double down':
			case 'doubledown':
				cmd = 'double';
			case 'double':
				if (turn !== 1) return m.reply("You can only double on the first turn");
				state = false;
			case 'hit':
				player[cmd]();
				break;
			/*case 'split':
				if (turn !== 1) return m.reply("You can only double on the first turn");
				break;
				*/
			default:
				return collector.stop('Player Stand');
		}
		
		EmbedObj = new MessageEmbed()
			.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
			.setDescription('Type `hit` to draw another card, `double` to double down, or `stand` to pass.')
			.addField(`Your hand`, player.print + "\n\nValue: " + player.value, true)
			.addBlankField(true)
			.addField("Dealer hand", dealer.print + "\n\nValue: " + dealer.value, true)
			.setColor('#4286f4');
		await start.edit(EmbedObj);
		(player.value > 20 || !state) && collector.stop('Player ' + (state ? (player.value > 21 ? 'Bust' : '21') : 'Double'))
	});
	collector.once('end', async (c,reason) => {
		// console.log(reason);
		if (player.value > 21) return start.edit(EmbedObj.setDescription(`:outbox_tray: **LOST - ${bet}**`).setColor("#f20202")); // Player bust
		while (dealer.value < 17) // Dealer's turn
			dealer.hit()
		EmbedObj = new MessageEmbed()
			.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
			.addField(`Your hand`, player.print + '\n\nValue: ' + player.value, true)
			.addBlankField(true)
			.addField("Dealer hand", dealer.print + "\n\nValue: " + dealer.value, true)
			
		if (dealer.value > 21) return start.edit(EmbedObj.setDescription(`:inbox_tray: **WON ${bet}**`).setColor('#00f91d')); // Dealer busted - WON
		// [Lose, Draw, Win] <[Description,Color]>
		const descClr = [
			[`:outbox_tray: **LOST - ${bet}**`, "#f20202"],
			[`:recycle: **DRAW returned**`, '#f9f400'],
			[`:inbox_tray: **WON ${bet}**`, '#00f91d']
		]
		//Math.sign(n) returns: -1 when n is negative, 0/-0 when n is exactly 0/-0, 1 when n is positive
		const [desc, clr] = descClr[Math.sign(player.value - dealer.value) + 1];
		start.edit(EmbedObj.setDescription(desc).setColor(clr));
	});
};

exports.info = {
	name: 'blackjack',
	ownerOnly: true,
	hidden: true,
	aliases: ['bj'],
	usage: 'blackjack',
	examples: [
		'blackjack'
	],
	description: 'Play a game of blackjack.'
};
