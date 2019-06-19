const Discord = require("discord.js"); 
const sqlite3 = require('sqlite3')

module.exports.run = async (client, message, args) => {
    if(!message.guild)  return message.channel.send('This command only works in a guild!');
    if(message.mentions.members) args[0] = message.mentions.members.first().user;
    else    args[0] = client.users.find(u=>u.username.includes(args[0])&&message.guild.members.get(u.id));

    if(!args[0]) return message.channel.send('Invalid user.');
    
    args[0] = args[0].id
    const db = new sqlite3.Database('loginDetails.sqlite');
    
    db.get('SELECT * FROM users WHERE userid = ?',[args[0]],(err,row)=>{
        if(err) return console.error(err.message);        
        
        return row 
            ?   message.channel.send(`${message.author}'s reddit account is ${row.username}`)
            :   message.channel.send('This person did not link their reddit account!');
   
    });
} 

module.exports.help = {
   name: "whois"
}