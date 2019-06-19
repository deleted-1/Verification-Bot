const Discord = require("discord.js"); 
const sqlite3 = require('sqlite3');

module.exports.run = async (client, message, args) => {
    const db = new sqlite3.Database('loginDetails.sqlite');

    db.run('UPDATE users SET username = "" WHERE userid = ?',[message.author.id],(err)=>{
        if(err) console.error(err.message);
    });

    message.channel.send('You have been logged out!');
} 

module.exports.help = {
   name: "logout"
}