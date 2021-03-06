"use strict";

/**
 * Le point de départ du programme !
 */

require("./utilitaire/utils");
const { Client, Intents: { FLAGS: INTENTS } } = require("discord.js");

// config et client sont des variables globales, pour être accessibles partout
global.config = require("./data/config.json");

// intents : GUILDS est nécessaire pour que Discord.js fonctionne, GUILD_MEMBERS donne accès à l’événement GUILD_MEMBER_ADD et est requis pour /leaderboard
global.client = new Client({ intents: [INTENTS.GUILDS, INTENTS.GUILD_MEMBERS] });


const { applyCommands } = require("./utilitaire/commands");
// Pour le moment on a une seule interaction qui utilise des boutons, on verra comment gérer si on en ajoute d’autres un jour
const { buttonProcedure } = require("./commandes/ufd");
const { welcomeMessage } = require("./utilitaire/welcome");


// appelé une fois quand le bot se connecte
client.once("ready", () => {
    console.log(`Connecté sur le compte ${client.user.tag}!`);

    require("./utilitaire/commands").init();
});

// appelé à chaque interaction avec le bot
client.on("interactionCreate", async interaction => {
    if (interaction.isButton()) {
        buttonProcedure(interaction);
        return;
    }

    if (!interaction.isCommand()) return;

    applyCommands(interaction);
});

/* l’envoi de messages de bienvenue ne se fait logiquement que si on a défini un salon pour ça */
if (config.WELCOME_CHANNEL_ID) {
    client.on("guildMemberAdd", async member => {
        welcomeMessage(member);
    });
}

// Let’s goooooooo!
client.login(config.CLIENT_TOKEN);
