"use strict";

// variables internes utilisées lorsque des fonctions de même profondeur dans le call tree ont besoin de se passer des données entre elles
let ko;
let victime;

const { ApplicationCommandOptionType: OptionType } = require("discord-api-types/v10");
const { getStatsHero, setStatsHero } = require("../utilitaire/database");
const spells_data = require("../data/spells.json");
const { MessageEmbed } = require("discord.js");


/**
 * Crée l’embed à envoyer en réponse
 * @param {*} cas réussite, ko, pas de mana…
 */
const creerEmbedSpell = (cas, caster, target, spell) => {

    if (spell.name === "Hocus Pocus" && !["mana", "precision", "erreur"].includes(cas)) return creerEmbedHocusPocus(caster, target);

    let color, phrase, foot, image, phrases_possibles;

    switch (cas) {
        case "mana":
            color = 0x2ab3ff; // bleu jauge de MP
            phrases_possibles = spells_data.reponses.mana.generic;
            phrase = phrases_possibles.choice();
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

            phrase = phrases_possibles.choice();
            foot = `${caster.name} a essayé de lancer ${spell.name} sur ${target.name} mais s’est raté…`;
            break;


        case "success":
            color = 0x6ca327; // vert cheveux Héros DQIV
            phrases_possibles = spells_data.reponses.success.generic;

            if (spell.name === "Kamikazee") {
                phrases_possibles = phrases_possibles.concat(spells_data.reponses.success.kamikazee);
            } else if (spell.name === "Magic Burst") {
                phrases_possibles = phrases_possibles.concat(spells_data.reponses.burst);
            }

            phrase = phrases_possibles.choice();
            foot = `${caster.name} a lancé ${spell.name} sur ${target.name}\u202f!`;
            break;


        case "ko":
            color = (spell.name === "Whack" || spell.name === "Thwack" ? 0x7d00a6 : 0x6ca327); // vert cheveux Héros DQIV ou violet whack
            phrases_possibles = spells_data.reponses.ko.generic;

            if (spell.name === "Whack" || spell.name === "Thwack") {
                phrases_possibles = phrases_possibles.concat(spells_data.reponses.ko.whack);
            } else if (spell.name === "Magic Burst") {
                phrases_possibles = phrases_possibles.concat(spells_data.reponses.burst);
            }

            phrase = phrases_possibles.choice();
            foot = `${caster.name} a lancé ${spell.name} sur ${target.name} et l’a expulsé\u202f!`;
            // TODO image = `${config.BASE_URL}/ko/${spell.name}.gif`.replace("", "%20");
            break;


        case "0":
            color = 0x7d00a6; // violet whack
            phrase = spells_data.reponses.ko.zero.choice()
                    .replace("@T", target.name.toUpperCase())
                    .replace("@C", caster.name.toUpperCase())
                    .replace("@S", spell.name.toUpperCase());
            foot = `${caster.name} réussit un ${spell.name} sur ${target.name} à 0\u202f%\u202f!`;
            // TODO image = `${config.BASE_URL}/ko/${spell.name}.gif`.replace("", "%20");
            break;

        case "heal":
            color = 0xa5f8dc; // vert clair au pif

            phrases_possibles = spells_data.reponses.success.heal;
            if (target.id === caster.id) {
                phrases_possibles = phrases_possibles.concat(spells_data.reponses.success.heal_self);
            } else {
                phrases_possibles = phrases_possibles.concat(spells_data.reponses.success.heal_other);
            }

            phrase = phrases_possibles.choice();
            foot = `${caster.name} a lancé ${spell.name} sur ${target.name}\u202f!`;
            break;

        default:
            console.warn(`Valeur invalide ou d'erreur pour l’attribut cas de creerEmbedSpell (${cas})`);
            color = 0x000001; // noir presque parfait
            phrase = "Erreur interne\u202f!";
            foot = "ptdr le bot a bugué";
            break;
    }

    phrase = phrase.replace("@T", target.name)
            .replace("@C", caster.name)
            .replace("@S", spell.name);

    let embed = new MessageEmbed()
            .setDescription(phrase)
            .setFooter({text: foot})
            .setColor(color)
            .addField(caster.name, `${caster.score} points, ${caster.percentage}\u202f%, ${caster.mana}\u202fMP`);
    
    if (caster.id !== target.id) embed.addField(target.name, `${target.score} points, ${target.percentage}\u202f%, ${target.mana}\u202fMP`);
    
    if (image) embed.setImage(image);
    
    return embed;
}


