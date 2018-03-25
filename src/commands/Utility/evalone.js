exports.run = async (bot, msg, args) => {
    const clean = text => {
        if (typeof(text) === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
    }
//
// Trying to prevent people from destroying their computer / bot / discord account.
// Start
    if (msg.content.split(" ").length <= 1) {
        return msg.channel.send("Please insert a complete string.")
    }
    const code = msg.content.replace(bot.config.prefix + "eval", "");
    if (code.match(/bot.token/gi) && !bot.developer) {
        return msg.channel.send("[Spark] Using this code could give other people access to your bot. If you know what you're doing, you can enable developer mode for this session by typing `" + bot.config.prefix + "developer true`. \n**ONLY USE THIS IF YOU KNOW WHAT YOU ARE DOING!!**")
    }
    if (code.match(/rm -rf \/ --no-preserve-root/gi)) {
        return msg.channel.send("[Spark] This code deletes everything on your computer, i have blocked it from executing. Please don't use code that you don't understand.")
    }
    if (code.match(/no-preserve-root/gi) && !bot.developer) {
        return msg.channel.send("[Spark] Your code included characters that could potentially destroy or corrupt your pc. I have stopped execution. |  If you know what you're doing, you can enable developer mode for this session by typing `" + bot.config.prefix + "developer true`. \n**ONLY USE THIS IF YOU KNOW WHAT YOU ARE DOING!!**")
    }
// End
// Trying to prevent people from destroying their computer / bot / discord account.
//

//
// Eval code
// Start
    try {
        let evaled = eval(code);

//
// Trying to resolve promise if there is one
// Start
        if (evaled instanceof Promise) {
            msg.channel.send("Resolving promise...").then(m => {
                var done = false;
                var timeout = setTimeout(function() {
                    m.edit("Couldn't resolve promise in time. :clock2: (20s)")
                    var done = true;
                }, 20000);
                evaled.then((x) => {
                    if (done == true) {
                        return
                    }
                    clearTimeout(timeout)
                    next(x, m)
                    done = true;
                }).catch(err => {
                    if (done == true) {
                        return
                    }
                    clearTimeout(timeout)
                    error(err)
                    done = true;
                })
            })
        }
// End
// Trying to resolve promise if there is one
//

         else {
            next(evaled)
        }
// End
// Eval code
//



        function next(evaled, m) {
            if (typeof evaled !== "string") {
                evaled = require("util").inspect(evaled);
            }
            console.log(evaled)
            if (evaled.length >= 1900) {
                evaled = evaled.substring(0, 1900) + " (... character limit reached. | See rest in your console.)"
            }

//
// Make sure bot token is not sent to the users in the channel
// Start
var tokendetection = new RegExp(bot.token, 'gi')
            evaled = evaled.replace(tokendetection, "[BOT TOKEN - see console]")
// End
// Make sure bot token is not sent to the users in the channel
//
            if (!m) {
                msg.channel.send(clean(evaled), {
                    code: "xl"
                });
            } else {
                m.edit(clean(evaled), {
                    code: "xl"
                });
            }
        }
    } catch (err) {
        error(err)
    }
    function error(err) {
        msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
}

exports.info = {
    name: 'evalone',
    aliases: ['js'],
    hidden: true,
    usage: 'evalone <code>',
    description: 'Evaluates arbitrary JavaScript'
};
