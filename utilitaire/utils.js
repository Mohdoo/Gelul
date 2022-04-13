"use strict";

/**
 * Fichier où on met toutes les fonctions qui peuvent servir
 * de manière globale
 */

/**
 * @returns Un élément au hasard parmi ceux de l’array
 */
Array.prototype.choice = function() {
    return this[Math.floor(Math.random() * this.length)];
};
