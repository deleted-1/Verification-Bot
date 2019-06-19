const Discord = require("discord.js"); 
const sqlite3 = require('sqlite3');

module.exports.run = async (client, message, args) => {
    if(!message.guild)  return message.channel.send('This command only works in a guild!');
    
    const db = new sqlite3.Database('loginDetails.sqlite');

    db.get('SELECT * FROM users WHERE username = ?',[args[0]],(err,row)=>{
        if(err) return console.error(err.message)

        return row
            ?   message.channel.send(`${args[0]} belongs to ${message.guild.members.find(m=>m.user.id===row.userid)}`)
            :   message.channel.send('That account belongs to noone in the server!')
    });
} 

module.exports.help = {
   name: "find"
}