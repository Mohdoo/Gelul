"use strict";

const { ApplicationCommandType } = require("discord-api-types/v10");

const commands = new Map;

/**
 * Charge toutes les commandes listées dans la config.
 * Chaque commande doit posséder une description un nom et une fonction.
 */
exports.init = () => {
    for (const cmdName of require("fs").readdirSync("commandes")) {
		const requiredAttrs = ["name", "description", "procedure"];
		const cmd = require(`./commandes/${cmdName}`);
		if(requiredAttrs.some(attr => cmd[attr] === undefined)) {
			console.error(`Le module ${cmdName} ne semble pas conforme. Il ne sera pas chargé.`);
			continue;
		}

		cmd.type = ApplicationCommandType.String;
		commands.set(cmd.name, cmd);
        console.log(`Le module ${cmdName} a été correctement chargé.`);
    }
};



/**
 * Parcourt la liste des commandes chargées, et applique la correspondante.
 * @param {*} interaction
 */
exports.applyCommands = interaction => commands.get(interaction.commandName).procedure(interaction);

