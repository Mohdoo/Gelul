const { MessageEmbed } = require("discord.js");
const { getLeaderBoard } = require("../database");

const name = "leaderboard";
const description = "Là où rêvent d’aller les plus grands héros\u202F!";
const protected = false;
const options = null;


/**
 * Affiche les trois joueurs ayant le plus de score dans le jeu.
 * @param {*} interaction 
 */
const procedure = async (interaction) => {
    const podium = getLeaderBoard();

    
    for (const e of podium) {
        const u = await interaction.guild.members.fetch(e.id);
        e.name = (u.displayName === undefined ? "[Héros ayant quitté le Havre]" : u.displayName);
    }

    // ajoute des scores par défaut s’il y a moins de trois joueurs enregistrés
    if (podium.length < 3) {
        // le héros légendaire
        podium.unshift({ name: "Roto", id: 3, score: 3333, percentage: 100 });
    }
    if (podium.length < 2) {
        // le jeune héros pris par la destinée
        podium.unshift({ name: "Luminary", id: 11, score: 111, percentage: 50 });
    }
    if (podium.length < 1) {
        // il vient juste de commencer à jouer mais ne vous inquiétez pas il va les rattraper
        podium.unshift({ name: "Solo", id: 4, score: 44, percentage: 0 });
    }

    const embed = new MessageEmbed()
            .setColor(0xf8d55f)
            .setTitle("Podium des Héros")
            .setDescription(
                    "Les trois Héros ayant le plus grand score sont ici\u202F!\n" +
                    "En cas d’égalité, c’est le pourcentage qui fait la différence."
            );

    for (const e of podium) {
        embed.addField(e.name, `${e.score} points, ${e.percentage}\u202F%`);
    }

    interaction.reply({ embeds: [embed] });
};


exports.name = name;
exports.description = description;
exports.protected = protected;
exports.options = options;
exports.procedure = procedure;
