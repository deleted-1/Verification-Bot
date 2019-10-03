const { Client, Collection } = require('discord.js');
const { token } = require('./config.json');

const client = new Client();

client.commands = new Collection();
require(`./handlers/eventHandler.js`)(client);

client.login(token);