/**
 * Applique les changements de stats quand un héros se fait expulser
 */
const kill = (hero) => {
    if (ko !== "0" && ko !== "foe") ko = "ko";
    hero.score--;
    hero.heal = spells_data.new_hero.heal;
    hero.mana = spells_data.new_hero.mana;
    hero.percentage = spells_data.new_hero.percentage;
};


/**
 * Applique les dégâts, calcule les KO
 * Modifie caster et target en conséquence
 */
const applyDamage = (spell, caster, target) => {
    const variance = Math.random() * 20 - 10;
    let ko_value = spell.ko + variance;

    if (target.percentage >= ko_value) {
        kill(target);
        caster.score++;
    } else {
        let damage = spell.damage + Math.random() * 5 - 2.5;
        if (damage < 1) {
            damage = 1;
        }
        target.percentage = Number((target.percentage + damage).toFixed(1));
    }
};


/**
 * Applique Heal
 */
const heal = (target) => {
    const heal_power = spells_data.spells.heal.damage + Math.random() * 5 - 2.5;

    target.percentage = Number((target.percentage + heal_power).toFixed(1));
    target.percentage = (target.percentage < 0.0 ? 0.0 : target.percentage);
};


/**
 * Applique un effet aléatoire de Hocus Pocus
 */
const hocusPocus = (caster, target) => {
    /**
     * Bienvenue dans le bordel sans nom, le chaos, le vide primordial, le tout et le rien !
     * Cette fonction est l’apogée du bordel qu’est /spell, le zénith, que dis-je, l’empyrée !
     * Bon courage…
     */

    // cette variable contient les cas possibles, on peut facilement en retirer un pour le désactiver
    ko = [
        "trempette",    // nothing happens/lance Trempette/met un message ou une image débile sans effet
        //"randomspell",// lancer un sort au hasard pour 4 PM (même cible)
        "invisibility", // mettre une invisibilité qui donne 50 % de chances d’esquive sur les 3 prochains sorts qu’il reçoit
        "fullmana",     // redonner toute la mana au lanceur
        "nomana",       // faire perdre toute la mana au lanceur
        "omnisoin",     // Soigner tous les PV du lanceur
        "mortsubite",   // Ajouter 300% de dégâts au lanceur
        "foe",          // invoquer un FOE (even in Gelul, F.O.E!) qui élimine au hasard le lanceur ou la cible (le point revient à celui qui n’a pas été éliminé)
        "summon"        // fait une invocation de Final Fantasy ou Golden Sun, inflige des dégâts à la cible qui dépendent de qui est invoqué
    ].choice();

    switch (ko) {
        case "trempette":
            // ne fait RIEN, mais ce case doit exister sinon on tombe dans default
            break;

        case "randomspell":
            // TODO randomspell
            break;

        case "invisibility":
            caster.invisibility = 3;
            break;

        case "fullmana":
            caster.mana = spells_data.new_hero.mana;
            break;

        case "nomana":
            caster.mana = 0;
            break;
        
        case "omnisoin":
            caster.percentage = 0;
            break;

        case "mortsubite":
            caster.percentage += 300;
            break;

        case "foe":
            if (Math.random() > 0.5) {
                kill(caster);
                target.score++;
                victime = caster.name;
            } else {
                kill(target);
                caster.score++;
                victime = target.name;
            }
            break;

        case "summon":
            ko = [
                "Odin",                         // Final Fantasy 7
                "Bahamut ZERO",                 // Final Fantasy 7
                "Iris",                         // Golden Sun 2
                "Catastrophe",                  // Golden Sun 2
                "Dragon Blanc aux Yeux Bleus",  // Yu-Gi-Oh!
                "Magicien Sombre",              // Yu-Gi-Oh!
                "Kaio"                          // Spectrobes 3
            ].choice();
            target.percentage = Number((target.percentage + (100 + Math.random() * 100 - 50)).toFixed(1));
            break;
    
        default:
            console.error(`Hocus Pocus : cas non géré (${ko})`);
            ko = "erreur";
            break;
    }
};


