const Discord = require('discord.js');
const stripIndents = require('common-tags').stripIndents;
const fetch = require('node-fetch');

exports.run = async (bot, msg, args) => {
	try {
		const client = bot;
		const message = msg;
		const guild = msg.guild;
		const channel = msg.channel;
		
		if (msg.author.id !== bot.config.botCreatorID) return;
		let parsed = bot.utils.parseArgs(args, ['l:', 'i', 'q']);
		let lang = parsed.options.l || '';

		let code = parsed.leftover.join(' ');
		let output;

		try {
			output = await eval(code);
		} catch (err) {
			let message = err;
			if (err && err.response && err.response.body && err.response.body.message) {
				message = err.response.body.message;
			}

			return errorHandler(msg, bot, code, `${message}`);
		}

		if (parsed.options.q) {
			return;
		}

		if (typeof output !== 'string') {
			output = require('util').inspect(output);
		}

		if (!lang) {
			lang = 'javascript';
		}

		output = clean(output)
			.replace(new RegExp(bot.utils.quoteRegex(bot.token), 'g'), 'BOT_TOKEN')
			.replace(new RegExp(bot.utils.quoteRegex(process.env.DBL_TOKEN_AUTH), 'g'), 'DBL_TOKEN_AUTH')
			.replace(new RegExp(bot.utils.quoteRegex(process.env.DBL_WEBHOOK_AUTH), 'g'), 'DBL_WEBHOOK_AUTH')
			.replace(new RegExp(bot.utils.quoteRegex(process.env.CONNECTION_LOGGER), 'g'), 'CONNECTION_LOGGER')
			.replace(new RegExp(bot.utils.quoteRegex(process.env.DATABASE_URL), 'g'), 'DATABASE_URL')
			.replace(new RegExp(bot.utils.quoteRegex(process.env.LYRICS_API_TOKEN), 'g'), 'LYRICS_API_TOKEN')
			.replace(new RegExp(bot.utils.quoteRegex(process.env.TERMINAL_TOKEN), 'g'), 'TERMINAL_TOKEN')
			.replace(new RegExp(bot.utils.quoteRegex(process.env.WEBHOOK_CONSOLE_LOGGER), 'g'), 'WEBHOOK_CONSOLE_LOGGER')
			.replace(new RegExp(bot.utils.quoteRegex(process.env.YOUTUBE_API_KEY), 'g'), 'YOUTUBE_API_KEY')
			.replace(new RegExp(bot.utils.quoteRegex(process.env.WEBHOOK_MESSAGES_DELETED_LOGGER), 'g'), 'WEBHOOK_MESSAGES_DELETED_LOGGER')
			.replace(new RegExp(bot.utils.quoteRegex(process.env.WEBHOOK_SHARD_LOGGER), 'g'), 'WEBHOOK_SHARD_LOGGER')
			.replace(new RegExp(bot.utils.quoteRegex(process.env.PASTEBIN_KEY), 'g'), 'PASTEBIN_KEY')
			.replace(new RegExp(bot.utils.quoteRegex(process.env.BOTLIST_SPACE_TOKEN_AUTH), 'g'), 'BOTLIST_SPACE_TOKEN_AUTH');
			
		const displayedOutput = output.length < 1500
			? `\n\`\`\`${lang}\n${output}\n\`\`\``
			: `\n${await tryUpload(bot, output)}\n`;

		msg.channel.send({
			embed: bot.utils.embed('', stripIndents`
					**Input:**\n\`\`\`js\n${code}\n\`\`\`
					**Output:**${displayedOutput}
					`)
		});

		if (output.length > 1500 && parsed.options.i) {
			bot.utils.sendLarge(msg.channel, output, {
				prefix: '```' + lang + '\n',
				suffix: '```',
				cutOn: ',',
				cutAfter: true
			});
		}
	} catch (err) {
		console.error(err.toString());
	}
};

const tryUpload = async (bot, content) => {
	try {
		const { url } = await bot.utils.textUpload(content);
		if (!url) {
			throw 'Failed to upload!';
		}
		return url;
	} catch (err) {
		console.error(err.toString());
	}
};

const errorHandler = (msg, bot, code, err) => {
	try {
		msg.channel.send({
			embed: bot.utils.embed('', `**Input:**\n\`\`\`js\n${code}\n\`\`\`\n:x: **Error!**\n\`\`\`xl\n${clean(err)}\n\`\`\``, [], {
				color: '#ff0000'
			})
		});
	} catch (err) {
		console.error(err.toString());
	}
};

// Prevent @mentions, #channels or code blocks inside code blocks.
const clean = (text) => {
	try {
		return text.replace(/([`@#])/g, '$1\u200b');
	} catch (err) {
		console.error(err.toString());
	}
}

exports.info = {
	name: 'eval',
	aliases: ['js'],
	hidden: true,
	usage: 'eval <code>',
	examples: [
		'eval bot.user.id'
	],
	description: 'Evaluates arbitrary JavaScript',
	options: [
		{
			name: '-l',
			usage: '-l <lang>',
			description: 'Sets the output code-block syntax language'
		},
		{
			name: '-i',
			usage: '-i',
			description: 'Inline extra-long output in addition to uploading to hastebin'
		},
		{
			name: '-q',
			usage: '-q',
			description: 'Does not print any output'
		}
	]
};
