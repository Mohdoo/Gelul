/**
 * Le point de départ du programme !
 */

const { Client, Intents } = require("discord.js");
const { initCommands, applyCommands } = require("./commands");

// client et config sont des variables globales, pour être accessibles partout. Essayer de ne pas en faire trop !
global.config = require("./config.json");
global.client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// appelé une fois quand le bot se connecte
client.on("ready", () => {
    console.log(`Connecté sur le compte ${client.user.tag}!`);
    initCommands();
});

// appelé à chaque interaction avec le bot (on ignore tout sauf les slash commandes)
client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

    applyCommands(interaction);
});

// Let’s goooooooo!
client.login(config.CLIENT_TOKEN);
