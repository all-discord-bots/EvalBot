const { stripIndents } = require('common-tags');
const suits = ['♣', '♥', '♦', '♠'];
const faces = ['Jack','Queen','King'];

exports.run = async (bot,msg,args) => {
	const deckCount = 1;
	let decks = new Map();
	if (decks.has(msg.channel.id)) return msg.channel.send(`<:redx:411978781226696705> only one game a channel!`);
	try {
		decks.set(msg.channel.id, generateDeck(bot,deckCount));
		const dealerHand = [];
		draw(msg.channel, decks, dealerHand);
		draw(msg.channel, decks, dealerHand);
		const playerHand = [];
		draw(msg.channel, decks, playerHand);
		draw(msg.channel, decks, playerHand);
		const dealerInitialTotal = calculate(dealerHand);
		const playerInitialTotal = calculate(playerHand);
		if (dealerInitialTotal === 21 && playerInitialTotal === 21) {
			decks.delete(msg.channel.id);
			return msg.channel.send(`Well, both of you just hit blackjack. Right away. Rigged.`);
		} else if (dealerInitialTotal === 21) {
			decks.delete(msg.channel.id);
			return msg.channel.send(`Ouch, the dealer hit blackjack right away. Try again!`);
		} else if (playerInitialTotal === 21) {
			decks.delete(msg.channel.id);
			return msg.channel.send(`Wow, you hit blackjack right away! Lucky you!`);
		}
		let playerTurn = true;
		let win = false;
		let reason;
		while (!win) {
			if (playerTurn) {
				await msg.channel.send(stripIndents`
					**First Dealer Card:** ${dealerHand[0].display}

					**You (${calculate(playerHand)}):**
					${playerHand.map((card) => card.display).join('\n')}

					_Hit?_
				`);
				const hit = await bot.util.verify(msg.channel, msg.author);
				if (hit) {
					const card = draw(msg.channel, decks, playerHand);
					const total = calculate(playerHand);
					if (total > 21) {
						reason = `You drew ${card.display}, total of ${total}! Bust`;
						break;
					} else if (total === 21) {
						reason = `You drew ${card.display} and hit 21`;
						win = true;
					}
				} else {
					const dealerTotal = calculate(dealerHand);
					await msg.channel.send(`Second dealer card is ${dealerHand[1].display}, total of ${dealerTotal}.`);
					playerTurn = false;
				}
			} else {
				const initial = calculate(dealerHand);
				let card;
				if (inital < 17) card = draw(msg.channel, decks, dealerHand);
				const total = calculate(dealerHand);
				if (total > 21) {
					reason = `Dealer drew ${card.display}, total of ${total}! Dealer bust`;
					win = true;
				} else if (total >= 17) {
					const playerTotal = calculate(playerHand);
					if (total === playerTotal) {
						reason = `${card ? `Dealer drew ${card.display}, making it ` : ''}${playerTotal}-${total}`;
						break;
					} else if (total > playerTotal) {
						reason = `${card ? `Dealer drew ${card.display}, making it ` : ''}${playerTotal}-**${total}**`;
						break;
					} else {
						reason = `${card ? `Dealer drew ${card.display}, making it ` : ''}**${playerTotal}**-${total}`;
						win = true;
					}
				} else {
					await msg.channel.send(`Dealer drew ${card.display}, total of ${total}.`);
				}
			}
		}
		decks.delete(msg.channel.id);
		if (win) return msg.reply(`${reason}! You won!`);
		return msg.reply(`${reason}! Too bad.`);
	} catch (err) {
		decks.delete(msg.channel.id);
		console.log(err.toString());
		msg.channel.send(err.toString());
	}
};

function generateDeck(bot,deckCount) {
	const deck = [];
	for (let i = 0; i < deckCount; i++) {
		for (const suit of suits) {
			deck.push({
				value: 11,
				display: `${suit} Ace`
			});
			for (let j = 2; j <= 10; j++) {
				deck.push({
					value: j,
					display: `${suit} ${j}`
				});
			}
			for (const face of faces) {
				deck.push({
					value: 10,
					display: `${suit} ${face}`
				});
			}
		}
	}
	return bot.util.shuffle(deck);
}

function draw(channel, decks, hand) {
	const deck = decks.get(channel.id);
	const card = deck[0];
	deck.shift();
	hand.push(card);
	return card;
}

function calculate(hand) {
	return hand.sort((a, b) => a.value - b.value).reduce((a, b) => {
		let { value } = b;
		if (value === 11 && a + value > 21) value = 1;
		return a + value;
	}, 0);
}

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
