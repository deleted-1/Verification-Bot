module.exports = {
    name: 'message',
    run: async (client, msg) => {

        const msgArray = msg.content.split(" ");
        const cmd = client.commands.get(msgArray[0].slice(1)) || client.commands.find(cmd => cmd.alias.includes(msgArray[0].slice(1)));
        const args = msgArray.slice(1);
        
        if (!msg.content.startsWith('~') || !cmd) return;
        if (cmd.guildOnly && !msg.guild) return msg.reply('This command does not work in DMs, it will only work in a server.');
    
        cmd.run(client, msg, args);

    }
}