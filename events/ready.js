const { readdirSync } = require('fs');
const SQLite = require('better-sqlite3');

const redditLogin = new SQLite('./redditLogin.db');

module.exports = {
    name: 'ready',
    run: async (client) => {

        for (const file of readdirSync('../commands')) {
            let cmd = require(`../commands/${file}`);
            client.commands.set(cmd.name, cmd);
        }

        redditLogin.prepare("CREATE TABLE IF NOT EXISTS redditLogin(discord TEXT PRIMARY KEY, reddit TEXT NOT NULL)").run();
        console.log('Active!');

    }
}