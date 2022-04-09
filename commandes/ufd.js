"use strict";

const { ApplicationCommandOptionType: OptionType } = require("discord-api-types/v10");
const { MessageEmbed } = require("discord.js");

const { spells } = require("../spells.json");

/**
 * Crée l’embed qui va être envoyé comme réponse à la commande
 * https://discordjs.guide/popular-topics/embeds.html#using-the-embed-constructor
 * @param {*} move l’attaque ou la statistique à afficher
 * @returns un MessageEmbed prêt à être envoyé, contenant les données du move
 */
const creerEmbedFrameData = (move) => {
    return new MessageEmbed()
            .setColor("#893d92")
            .setDescription(`Description du move ${move}. Vivement qu’on ajoute des vraies données\u202F!`);
}


/**
 * Crée un choix à partir d'un nom d'attaque.
 * Par exemple, "Fowrard Tilt 1" devient {name: "Forward Tilt 1", value: "forwardtilt1"}
 * @param {string} name l’attaque à transformer en choix
 * @returns un choix de paramètre de commande
 */
const nameToChoice = name => ({name, value: name.replaceAll(" ", "").replaceAll("/", "").toLowerCase()});

/* Champs publics */

exports.name = "ufd";
exports.description = "Permet de consulter la frame data du Héros.";
exports.defaultPermission = true;
exports.options = [
    {
        "name": "ground-attacks",
        "description": "Affiche une des attaques au sol.",
        "type": OptionType.Subcommand,
        "options": [
            {
                "name": "move",
                "description": "L’attaque au sol à afficher.",
                "type": OptionType.String,
                "required": true,
                "choices": [
					"Jab 1",
					"Jab 2",
					"Jab 3",
					"Forward Tilt 1",
					"Forward Tilt 2",
					"Up Tilt",
					"Down Tilt",
					"Dash Attack",
					"Forward Smash",
					"Up Smash",
					"Down Smash",
                ].map(nameToChoice)
            }
        ]
    },
    {
        "name": "aerial-attacks",
        "description": "Affiche une des attaques aériennes.",
        "type": OptionType.Subcommand,
        "options": [
            {
                "name": "move",
                "description": "L’attaque aérienne à afficher.",
                "type": OptionType.String,
                "required": true,
                "choices": [
					"Neutral Air",
					"Forward Air",
					"Back Air",
					"Up Air",
					"Down Air",
                ].map(nameToChoice)
            }
        ]
    },
    {
        "name": "special-attacks",
        "description": "Affiche une attaque spéciale.",
        "type": OptionType.Subcommand,
        "options": [
            {
                "name": "move",
                "description": "L’attaque spéciale à afficher.",
                "type": OptionType.String,
                "required": true,
                "choices": [
                    {
                        "name": "Neutral B (Frizz/Frizzle/Kafriz)",
                        "value": "neutralb"
                    },
                    {
                        "name": "Side B (Zap/Zapple/Kazap)",
                        "value": "sideb"
                    },
                    {
                        "name": "Up B (Woosh/Swoosh/Kaswoosh)",
                        "value": "upb"
                    },
                    {
                        "name": "Down B (Menu/Select)",
                        "value": "downb"
                    },
				].concat(Object.entries(spells).map(([value, {name}]) => ({name, value})))
            }
        ]
    },
    {
        "name": "grabs-throws",
        "description": "Affiche un grab ou un throw.",
        "type": OptionType.Subcommand,
        "options": [
            {
                "name": "move",
                "description": "Le grab ou throw à afficher.",
                "type": OptionType.String,
                "required": true,
                "choices": [
					"Grab",
					"Dash Grab",
					"Pivot Grab",
					"Pummel",
					"Forward Throw",
					"Backward Throw",
					"Up Throw",
					"Down Throw",
                ].map(nameToChoice)
            }
        ]
    },
    {
        "name": "dodges-rolls",
        "description": "Affiche un dodge ou un roll.",
        "type": OptionType.Subcommand,
        "options": [
            {
                "name": "move",
                "description": "Le grab ou throw à afficher.",
                "type": OptionType.String,
                "required": true,
                "choices": [
					"Spot Dodge",
					"Forward Roll",
					"Backward Roll",
					"Neutral Air Dodge",
					"Down Air Dodge",
					"Diagonal Down Air Dodge",
					"Left/Right Air Dodge",
					"Diagonal Up Air Dodge",
					"Up Air Dodge",
                ].map(nameToChoice)
            }
        ]
    },
    {
        "name": "misc-info",
        "description": "Affiche des statistiques générales, ou les getup attacks.",
        "type": OptionType.Subcommand,
        "options": [
            {
                "name": "move",
                "description": "La statistique à afficher.",
                "type": OptionType.String,
                "required": true,
                "choices": [
					"Stats",
					"Ledge Grab",
					"Ledge Hang",
					"Getup Attacks",
                ].map(nameToChoice)
            }
        ]
    }
];


/**
 * Renvoie la frame data demandée en option.
 * @param {*} interaction
 */
exports.procedure = async (interaction) => {
    /* nom de l’attaque choisie, donc options[X].options[0].choices[Y].value
       comme ces valeurs sont uniques, on s’en fiche de savoir de quelle sous-commande X il s’agit */
    const attack = interaction.options.getString("move");
    interaction.reply({ embeds: [creerEmbedFrameData(attack)]});
};
