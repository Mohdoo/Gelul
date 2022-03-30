/**
 * Ce fichier n'est pas exécuté en même temps que le bot.
 * Il n'est à exécuter qu'une fois avant de lancer le bot, si la liste des commandes a été modifiée.
 */

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config.json');

var commands = new Array;

// un peu similaire au chargement dans commands.js, mais sans la procedure
config.commands.forEach(e => {
    let module = require(`./commandes/${e}`);

    // si le module est invalide, on passe !
    if (Object.keys(module).length != 5) {
        console.error(`Le module ${e} ne semble pas conforme. Il ne sera pas chargé.`);
        return;
    }

    let new_command = {
        "name" : module.name,
        "description" : module.description,
        "options": module.options,
        "type": 1
    };
    
    commands.push(new_command);
});

const rest = new REST({ version: '9' }).setToken(config.CLIENT_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
