const SQLite = require('better-sqlite3');
const snoowrap = require('snoowrap');
const credentials = require('../Util/credentials.json');

const redditLogin = new SQLite('./Util/redditLogin.db');
const r = new snoowrap(credentials);

module.exports = {
    name: 'login',
    alias: ['signin','l'],
    guildOnly: false,
    run: async (client, msg, args) => {

        let account = redditLogin.prepare('SELECT reddit FROM redditLogin WHERE discord = ?').get(msg.author.id);

        if (!args.length) return msg.reply('you have to enter the reddit account you would like to sign into.');
        if (account) return msg.reply('you are already logged in. Logout to login as a different reddit user.');

        let code = '';
        for(let i = 0; i < Math.floor(Math.random()*10)+10; i++)
            code += Math.floor(Math.random()*36).toString(36);

        r.composeMessage({
            to: args[0].replace(/.*u(ser?)\/(.+)/,'$1'),
            subject: 'Verification Code',
            text: code
        });

        if (msg.guild) await msg.channel.send('Sent information to your DMs :thumbsup:');
        await msg.author.send('I have sent a message to your reddit account. Please check your mail then place verification code here.');
        const filter = m => m.content === code;
        await msg.author.dmChannel.awaitMessages(filter, {max:1, time: 60000})
            .then(async responses => {
                
                if (responses.first().content == code) {

                    redditLogin.prepare("INSERT INTO redditLogin(discord,reddit) VALUES(@discord, @reddit)").run({
                        discord:msg.author.id,
                        reddit:args[0]
                    });

                    msg.author.send('you are now successfully logged into '+args[0].replace(/.*u(ser?)\/(.+)/,'$1'));

                }
            })
            .catch(err => {
                console.log(err)
                if (err) msg.author.send('command timed out or you entered the incorrect verification code.');
            });

    }
}