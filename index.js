const reddit = require('./reddit.js');
const Discord = require('discord.js');
const client = new Discord.Client();
const sqlite3 = require('sqlite3');

(async()=>{
    await reddit.initialize();
    await reddit.login("verification4reddit","verificationbot");
})();

client.on('ready',()=>{
    console.log(`Logged into ${client.user.username}`);
    let db = new sqlite3.Database('loginDetails.sqlite');

    client.guilds.get('460953238670147585').members.forEach(member=>{
        db.get('SELECT * FROM users WHERE userid = ?',[member.user.id],(err,row)=>{
            if(err) return console.error(err.message);

            return row
                ?   console.log(`${row.userid}:${row.username}`)
                :   db.run('INSERT INTO users VALUES (?,"")',[member.user.id],(err)=>{
                        if(err) console.error(err.message);
            });
        });
    });
    
    db.close();
});

client.on('message',(message)=>{
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    
    if(!cmd.startsWith('~')) return;
    try{
        cmdFile = require(`./commands/${cmd.slice(1)}.js`);
        cmdFile.run(client,message,args);
    }catch{

    }

});

client.on('guildMemberAdd',(member)=>{
    let db = new sqlite3.Database('loginDetails.sqlite');

    db.run('INSERT INTO users VALUES(?,"")',[member.user.id],(err)=>{
        if(err) console.error(err.message);
    });

    db.close();
});

client.on('guildMemberRemove',member=>{
    let db = new sqlite3.Database('loginDetails.sqlite');

    db.run('DELETE INTO users WHERE userid = ?',[member.user.id],(err)=>{
        if(err) console.error(err.message);
    });

    db.close();
})


client.login("");