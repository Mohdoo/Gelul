const name = "ping";
const description = "Réponds par «\u202Fpong\u202F»\u202F!";
const protected = false;
const options = null;


/**
 * Répond par un message tout bête.
 * @param {*} interaction 
 */
const procedure = (interaction) => {
    const name = interaction.member.nickname != null ? interaction.member.nickname : interaction.member.user.username;
    interaction.reply(`Pong ${name}\u202F! [${client.ws.ping} ms]`); 
};


exports.name = name;
exports.description = description;
exports.protected = protected;
exports.options = options;
exports.procedure = procedure;
