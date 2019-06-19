const Discord = require("discord.js"); 
const fs = require('fs');

module.exports.run = (client, message, args) => {
    fs.readFile('./help.txt',(err,data)=>{
        if(err) console.error(err.message);

        const embed = new Discord.RichEmbed()
            .setDescription(data)
            .setColor([Math.floor(Math.random()*256),Math.floor(Math.random()*256),Math.floor(Math.random()*256)]);
        message.channel.send(embed);
    });
} 

module.exports.help = {
   name: "help"
}