/**
 * Répond par un message tout bête.
 * @param {*} interaction 
 */
const procedure = (interaction) => {
    let name = interaction.member.nickname != null ? interaction.member.nickname : interaction.member.user.username;
    interaction.reply(`Pong ${name}!`); 
};


const description = "Réponds par « pong »!"
const name = "ping";

exports.procedure = procedure;
exports.description = description;
exports.name = name;
exports.protected = false;
