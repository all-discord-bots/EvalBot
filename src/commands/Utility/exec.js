const { exec } = require('child_process');
const username = require('os').userInfo().username;
//const rdcli = require('redis-cli');
const events = require('events');
const pm2 = require('pm2');
const express = require('express');

exports.run = (bot, msg, args) => {
    if (msg.author.id !== bot.config.botCreatorID) return;
    let parsed = bot.utils.parseArgs(args, 's', 'l:');

    if (parsed.length < 1) return msg.channel.send(`<:redx:411978781226696705> You must provide a command to run!`).catch(console.error);

    let ps = exec(parsed.leftover.join(' '));
    if (!ps) return msg.channel.send(`<:redx:411978781226696705> Failed to start process!`).catch(console.error);

    if (parsed.options.s) {
        return;
    }

    let opts = {
        prefix: `\`\`\`${parsed.options.l || 'bash'}\n`,
        suffix: '\n```',
        delay: 10,
        cutOn: '\n'
    };

    ps.stdout.on('data', data => bot.utils.sendLarge(msg.channel, clean(data), opts));
    ps.stderr.on('data', data => bot.utils.sendLarge(msg.channel, clean(data), opts));
};

const clean = function (data) {
    return `${data}`
        .replace(/`/g, '\\$&')
        .replace(new RegExp(username, 'g'), '<Hidden>')
        .replace(/\[[0-9]*m/g, '');
};

exports.info = {
    name: 'execute',
    hidden: true,
    aliases: ['exec'],
    usage: 'exec <command>',
    description: 'Executes a command in the console',
    options: [
        {
            name: '-s',
            description: 'Runs in silent mode, not showing any console output'
        },
        {
            name: '-l',
            usage: '-l <lang>',
            description: 'Sets the language of the outputted code block'
        }
    ]
};
