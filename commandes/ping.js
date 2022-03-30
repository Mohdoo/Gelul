/**
 * Répond par un message tout bête.
 * @param {*} interaction 
 */
const procedure = (interaction) => {
    let name = interaction.member.nickname != null ? interaction.member.nickname : interaction.member.user.username;
    interaction.reply(`Pong ${name}!`); 
};


const name = "ping";
const description = "Réponds par « pong »!";
const protected = false;
const options = null;

exports.procedure = procedure;
exports.name = name;
exports.description = description;
exports.protected = protected;
exports.options = options;
