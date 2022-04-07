const name = "ping";
const description = "Réponds par «\u202Fpong\u202F»\u202F!";
const protected = false;
const options = null;


/**
 * Répond par un message tout bête.
 * @param {*} interaction 
 */
const procedure = async (interaction) => {
    interaction.reply(`Pong ${interaction.member.displayName}\u202F! [${client.ws.ping} ms]`); 
};


exports.name = name;
exports.description = description;
exports.protected = protected;
exports.options = options;
exports.procedure = procedure;
