/**
 * Le point de départ du programme !
 */

const { Client, Intents } = require('discord.js');
global.client = new Client({ intents: [Intents.FLAGS.GUILDS] });
global.config = require("./config.json");
const commands = require("./commands");

// appelé une fois quand le bot se connecte
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    commands.initCommands();
});

// appelé à chaque interaction avec le bot (on ignore tout sauf les commandes)
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    commands.applyCommands(interaction);
});

client.login(config.CLIENT_TOKEN);
