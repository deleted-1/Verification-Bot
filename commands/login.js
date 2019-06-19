const Discord = require("discord.js"); 
const sqlite3 = require('sqlite3');
const reddit = require('../reddit.js');

module.exports.run = (client, message, args) => {
    const db = new sqlite3.Database('loginDetails.sqlite');
    

    db.get('SELECT * FROM users WHERE userid = ?',[message.author.id],async (err,row)=>{
        if(err) console.error(err.message);

        if(row.username)    return  await message.author.send('You are already logged in. `~logout` to logout.');
        let code = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for(let i = 0; i < 20; i++) code += characters.charAt(Math.floor(Math.random() * characters.length));
        let messagetoSend = `Here is your verification code: "${code}"`;

        if(reddit.sendDM(args[0],messagetoSend)){
        
            const filter = msg => msg.author.id === message.author.id;
            await message.author.send('I sent a verification code to your reddit account. Please paste it here.');
            await message.author.dmChannel.awaitMessages(filter,{max:1,time:60000}).then(collected=>{
                if(!collected.first().content.includes(code))   return message.author.send('Invalid code. Login failed!');
                message.author.send('Successfully linked!');
                db.run('UPDATE users SET username = ? WHERE userid = ?',[args[0],message.author.id],(err)=>{
                    if(err) console.error(err.message);
                });
            })
            .catch(err=>{
                if(err) message.author.send('You took too long. Session timed out!');
            });
        }else{
            await message.author.send('That is an invalid reddit account. Please try again or check capitalization!');
        }

        db.close();
    });
} 

module.exports.help = {
   name: "login"
}