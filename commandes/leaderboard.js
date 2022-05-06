"use strict";

const { MessageEmbed } = require("discord.js");
const { getLeaderBoard } = require("../utilitaire/database");


/**
 * Affiche les trois joueurs ayant le plus de score dans le jeu.
 * @param {*} interaction
 */
exports.procedure = async (interaction) => {
    const podium = getLeaderBoard();


    for (const heros of podium) {
        const member = await interaction.guild.members.fetch(heros.id);
        heros.name = (member.displayName === undefined ? "[Héros ayant quitté le Havre]" : member.displayName);
    }

    if (podium.length < 1) {
        // il vient juste de commencer à jouer mais ne vous inquiétez pas il va les rattraper
        podium.unshift({ name: "Solo", id: 4, score: 444, percentage: 0 });
    }
    if (podium.length < 2) {
        // sans doute le héros le plus aimé
        podium.unshift({ name: "Eight", id: 8, score: 888, percentage: 50 });
    }
    if (podium.length < 3) {
        // le héros légendaire
        podium.unshift({ name: "Roto", id: 3, score: 3333, percentage: 100 });
    }

    const embed = new MessageEmbed()
            .setColor(0xf8d55f)
            .setTitle("Podium des Héros")
            .setImage(config.BASE_URL + "podium.webp")
            .setDescription(
                    "Les trois Héros ayant le plus grand score sont ici\u202f!\n" +
                    "En cas d’égalité, c’est le pourcentage qui fait la différence."
            );

    for (const e of podium) {
        embed.addField(e.name, `${e.score} points, ${e.percentage}\u202f%`);
    }

    interaction.reply({ embeds: [embed] });
};


exports.name = "leaderboard";
exports.description = "Là où rêvent d’aller les plus grands héros\u202f!";
exports.options = null;
