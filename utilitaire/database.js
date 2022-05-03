"use strict";

/**
 * Gère la base de données du bot,
 * qui pour le moment n’est utilisée que pour /spell.
 * La base de données ne sert qu’à stocker les données qui sont créées
 * lorsque le bot tourne, c’est à dire les stats des joueurs.
 * Tout ce qui est constant comme les noms et stats des sorts est en JSON.
 * Dans la DB, un joueur est appelé un “hero”.
 * Pour le moment, on peut ajouter et modifier un joueur, mais pas en supprimer.
 */

// représente un joueur quand il est ajouté dans la base
const { new_hero } = require("../data/spells.json");
let create_new_hero_query;
let get_stats_hero_query;
let set_stats_hero_query;
let get_leaderboard_query;
let db;

const createNewHero = (id) => {
    create_new_hero_query.run(id);
    console.log(`Ajout du membre ${id} dans la base de données.`);
};

/**
 * Crée les tables de la base de données si elles n’existent pas.
 */
db = require("better-sqlite3")(config.DATABASE_FILENAME);

db.prepare(`
        CREATE TABLE IF NOT EXISTS heros (
            id TEXT PRIMARY KEY NOT NULL,
            percentage REAL DEFAULT ${new_hero.percentage},
            score INTEGER DEFAULT ${new_hero.score},
            invisibility INTEGER DEFAULT ${new_hero.invisibility},
            mana INTEGER DEFAULT ${new_hero.mana} CHECK (
                mana >= 0 AND mana <= ${new_hero.mana}
            ),
            heal INTEGER DEFAULT ${new_hero.heal} CHECK (
                heal >= 0 AND heal <= ${new_hero.heal}
            ),
            last_spell_ts BLOB
        )
`).run();

console.log("Base de données des joueurs initialisée.");

// on prépare les queries qui vont être utilisées par les autres fonctions ici
create_new_hero_query = db.prepare("INSERT INTO heros (id) VALUES (?)");
get_stats_hero_query = db.prepare("SELECT percentage, score, mana, heal, last_spell_ts FROM heros WHERE id = ?");
/* est-ce qu’il vaut mieux préparer une update générale ici, quitte à réécrire une donnée inchangée,
    ou en préparer plusieurs pour tous les cas, ou en générer une lors de l’écriture ? Je fais le choix numéro 1 */
set_stats_hero_query = db.prepare(`UPDATE heros SET
        percentage = $percentage, score = $score, mana = $mana, heal = $heal, last_spell_ts = $last_spell_ts, invisibility = $invisibility
        WHERE id = $id`);
get_leaderboard_query = db.prepare("SELECT percentage, score, id FROM heros ORDER BY score DESC, percentage ASC LIMIT 3");

console.log("Requêtes de la base de données prêtes.");


/* Champs publics */

/**
 * Renvoie les stats d’un joueur, et le crée s’il n’existe pas encore.
 * @param {*} id le joueur dont on veut les stats
 * @returns les stats du joueur, ou des stats par défaut si le joueur a été créé
 */
const getStatsHero = (id) => {
    let res = get_stats_hero_query.get(id);

    if (res === undefined) {
        createNewHero(id);
        // Il faut créer une copie du nouveau héros pour pas écrire dessus
        return {...new_hero};
    } else {
        return res;
    }
};

/**
 * Met à jour les stats d’un joueur déjà existant.
 * @param {*} id joueur à modifier
 * @param {*} stats un objet contenant des valeurs correctes pour percentage, score, mana et last_spell_ts
 */
const setStatsHero = (id, stats) => set_stats_hero_query.run({id, ...stats});

/**
 * Renvoie un array contenant les 3 joueurs avec le plus grand score
 */
const getLeaderBoard = () => get_leaderboard_query.all();

/**
 * Ferme la base de données.
 */
const closeDatabase = () => db.close();

exports.getStatsHero = getStatsHero;
exports.setStatsHero = setStatsHero;
exports.getLeaderBoard = getLeaderBoard;
exports.closeDatabase = closeDatabase;
