"use strict";

const { ApplicationCommandOptionType: OptionType } = require("discord-api-types/v10");
const { MessageEmbed } = require("discord.js");
const { getStatsHero } = require("../utilitaire/database");
const { mana_refill_time, new_hero } = require("../data/spells.json");

exports.name = "stats";
exports.description = "Affiche les stats d’un membre du mini-jeu";
exports.defaultPermission = true;
exports.options = [
    {
        "type": OptionType.User,
        "name": "joueur",
        "description": "Le Héros à afficher."
    }
];


/**
 * Affiche les stats d’un joueur du jeu /spell
 * @param {*} interaction
 */
exports.procedure = async (interaction) => {
    let joueur = interaction.options.getMember("joueur");

    // cas 1 : commande sans option
    if (joueur === null) {
        joueur = interaction.member;
    // cas 2 : le paramètre est un bot
    } else if (joueur.user.bot) {
        interaction.reply({ ephemeral: true, content: "Les bots ne peuvent pas jouer à ce jeu. Trop triste." });
        return;
    }

    const hero = getStatsHero(joueur.id);
    const image_type = (joueur.user.avatar.startsWith("a_") ? "gif" : "webp");

    const now = Date.now();
    /* calcul de la mana gagnée depuis le dernier sort lancé
       Si mana < 100 alors last_spell_ts est forcément !== undefined */
    if (hero.mana < 100) {
        const temps_ecoule = (now - hero.last_spell_ts) / mana_refill_time;
        hero.mana += Math.floor(temps_ecoule);
        // limite la mana à 100
        hero.mana = (hero.mana > new_hero.mana ? new_hero.mana : hero.mana);
    }

    const barre_mana = "🟦".repeat(Math.round(hero.mana / 10)) + "⬜".repeat(10 - Math.round(hero.mana / 10));

    const embed = new MessageEmbed()
            .setColor(joueur.displayColor)
            .setThumbnail(`https://cdn.discordapp.com/avatars/${joueur.id}/${joueur.user.avatar}.${image_type}`)
            .setTitle(`Statistiques de ${joueur.displayName}`)
            .addFields(
                    { name: "MP", value: `${hero.mana}\n${barre_mana}` },
                    { name: "Score", value: String(hero.score), inline: true },
                    { name: "Pourcentage", value: `${hero.percentage}\u202f%`, inline: true },
                    { name: "Heals restants", value: String(hero.heal), inline: true }
            );

    interaction.reply({ embeds: [embed] })
};
