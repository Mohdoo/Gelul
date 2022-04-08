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



client.once("ready", async () => {
	console.log("Déclaration des slash commands à l’API…");
	const guild = await client.guilds.fetch(config.GUILD_ID);
	const permissions = config.owners.map(id => ({ id, type: 2, permission: true }));

	try {
		const guildCommands = await guild.commands.set([...commands.values()]);
		await guild.commands.permissions.set({
			fullPermissions: guildCommands
				.filter(cmd => !cmd.default_permission)
				.map(({id}) => ({ id, permissions }))
		});

		console.log("Les slash commands ont correctement été déclarées.");
	} catch(err) {
		console.error(err);
	}
});
