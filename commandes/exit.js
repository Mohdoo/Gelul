/**
 * Déconnecte le bot et termine le programme.
 * @param {*} interaction 
 */
 const procedure = (interaction) => {
    interaction.reply({ephemeral: true, content: "Extinction… Buh-bye !"})
    .then(() => {
        console.log(`Arrêt du bot demandé par ${interaction.member.user.tag}.`);
        client.destroy();
    });
};


const description = "Déconnecte le bot et l'éteint."
const name = "exit";

exports.procedure = procedure;
exports.description = description;
exports.name = name;
exports.protected = true;
