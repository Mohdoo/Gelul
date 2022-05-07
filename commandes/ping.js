"use strict";


/**
 * Répond par un message tout bête.
 * @param {*} interaction
 */
exports.procedure = async (interaction) => {
    interaction.reply(`Pong ${interaction.member.displayName}\u202f! [${client.ws.ping} ms]`);
};


exports.name = "ping";
exports.description = "Réponds par «\u202fpong\u202f»\u202f!";
exports.options = null;
