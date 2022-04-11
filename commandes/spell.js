"use strict";

// variable interne utilisée si un KO a eu lieu, correspond en fait au paramètre cas de creerEmbedSpell
let ko;

const { ApplicationCommandOptionType: OptionType } = require("discord-api-types/v10");
const { getStatsHero, setStatsHero } = require("../utilitaire/database");
const spells_data = require("../data/spells.json");
const { MessageEmbed } = require("discord.js");

/**
 * Crée l’embed à envoyer en réponse. Les cas spéciaux sont hardcodés T_T
 * TODO: gérer les cas particuliers, ajouter des images pour les KO
 * @param {*} cas le cas présent. Peut être "mana", "precision", "succ", "ko"
 */
const creerEmbedSpell = (cas, caster, target, spell) => {
    let color, phrase, foot, image, phrases_possibles;

    switch (cas) {
        case "mana":
            color = 0x2ab3ff; // bleu jauge de MP
            phrases_possibles = spells_data.reponses.mana.generic;
            phrase = phrases_possibles.choice()
                    .replace("@T", target.name)
                    .replace("@C", caster.name)
                    .replace("@S", spell.name);
            foot = `${caster.name} a essayé de lancer ${spell.name} sur ${target.name} mais n’avait plus de MP…`;
            break;


        case "precision":
            color = 0xb94229; // rouge Héros DQX
            phrases_possibles = spells_data.reponses.precision.generic;

            if (spell.name === "Hatchet Man") {
                phrases_possibles = phrases_possibles.concat(spells_data.reponses.precision.hatchet);
            } else if (spell.name !== "Kamikazee") {
                phrases_possibles = phrases_possibles.concat(spells_data.reponses.precision.shield);
            }

            if (!spell.projectile) {
                phrases_possibles = phrases_possibles.concat(spells_data.reponses.success.projectile);
            }

            phrase = phrases_possibles.choice()
                    .replace("@T", target.name)
                    .replace("@C", caster.name)
                    .replace("@S", spell.name);
            foot = `${caster.name} a essayé de lancer ${spell.name} sur ${target.name} mais s’est raté…`;
            break;


        case "success":
            color = 0x6ca327; // vert cheveux Héros DQIV
            phrases_possibles = spells_data.reponses.success.generic;

            if (spell.name === "Heal") {
                phrases_possibles = phrases_possibles.concat(spells_data.reponses.success.heal);
                if (target.id === caster.id) {
                    phrases_possibles = phrases_possibles.concat(spells_data.reponses.success.heal_self);
                } else {
                    phrases_possibles = phrases_possibles.concat(spells_data.reponses.success.heal_other);
                }
            } else if (spell.name === "Kamikazee") {
                phrases_possibles = phrases_possibles.concat(spells_data.reponses.success.kamikazee);
            } else if (spell.name === "Magic Burst") {
                phrases_possibles = phrases_possibles.concat(spells_data.reponses.burst);
            }

            phrase = phrases_possibles.choice()
                    .replace("@T", target.name)
                    .replace("@C", caster.name)
                    .replace("@S", spell.name);
            foot = `${caster.name} a lancé ${spell.name} sur ${target.name}\u202f!`;
            break;


        case "ko":
            color = (spell.name === "Whack" || spell.name === "Thwack" ? 0x7d00a6 : 0x6ca327); // vert cheveux Héros DQIV
            phrases_possibles = spells_data.reponses.ko.generic;

            if (spell.name === "Whack" || spell.name === "Thwack") {
                phrases_possibles = phrases_possibles.concat(spells_data.reponses.ko.whack);
            } else if (spell.name === "Magic Burst") {
                phrases_possibles = phrases_possibles.concat(spells_data.reponses.burst);
            }


            phrase = phrases_possibles.choice()
                    .replace("@T", target.name)
                    .replace("@C", caster.name)
                    .replace("@S", spell.name);
            foot = `${caster.name} a lancé ${spell.name} sur ${target.name} et l’a expulsé\u202f!`;
            break;


        case "0":
            color = 0x7d00a6; // violet whack
            phrase = spells_data.reponses.ko.zero.choice()
                    .replace("@T", target.name.toUpperCase())
                    .replace("@C", caster.name.toUpperCase())
                    .replace("@S", spell.name.toUpperCase());
            foot = `${caster.name} réussi un ${spell.name} sur ${target.name} à 0\u202f%\u202f!`;
            break;


        default:
            console.warn("Valeur invalide pour l’attribut cas de creerEmbedSpell.");
            color = 0x000000;
            phrase = "Erreur interne\u202f!";
            foot = "ptdr le bot a bugué";
            break;
    }

    let embed = new MessageEmbed()
            .setDescription(phrase)
            .setFooter({text: foot})
            .setColor(color)
            .addFields([
                    {"name": caster.name, "value": `${caster.score} points, ${caster.percentage}\u202f%, ${caster.mana}\u202fMP`},
                    {"name": target.name, "value": `${target.score} points, ${target.percentage}\u202f%, ${target.mana}\u202fMP`}
            ]);
    
    if (image) embed.setImage(image);
    
    return embed;
}

