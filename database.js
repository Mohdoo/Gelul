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
const { new_hero } = require("./spells.json");
let createNewHeroQuery;
let getStatsHeroQuery;
let setStatsHeroQuery;
let db;

const createNewHero = (id) => {
    createNewHeroQuery.run(id);
    console.log("Ajout du membre " + id + " dans la base de données.");
};

/* Champs publics */

/**
 * Crée les tables de la base de données si elles n’existent pas.
 */
const initDatabase = () => {
    db = require("better-sqlite3")(config.DATABASE_FILENAME);

    db.prepare(`
            CREATE TABLE IF NOT EXISTS heros (
                id TEXT PRIMARY KEY,
                percentage REAL DEFAULT ${new_hero.percentage},
                score INTEGER DEFAULT ${new_hero.score},
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
    createNewHeroQuery = db.prepare("INSERT INTO heros (id) VALUES (?)");
    getStatsHeroQuery = db.prepare("SELECT percentage, score, mana, heal, last_spell_ts FROM heros WHERE id = ?");
    /* est-ce qu’il vaut mieux préparer une update générale ici, quitte à réécrire une donnée inchangée,
     ou en préparer plusieurs pour tous les cas, ou en générer une lors de l’écriture ? */
    setStatsHeroQuery = db.prepare("UPDATE heros SET percentage = ?, score = ?, mana = ?, heal = ?, last_spell_ts = ? WHERE id = ?");

    console.log("Requêtes de la base de données prêtes.");
};

/**
 * Renvoie les stats d’un joueur, et le crée s’il n’existe pas encore.
 * @param {*} id le joueur dont on veut les stats
 * @returns les stats du joueur, ou des stats par défaut si le joueur a été créé
 */
const getStatsHero = (id) => {
    let res = getStatsHeroQuery.get(id);
    
    if (res === undefined) {
        createNewHero(id);
        return new_hero;
    } else {
        return res;
    }
};

/**
 * Met à jour les stats d’un joueur déjà existant.
 * @param {*} id joueur à modifier
 * @param {*} stats un objet contenant des valeurs correctes pour percentage, score, mana et last_spell_ts
 */
const setStatsHero = (id, stats) => {
    setStatsHeroQuery.run(stats.percentage, stats.score, stats.mana, stats.heal, stats.last_spell_ts, id);
};

/**
 * Ferme la base de données.
 */
const closeDatabase = () => {
    db.close();
}

exports.initDatabase = initDatabase;
exports.getStatsHero = getStatsHero;
exports.setStatsHero = setStatsHero;
exports.closeDatabase = closeDatabase;
