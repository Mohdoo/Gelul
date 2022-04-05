/**
 * Le point de départ du programme !
 */

const { Client, Intents } = require("discord.js");
const { applyCommands } = require("./commands");

// config, db et client sont des variables globales, pour être accessibles partout. Essayer de ne pas en faire trop !
global.config = require("./config.json");

// intents : GUILDS est nécessaire pour que Discord.js fonctionne, GUILD_MEMBERS donne accès à l’événement GUILD_MEMBER_ADD
let intents = [Intents.FLAGS.GUILDS];
if (config.WELCOME_CHANNEL_ID !== "") intents.push(Intents.FLAGS.GUILD_MEMBERS);
global.client = new Client({ intents: intents });


// appelé une fois quand le bot se connecte
client.once("ready", () => {
    console.log(`Connecté sur le compte ${client.user.tag}!`);

    const { initCommands } = require("./commands");
    initCommands();
    const { initDatabase } = require("./database");
    initDatabase();
});

// appelé à chaque interaction avec le bot (on ignore tout sauf les slash commandes)
client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

    applyCommands(interaction);
});

/* l’envoi de messages de bienvenue ne se fait logiquement que si on a défini un salon pour ça
 * En plus faire comme ça permet de facilement désactiver la fonctionnalité, même si c’est pas ultra propre */
if (config.WELCOME_CHANNEL_ID !== "") {
    client.on("guildMemberAdd", async member => {
        member.guild.channels.fetch(config.WELCOME_CHANNEL_ID)
                .then(channel => channel.send(`Bienvenue ${member.user.username}`))
                .catch(console.error);
    });
}

// Let’s goooooooo!
client.login(config.CLIENT_TOKEN);