/**
 * Similaire à creerEmbedSpell, mais gère les multiples cas aléatoires d’Hocus Pocus
 */
const creerEmbedHocusPocus = (caster, target) => {
    let color, phrase, foot, image;

    color = 0xff9900; // orange FOE

    switch (ko) {
        case "trempette":
            phrase = spells_data.reponses.hocuspocus.trempette.choice();
            foot = `${caster.name} a lancé Hocus Pocus, mais il ne s’est rien produit…`;
            break;

        case "randomspell":
            // TODO randomspell embed
            break;

        case "invisibility":
            phrase = `${caster.name} devient invisible\u202f! Les trois prochains sorts qui le ciblent seront 50\u202f% moins précis\u202f!`;
            foot = `${caster.name} a lancé Hocus Pocus et est devenu invisible\u202f!`;
            break;

        case "fullmana":
            phrase = spells_data.reponses.hocuspocus.fullmana.choice();
            foot = `${caster.name} a lancé Hocus Pocus et a récupéré tous ses MP\u202f!`;
            break;

        case "nomana":
            phrase = spells_data.reponses.hocuspocus.nomana.choice();
            foot = `${caster.name} a lancé Hocus Pocus et a perdu tous ses MP\u202f!`;
            break;
        
        case "omnisoin":
            phrase = spells_data.reponses.hocuspocus.omnisoin.choice();
            foot = `${caster.name} a lancé Hocus Pocus et s’est intégralement soigné\u202f!`;
            break;

        case "mortsubite":
            phrase = spells_data.reponses.hocuspocus.mortsubite.choice()
                    
            foot = `${caster.name} a lancé Hocus Pocus et ses % ont augmenté de 300\u202f!`;
            break;

        case "foe":
            phrase = spells_data.reponses.hocuspocus.foe.choice()
                    .replace("@T", victime);
            foot = `${caster.name} a lancé Hocus Pocus\u202f! Un FOE apparaît et extermine ${victime}\u202f!`;
            image = config.BASE_URL + spells_data.reponses.images.foe.choice();
            break;

        // summon
        case "Iris":
        case "Odin":
        case "Kaio":
        case "Catastrophe":
        case "Bahamut ZERO":
        case "Magicien Sombre":
        case "Dragon Blanc aux Yeux Bleus":
            phrase = `${caster.name} invoque ${ko}\u202f! ${target.name} subit une tonne de dégâts\u202f!`;
            foot = `${caster.name} a lancé Hocus Pocus et a réalisé une invocation qui attaque ${target.name}\u202f!`;
            // TODO image = `${config.BASE_URL}/summon/${ko}.gif`.replace(" ", "%20");
            break;
    
        default:
            console.error(`Créer Embed Hocus Pocus : cas non géré (${ko})`);
            color = 0x000001;
            phrase = "Erreur interne\u202f!";
            foot = "ptdr le bot a bugué";
            break;
    }

    phrase = phrase.replace("@T", target.name)
            .replace("@C", caster.name);

    let embed = new MessageEmbed()
            .setDescription(phrase)
            .setFooter({text: foot})
            .setColor(color)
            .addField(caster.name, `${caster.score} points, ${caster.percentage}\u202f%, ${caster.mana}\u202fMP`)
            .addField(target.name, `${target.score} points, ${target.percentage}\u202f%, ${target.mana}\u202fMP`);
    
    if (image) embed.setImage(image);
    
    return embed;
};


/* Champs publics */


/**
 * Mini-jeu de spell. Chaque joueur a des %, MP, score et peut lancer
 * des sorts sur les autres joueurs.
 */
