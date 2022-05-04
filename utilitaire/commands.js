"use strict";

const { ApplicationCommandType } = require("discord-api-types/v10");

const commands = new Map;

/**
 * Charge toutes les commandes listées dans la config.
 * Chaque commande doit posséder une description un nom et une fonction.
 */
exports.init = async () => {
    for (const cmdName of config.commands) {
		const requiredAttrs = ["name", "description", "procedure"];
		const cmd = require(`../commandes/${cmdName}`);
		if(requiredAttrs.some(attr => cmd[attr] === undefined)) {
			console.error(`Le module ${cmdName} ne semble pas conforme. Il ne sera pas chargé.`);
			continue;
		}

		cmd.type = ApplicationCommandType.String;
		commands.set(cmd.name, cmd);
        console.log(`Le module ${cmdName} a été correctement chargé.`);
    }

	console.log("Déclaration des slash commands à l’API…");
	const guild = await client.guilds.fetch(config.GUILD_ID);

	try {
		await guild.commands.set([...commands.values()]);

		console.log("Les slash commands ont correctement été déclarées.");
	} catch(err) {
		console.error(err);
	}
};



/**
 * Parcourt la liste des commandes chargées, et applique la correspondante.
 * @param {*} interaction
 */
exports.applyCommands = interaction => commands.get(interaction.commandName).procedure(interaction);
