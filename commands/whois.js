const SQLite = require('better-sqlite3');
const { RichEmbed } = require('discord.js');

const redditLogin = new SQLite('./Util/redditLogin.db');

module.exports = {
    name: 'whois',
    alias: ['who'],
    guildOnly:true,
    run: async (client, msg, args) => {

        let user = msg.mentions.users.first() || (args.length ? client.users.filter(u => u.username == args[0].toLowerCase()) : msg.author);

        if (!user.username) {

            if (user.size == 1) user = user.first();
            else if (user.size == 0) return msg.reply('could not find a user with the name '+args[0]);
            else {
                user = user.map(m => m.user.tag);

                let description = '';
                for(let i = 0; i<5; ++i){
                    if(!user[i]) break;
                    description += `\`${i+1}.\` `+user[i];
                }
                
                let userEmbed = new RichEmbed()
                    .setDescription(description)
                    .setColor("RANDOM")
                    .setTimestamp()
                    .setFooter('Type a number 1-5 to select a user.',client.user.avatarURL)
    
                await msg.channel.send(userEmbed);
                await msg.channel.awaitMessages(filter,{max:1,time:10000}).then(async response => {
                    user = await msg.guild.user.find(m => m.user.tag == user[parseInt(response.first())-1])
                }).catch(async err => {
                    if (err){ 
                        await msg.reply('timed out. cancelling command.');
                        throw 'Timed Out';
                    }
                });
            }
        }

        let account = redditLogin.prepare("SELECT reddit FROM redditLogin WHERE discord = ?").get(user.id);
        if (!account) return msg.reply(`${user.tag} has not linked their reddit account.`);
        console.log(account)
        msg.reply(`${user.tag}'s reddit account is ${account.reddit}`);

    }
}