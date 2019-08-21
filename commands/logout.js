const SQLite = require('better-sqlite3');
const redditLogin = new SQLite('./redditLogin.db');

module.exports = {
    name: 'logout',
    alias: ['signout'],
    guildOnly: false,
    run: async (client, msg, args) => {

        try{
            redditLogin.prepare("DELETE FROM redditLogin WHERE discord = ?").run(msg.author.id);
            msg.reply('successfully logged out.');       
        }catch(err){
            console.log(err.message);
            msg.reply('you were not logged in.');
        }

    }
}