/**
 * Ce fichier n’est pas exécuté en même temps que le bot.
 * Il n’est à exécuter qu’une fois avant de lancer le bot, si la liste des commandes a été modifiée.
 */

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { commands, CLIENT_TOKEN, CLIENT_ID, GUILD_ID } = require("./config.json");

let commands_to_declare = new Array;

// un peu similaire au chargement dans commands.js, mais sans la procedure
commands.forEach(e => {
    const { name, description, options } = require(`./commandes/${e}`);

    // si le module est invalide, on passe !
    if (name === undefined || description === undefined || options === undefined) {
        console.error(`Le module ${e} ne semble pas conforme. Il ne sera pas chargé.`);
        return;
    }

    const new_command = {
        "name" : name,
        "description" : description,
        "options": options,
        "type": 1
    };
    
    commands_to_declare.push(new_command);
});

const rest = new REST({ version: "9" }).setToken(CLIENT_TOKEN);

(async () => {
    try {
        console.log("Déclaration des slash commands à l’API…");

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands_to_declare },
        );

        console.log("Les slash commands ont correctement été déclarées.");
    } catch (error) {
        console.error(error);
    }
})();
