const commands_list = new Array;

/**
 * Charge toutes les commandes listées dans la config.
 * Chaque commande doit posséder une description un nom et une fonction.
 */
const initCommands = () => {
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
            "procedure" : module.procedure,
            "protected": module.protected
        };

        commands_list.push(new_command);
        console.log(`Le module ${e} a été correctement chargé.`);
    });
};


/**
 * Parcourt la liste des commandes chargées, et applique la correspondante.
 * @param {*} interaction 
 */
const applyCommands = (interaction) => {
    commands_list.forEach(e => {
        if (interaction.commandName === e.name) {
            if (!e.protected) {
                e.procedure(interaction);
            } else {
                // les commandes protected ne peuvent être utilisées que par les owners !
                if (config.owners.includes(interaction.member.user.id)) {
                    e.procedure(interaction);
                } else {
                    interaction.reply({ephemeral: true, content: "Cette commande est réservée aux administrateurs du bot."});
                    console.log(`L'utilisateur ${interaction.member.user.tag} (${interaction.member.user.id}) a tenté d'utiliser la commande ${e.name}`);
                }
            }
        }
    });
};

exports.initCommands = initCommands;
exports.applyCommands = applyCommands;