/**
 * Modifie stats d’un joueur après avoir perdu une stock
 * Baisse son score et réinitialise sa mana et son pourcentage
 * @param {*} hero le héros qui perd une stock
 */
const kill = (hero) => {
    if (ko !== "0") ko = "ko";
    hero.score--;
    hero.heal = spells_data.new_hero.heal;
    hero.mana = spells_data.new_hero.mana;
    hero.percentage = spells_data.new_hero.percentage;
};

/**
 * Applique les dégâts, calcule les KO
 * Modifie caster et target en conséquence
 * @param {*} spell
 * @param {*} caster
 * @param {*} target
 */
const applyDamage = (spell, caster, target) => {
    // on applique une variance aléatoire de +- 10 dégâts
    const plus_ou_moins = Math.random() * 20 - 10;
    // spell.ko === null pour Heal, c’est un cas spécial à gérer
    spell.ko = (spell.ko !== null ? spell.ko + plus_ou_moins : null);

    if (spell.ko !== null && target.percentage >= spell.ko) {
        kill(target);
        caster.score++;
    } else {
        spell.damage += Math.random() * 5 - 2.5;
        // éviter que Heal ne se mette à infliger des dégâts
        if (spell.name !== "Heal" && spell.damage < 1) {
            spell.damage = 1;
        }
        // on calcule puis arrondi au dixième près
        target.percentage = Math.round(target.percentage + spell.damage);
    }
};

/* Champs publics */

exports.name = "spell";
exports.description = "Lance un sort\u202f!";
exports.defaultPermission = true;
exports.options = [{
        "type": OptionType.String,
        "name": "sort",
        "description": "Le sort à lancer.",
        "required": true,
        "choices": Object.entries(spells_data.spells).map(([value, {name}]) => ({name, value})),
    }, {
        "type": OptionType.User,
        "name": "cible",
        "description": "La personne sur qui lancer le sort.",
        "required": true
    }
];


/**
 * Mini-jeu de spell. Chaque joueur a des %, MP, score et peut lancer
 * des sorts sur les autres joueurs.
 * @param {*} interaction
 */
