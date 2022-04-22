"use strict";

/**
 * Le point de départ du programme !
 */

require("./utilitaire/utils");
const { Client, Intents: { FLAGS: INTENTS } } = require("discord.js");

// config et client sont des variables globales, pour être accessibles partout. Essayer de ne pas en faire trop !
global.config = require("./data/config.json");

// intents : GUILDS est nécessaire pour que Discord.js fonctionne, GUILD_MEMBERS donne accès à l’événement GUILD_MEMBER_ADD et est requis pour /leaderboard
global.client = new Client({ intents: [INTENTS.GUILDS, INTENTS.GUILD_MEMBERS] });


const { applyCommands } = require("./utilitaire/commands");
// Pour le moment on a une seule interaction qui utilise des boutons, on verra comment gérer si on en ajoute d’autres un jour
// Pareil pour le menu déroulant…
const { buttonProcedure } = require("./commandes/ufd");


// appelé une fois quand le bot se connecte
client.once("ready", () => {
    console.log(`Connecté sur le compte ${client.user.tag}!`);

    require("./utilitaire/commands").init();
});

// appelé à chaque interaction avec le bot (on ignore tout sauf les slash commandes)
client.on("interactionCreate", async interaction => {
    if (interaction.isButton()) {
        buttonProcedure(interaction);
        return;
    }

    if (!interaction.isCommand()) return;

    applyCommands(interaction);
});

/* l’envoi de messages de bienvenue ne se fait logiquement que si on a défini un salon pour ça
 * En plus faire comme ça permet de facilement désactiver la fonctionnalité, même si c’est pas ultra propre */
if (config.WELCOME_CHANNEL_ID) {
    client.on("guildMemberAdd", member => {
        member.guild.channels.fetch(config.WELCOME_CHANNEL_ID)
                .then(channel => channel.send(`Bienvenue ${member.user.username}`))
                .catch(console.error);
    });
}

// Let’s goooooooo!
client.login(config.CLIENT_TOKEN);
