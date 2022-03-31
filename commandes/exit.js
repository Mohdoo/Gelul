/**
 * Déconnecte le bot et termine le programme.
 * @param {*} interaction 
 */
 const procedure = (interaction) => {
    interaction.reply({ephemeral: true, content: "Extinction… Buh-bye\u202F!"})
    .then(() => {
        console.log(`Arrêt du bot demandé par ${interaction.member.user.tag}.`);
        client.destroy();
    });
};


const name = "exit";
const description = "(Admin seulement) Déconnecte le bot et l’éteint."
const protected = true;
const options = null;

exports.procedure = procedure;
exports.name = name;
exports.description = description;
exports.protected = protected;
exports.options = options;
