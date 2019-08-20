const { Client, Collection } = require('discord.js');
const { readdir } = require('fs');
const { token } = require('./Util/config.json');

const client = new Client();
const SQLite = require('better-sqlite3');
const redditLogin = new SQLite('./Util/redditLogin.db');

client.commands = new Collection();
readdir('./commands',(err,files) => {
    for (const file of files) {

        let cmd = require(`./commands/${file}`);
        client.commands.set(cmd.name,cmd);

    }
});

client.on('ready',()=>{

    console.log('Client Details');
    console.log(`Name: ${client.user.username}`);
    console.log(`ID: ${client.user.id}`);
    console.log('-------------------------');

    redditLogin.prepare("CREATE TABLE IF NOT EXISTS redditLogin(discord TEXT PRIMARY KEY, reddit TEXT NOT NULL)").run();
});

client.on('message',(msg)=>{

    let msgArray = msg.content.split(" ");
    let cmd = client.commands.get(msgArray[0].slice(1)) || client.commands.find(cmd => cmd.alias.includes(msgArray[0].slice(1)))
    let args = msgArray.slice(1);
    
    if (!msg.content.startsWith('~') || !cmd) return;
    if (cmd.guildOnly && !msg.guild) return msg.reply('This command does not work in DMs, it will only work in a server.');

    cmd.run(client, msg, args);

});

client.login(token);