"use strict";

exports.name = "ping";
exports.description = "Réponds par «\u202Fpong\u202F»\u202F!";
exports.protected = false;
exports.options = null;

/**
 * Répond par un message tout bête.
 * @param {*} interaction
 */
exports.procedure = async (interaction) => {
    interaction.reply(`Pong ${interaction.member.displayName}\u202F! [${client.ws.ping} ms]`);
};
