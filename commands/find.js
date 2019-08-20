const SQLite = require('better-sqlite3');
const redditLogin = new SQLite('./Util/redditLogin.db');

module.exports = {
    name: 'find',
    alias: ['f'],
    description:'Find the discord user the reddit account belongs to.',
    guildOnly: true,
    run: async (client, msg, args) => {
        
        if (!args.length) msg.reply('you have to give the name of a reddit account.');

        let account = args[0].replace(/.*u(ser?)\/(.+)/,'$1');

        let userid = redditLogin.prepare('SELECT discord FROM redditLogin WHERE reddit = ?').get(account);
        let user = client.users.get(userid).tag;
        msg.reply(`${account}'s discord tag is ${user}`);
          
    }
}