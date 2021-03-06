"use strict";

const { closeDatabase } = require("../utilitaire/database");


/**
 * Déconnecte le bot et termine le programme.
 * @param {*} interaction
 */
exports.procedure = async (interaction) => {
   interaction.reply({ephemeral: true, content: "Extinction… Buh-bye\u202f!"})
   .then(() => {
	   console.log(`Arrêt du bot demandé par ${interaction.member.user.tag}.`);
	   closeDatabase();
	   client.destroy();
   });
};


exports.name = "exit";
exports.description = "Déconnecte le bot et l’éteint.";
exports.options = null;
