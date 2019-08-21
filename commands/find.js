const SQLite = require('better-sqlite3');
const redditLogin = new SQLite('./redditLogin.db');

module.exports = {
    name: 'find',
    alias: ['f'],
    guildOnly: true,
    run: async (client, msg, args) => {
        
        if (!args.length) return msg.reply('you have to give the name of a reddit account.');

        let account = args[0].replace(/.*u(ser?)\/(.+)/,'$1');

        let user = redditLogin.prepare('SELECT discord FROM redditLogin WHERE reddit = ?').get(account);

        if (!user) return msg.reply(`${account} is not linked to anyone.`);

        user = client.users.get(user.discord).tag;
        msg.reply(`${account}'s discord tag is ${user}`);
          
    }
}