exports.procedure = async (interaction) => {
    if (interaction.options.getMember("cible").user.bot) {
        interaction.reply({ ephemeral: true, content: "T’as passé l’âge d’affronter des ordis, cible plutôt un vrai joueur." });
        return;
    }

    // 0. Initialisation des variables nécessaires
    ko = "success";
    
    const caster_id = interaction.member.id;
    let caster = getStatsHero(caster_id);
    caster.name = interaction.member.displayName;
    caster.id = caster_id;
    
    const target_id = interaction.options.getMember("cible").id;
    let target = getStatsHero(target_id);
    target.name = interaction.options.getMember("cible").displayName;
    target.id = target_id;

    const spell_name = interaction.options.getString("sort");
    let spell = spells_data.spells[spell_name];
    

    // 1. vérification de la validité de la cible
    if (spell.name !== "Heal" && caster.id === target.id) {
        interaction.reply({ephemeral: true, content: "Seul Heal peut être lancé sur soi-même."});
        return;
    } else if (spell.name === "Heal" && caster.heal === 0) {
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
            h.mana = (h.mana > spells_data.new_hero.mana ? spells_data.new_hero.mana : h.mana);
        }
    }
    
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
            const manque = (now - h.last_spell_ts) % spells_data.mana_refill_time;
            h.last_spell_ts = now - (spells_data.mana_refill_time - manque);
        }
    }


    // 3. calcul de précision
    // Kamikazee tue son lanceur même si le calcul de précision échoue
    if (spell.name === "Kamikazee") {
        // Pour équilibrer le sort on dit qu’il ne reset pas la mana
        const old_mana = caster.mana;
        kill(caster);
        ko = "success";
        target.score++;
        caster.mana = old_mana;
    }

    let precision_check = Math.random();

    if (target.invisibility > 0) {
        target.invisibility--;
        precision_check *= 2;
    }

    if (precision_check > spell.precision) {
        if (spell.name === "Magic Burst") caster.mana = 0;
        setStatsHero(caster.id, caster);
        interaction.reply({ embeds: [creerEmbedSpell("precision", caster, target, spell)]});
        return;
    }


    // 4. calcul de dégâts et des stocks perdus
    switch (spell.name) {
        case "Whack":
        case "Thwack":
            /* whack et thwack ont une probabilité d’instant KO
               1 + (200 * (t - 20) / 280) + (20 * (u / 300))
               t = % de la cible avant le coup, clamp entre 20 et 300
               u = % du lanceur, clamp entre 0 et 300*/
            let t = target.percentage;
            t = (t < 20 ? 20 : (t > 300 ? 300 : t));
            let u = caster.percentage;
            u = (u > 300 ? 300 : u);
            const kill_chance = 1 + (200 * (t - 20) / 280) + (20 * (u / 300));

            if (Math.random() * 100 < kill_chance) {
                if (target.percentage === 0.0) ko = "0"; // whack réussi à 0 %
                kill(target);
                caster.score++;
            } else {
                // vu le calcul plus haut, c’est impossible d’éjecter avec Whack ou Thwack
                applyDamage(spell, caster, target);
            }
            break;
        case "Magic Burst":
            // magic burst draine toute la mana du lanceur et inflige des dégâts proportionnels
            spell.damage = 0.3909 * caster.mana + 9.7091;
            spell.ko = 67 - caster.mana * 0.365;
            applyDamage(spell, caster, target);
            caster.mana = 0;
            break;
        case "Hocus Pocus":
            // hocus pocus active un effet aléatoire
            hocusPocus(caster, target);
            break;
        case "Heal":
            // heal soigne et a un nombre d’utilisations limitées
            caster.heal--;
            caster.id === target.id ? heal(caster) : heal(target);
            ko = "heal";
            break;

        default:
            applyDamage(spell, caster, target);
            break;
    }


    // 5. mise à jour de la db
    try {
        if (caster.id === target.id) {
            setStatsHero(caster.id, caster);
        } else {
            setStatsHero(caster.id, caster);
            setStatsHero(target.id, target);
        }
    } catch (error) {
        console.warn("Erreur SQL:" + error);
        interaction.reply({ embeds: [creerEmbedSpell("erreur", caster, target, spell)]});
        return;
    }


    // 6. réponse finale
    interaction.reply({ embeds: [creerEmbedSpell(ko, caster, target, spell)]});
};


exports.name = "spell";
exports.description = "Lance un sort\u202f!";
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
