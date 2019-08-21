const { RichEmbed } = require("discord.js"); 
const fs = require('fs');

module.exports = {
    name: 'help',
    alias: ['h','?'],
    guildOnly: false,
    run: async (client, msg, args) => {
        fs.readFile('../help.txt',(err,data)=>{
            if(err) console.error(err.message);
    
            const embed = new RichEmbed()
                .setDescription(data)
                .setColor("RANDOM");
            msg.channel.send(embed);
        });
    }
}