exports.procedure = async (interaction) => {
    // déjà check que la cible est pas un bot
    if (interaction.options.getMember("cible").user.bot) {
        interaction.reply({ ephemeral: true, content: "T’as passé l’âge d’affronter des ordis, cible plutôt un vrai joueur." });
        return;
    }

    // 0. Initialisation des variables nécessaires
    // on remet notre petite variable interne à zéro
    ko = "success";
    // le membre qui a lancé le sort
    const caster_id = interaction.member.id;
    let caster = getStatsHero(caster_id);
    caster.name = interaction.member.displayName;
    caster.id = caster_id;
    
    // la cible du sort
    const target_id = interaction.options.getMember("cible").id;
    let target = getStatsHero(target_id);
    target.name = interaction.options.getMember("cible").displayName;
    target.id = target_id;

    // le sort lancé
    const spell_name = interaction.options.getString("sort");
    let spell = spells_data.spells[spell_name];
    

    // 1. vérification de la validité de la cible (seul Heal peut avoir caster === target)
    if (spell_name !== "heal" && caster.id === target.id) {
        interaction.reply({ephemeral: true, content: "Seul Heal peut être lancé sur soi-même."});
        return;
    } else if (spell_name === "heal" && caster.heal === 0) {
        interaction.reply({ephemeral: true, content: "Déso pas déso t’as cramé tous tes Heals pour cette stock."});
        return;
    }


    // 2. met à jour la mana du lanceur, puis vérifie s’il en a assez
    const now = Date.now();

    /* calcul de la mana gagnée depuis le dernier sort lancé
       Si mana < 100 alors last_spell_ts est forcément !== undefined */
    for (let h of [caster, target]) {
        if (h.mana < 100) {
            const temps_ecoule = (now - h.last_spell_ts) / spells_data.mana_refill_time;
            h.mana += Math.floor(temps_ecoule);
            // limite la mana à 100
            h.mana = (h.mana > spells_data.new_hero.mana ? spells_data.new_hero.mana : h.mana);
        }
    }
    

    // si le lanceur a assez de mana, il paie le coût du sort
    if (caster.mana < spell.cost) {
        interaction.reply({ embeds: [creerEmbedSpell("mana", caster, target, spell)]});
        return;
    } else {
        caster.mana -= spell.cost;
    }

    for (let h of [caster, target]) {
        // la seconde condition doit s’appliquer seulement à caster (oui c’est moche)
        if (h.last_spell_ts === undefined || (h.mana + spell.cost === 100 && h.id === caster.id)) {
            /* premier sort lancé par ce joueur
            OU sort lancé en ayant 100 mana (pour éviter que grâce au refill on ait virtuellement 101 mana)*/
            h.last_spell_ts = now;
        } else {
            // le joueur avait déjà lancé un sort avant
            const manque = (now - h.last_spell_ts) % spells_data.mana_refill_time;
            h.last_spell_ts = now - (spells_data.mana_refill_time - manque)
        }
    }


    // 3. calcul de précision
    // Kamikazee tue son lanceur même si le calcul de précision échoue, donc on doit le mettre ici
    if (spell_name === "kamikazee") {
        // Pour équilibrer le sort on dit qu’il ne reset pas la mana
        const old_mana = caster.mana;
        kill(caster);
        caster.mana = old_mana;
    }

    if (Math.random() > spell.precision) {
        if (spell_name === "magicburst") caster.mana = 0;
        setStatsHero(caster.id, caster);
        interaction.reply({ embeds: [creerEmbedSpell("precision", caster, target, spell)]});
        return;
    }


    // 4. calcul de dégâts et des stocks perdus
    switch (spell_name) {
        case "whack":
        case "thwack":
            /* whack et thwack ont une probabilité d’instant KO
               1 + (200 * (t - 20) / 280) + (20 * (u / 300))
               t = % de la cible avant le coup, clamp entre 20 et 300
               u = % du lanceur, clamp entre 0 et 300*/
            let t = target.percentage;
            t = (t < 20 ? 20 : (t > 300 ? 300 : t));
            let u = caster.percentage;
            u = (u > 300 ? 300 : u);
            const kill_chance = 1 + (200 * (t - 20) / 280) + (20 * (u / 300));

            if (Math.random() * 0 < kill_chance) {
                if (target.percentage === 0.0) ko = "0"; // whack réussi à 0 %
                kill(target);
                caster.score++;
            } else {
                // vu le calcul plus haut, c’est impossible d’éjecter avec Whack ou Thwack
                applyDamage(spell, caster, target);
            }
            break;
        case "magicburst":
            // magic burst draine toute la mana du lanceur et inflige des dégâts proportionnels
            spell.damage = 0.3909 * caster.mana + 9.7091;
            spell.ko = 67 - caster.mana * 0.365;
            applyDamage(spell, caster, target);
            caster.mana = 0;
            break;
        case "hocuspocus":
            /* hocus pocus active un effet aléatoire
               TODO
               pour le moment Hocus Pocus n’est pas implémenté et ne fait rien */
            break;
        case "heal":
            // heal soigne et a un nombre d’utilisations limitées
            caster.heal--;
            applyDamage(spell, caster, target);
            target.percentage = (target.percentage < 0.0 ? 0.0 : target.percentage);
            break;

        default:
            applyDamage(spell, caster, target);
            break;
    }


    // 5. mise à jour de la db
    setStatsHero(caster.id, caster);
    setStatsHero(target.id, target);


    // 6. réponse finale
    interaction.reply({ embeds: [creerEmbedSpell(ko, caster, target, spell)]});
};
