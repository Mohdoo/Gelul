const { ApplicationCommandOptionType } = require("discord-api-types/v10");
const { getStatsHero, setStatsHero } = require("../database");
const spells_data = require("../spells.json");

/**
 * Modifie stats d’un joueur après avoir perdu une stock
 * Baisse son score et réinitialise sa mana et son pourcentage
 * @param {*} hero le héros qui perd une stock
 */
const kill = (hero) => {
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
    const plus_ou_moins = Math.random() * 20 - 10;
    spell.ko = (spell.ko !== null ? spell.ko + plus_ou_moins : null);

    if (spell.ko !== null && target.percentage >= spell.ko) {
        kill(target);
        caster.score++;
    } else {
        spell.damage += Math.random() * 5 - 2.5;
        if (spell.name !== "Heal" && spell.damage < 1) {
            spell.damage = 1;
        }
        target.percentage = Number((target.percentage + spell.damage).toFixed(1));
    }
};

/* Champs publics */

const name = "spell";
const description = "Lance un sort\u202F!";
const protected = false;
const options = [
    {
        "type": ApplicationCommandOptionType.String,
        "name": "sort",
        "description": "Le sort à lancer.",
        "required": true,
        "choices": [
            {
                "name": "Whack",
                "value": "whack"
            },
            {
                "name": "Thwack",
                "value": "thwack"
            },
            {
                "name": "Kaboom",
                "value": "kaboom"
            },
            {
                "name": "Hatchet Man",
                "value": "hatchetman"
            },
            {
                "name": "Sizzle",
                "value": "sizzle"
            },
            {
                "name": "Kamikazee",
                "value": "kamikazee"
            },
            {
                "name": "Magic Burst",
                "value": "magicburst"
            },
            {
                "name": "Heal",
                "value": "heal"
            },
            {
                "name": "Hocus Pocus",
                "value": "hocuspocus"
            },
            {
                "name": "Flame Slash",
                "value": "flameslash"
            }
        ]
    },
    {
        "type": ApplicationCommandOptionType.User,
        "name": "cible",
        "description": "La personne sur qui lancer le sort.",
        "required": true
    }
];


/**
 * Répond par un message tout bête.
 * @param {*} interaction 
 */
const procedure = (interaction) => {
    // 0. Initialisation des variables nécessaires

    // le membre qui a lancé le sort
    const caster_id = interaction.member.id;
    // le sort lancé
    const spell_name = interaction.options.getString("sort");
    // la cible du sort
    const target_id = interaction.options.getMember("cible").id;

    let caster = getStatsHero(caster_id);
    let target = getStatsHero(target_id);
    let spell = spells_data.spells[spell_name];

    // 1. vérification de la validité de la cible (seul Heal peut avoir caster === target)
    if (spell_name !== "heal" && caster_id === target_id) {
        interaction.reply({ephemeral: true, content: "Seul Heal peut être lancé sur soi-même."});
        return;
    } else if (spell_name === "heal" && caster.heal === 0) {
        interaction.reply({ephemeral: true, content: "Déso pas déso t’as cramé tous tes Heals pour cette stock"});
        return;
    }

    // 2. met à jour la mana du lanceur, puis vérifie s’il en a assez
    let now = Date.now();

    /* calcul de la mana gagnée depuis le dernier sort lancé 
       Si mana < 100 alors last_spell_ts est forcément !== undefined */
    if (caster.mana < 100) {
        let temps_ecoule = (now - caster.last_spell_ts) / spells_data.mana_refill_time;
        caster.mana += Number(temps_ecoule.toFixed(0));
        // limite la mana à 100
        caster.mana = (caster.mana > spells_data.new_hero.mana ? spells_data.new_hero.mana : caster.mana);
    }

    // si le lanceur a assez de mana, il paie le coût du sort
    if (caster.mana < spell.cost) {
        interaction.reply(`Il ta faut ${spell.cost} MP mais t’en as ${caster.mana}`);
        return;
    } else {
        caster.mana -= spell.cost;
    }

    if (caster.last_spell_ts === undefined || caster.mana + spell.cost === 100) {
        /* premier sort lancé par ce joueur
        OU sort lancé en ayant 100 mana (pour éviter que grâce au refill on ait virtuellement 11 mana)*/
        caster.last_spell_ts = now;
    } else {
        // le joueur avait déjà lancé un sort avant
        let manque = (now - caster.last_spell_ts) % spells_data.mana_refill_time;
        caster.last_spell_ts = now - (spells_data.mana_refill_time - manque)
    }

    // 3. calcul de précision
    if (Math.random() > spell.precision) {
        interaction.reply(`Precision check échoué, t’es deg\u202F? ${caster.mana} MP`);
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

            if (Math.random() * 100 < kill_chance) {
                kill(target);
                caster.score++;
            } else {
                // vu le calcul plus haut, c’est impossible d’éjecter avec Whack ou Thwack
                applyDamage(spell, caster, target);
            }
            break;
        case "kamikazee":
            // kamikazee instant KO son lanceur
            kill(caster);
            applyDamage(spell, caster, target);
            break;
        case "magicburst":
            // magic burst draine toute la mana du lanceur et inflige des dégâts proportionnels
            spell.damage = 0.3909 * caster.mana + 9.7091;
            spell.ko = 67 - caster.mana * 0.365;
            applyDamage(spell, caster, target);
            caster.mana = 0;
            break;
        case "hocuspocus":
            // hocus pocus active un effet aléatoire
            // todo
            kill(caster); // pour le moment Hocus Pocus n’est pas implémenté, donc ptdr t’es mort
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
    setStatsHero(caster_id, caster);
    setStatsHero(target_id, target);

    // 6. réponse finale
    interaction.reply(`
            Vous utilisez ${spell.name} sur ${interaction.options.getMember("cible").displayName}\u202F!
            Nouvelles stats\u202F:
            - ${interaction.member.displayName} → ${caster.percentage}\u202F%, score ${caster.score}, ${caster.mana} MP
            - ${interaction.options.getMember("cible").displayName} → ${target.percentage}\u202F%, score ${target.score}, ${target.mana} MP
    `);
};


exports.name = name;
exports.description = description;
exports.protected = protected;
exports.options = options;
exports.procedure = procedure;
