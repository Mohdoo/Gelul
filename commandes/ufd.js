"use strict";

const { ApplicationCommandOptionType: OptionType } = require("discord-api-types/v10");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

/**
 * Crée un choix à partir d'un nom d'attaque.
 * Par exemple, "Fowrard Tilt 1" devient {name: "Forward Tilt 1", value: "forwardtilt1"}
 * @param {string} name l’attaque à transformer en choix
 * @returns un choix de paramètre de commande
 */
 const nameToChoice = name => ({name, value: name.replaceAll(" ", "").replaceAll("/", "").toLowerCase()});

 // liste des attaques pour lesquelles aucune animation/visualisation de la hitbox n’est disponible
const no_animation = [
    "neutralb",
    "upb",
    "downb",
    "bang",
    "sizz",
    "whack",
    "snooze",
    "heal",
    "oomph",
    "acceleratle",
    "bounce",
    "zoom",
    "hocuspocus",
    "psychup",
    "spotdodge",
    "forwardroll",
    "backwardroll",
    "neutralairdodge",
    "downairdodge",
    "diagonaldownairdodge",
    "leftrightairdodge",
    "diagonalupairdodge",
    "upairdodge",
    "stats"
];

// hitboxes qui sont en png et pas en gif
const png = [
    "thwack",
    "kaclang",
    "ledgegrab"
];

/**
 * Crée l’embed qui va être envoyé comme réponse à la commande
 */
const creerEmbedFrameData = (move) => {
    let m = new MessageEmbed()
            .setColor("#893d92")
            .setAuthor({ name: "Ultimate Frame Data", url: "https://ultimateframedata.com/" })
            .setTitle("Frame Data du Héros")
            .setURL("https://ultimateframedata.com/hero")
            .setFooter({ text: "UFD a été créé par MetalMusicMan" })
            .setImage(config.BASE_URL + "ufd/" + move + ".png");

    switch (move) {
        case "upb":
        case "upsmash":
            m.setDescription("Le Up B et le Up Smash ignorent les 11 frames de Shield Drop.");
            break;

        case "stats":
            m.setDescription("Le saut ignore les 11 frames de Shield Drop.");
            break;

        case "grab":
        case "dashgrab":
        case "pivotgrab":
            m.setDescription(
                    "Faire un Grab après qu’une attaque a frappé le bouclier prend 4 frames supplémentaires, mais ignore les 11 frames de Shield Drop.\n" +
                    "Héros a la deuxième pire portée de Grab du jeu (10,3 unités). Voir la [liste des portées de Grab](https://www.ssbwiki.com/Grab#In_Super_Smash_Bros._Ultimate)."
            );
            break;

        case "downb":
            m.setDescription(
                    "Le Héros regagne 1\u202fMP par seconde, et lorsqu’une attaque non-spéciale touche un adversaire ou un bouclier," +
                    "il regagne 80\u202f% des dégâts infligés en MP. Il ne gagne pas de MP tant que le menu de sorts est ouvert.\n" +
                    "Plus de détails sur la [page SSB Wiki dédiée](https://www.ssbwiki.com/MP_Gauge)."
            );
            break;

        case "getupattacks":
            m.setDescription("La Floor Attack inflige 6\u202f% si le Héros est allongé, et 5\u202f% s’il est assis.");
            break;

        case "ledgegrab":
        case "ledgehang":
            m.setDescription("Aucune donnée intéressante à afficher…");
            break;

        default:
            m.setDescription(
                    "Les statistiques de On Shield Advantage/Disadvantage supposent que le Shield a été touché par la première frame active de l’attaque.\n" +
                    "La Staleness affecte aussi l’advantage/disadvantage, que l’on frappe un personnage ou un Shield."
            );
            break;
    }
    return m;
}


/* Champs publics */


/**
 * Renvoie la frame data demandée
 */
exports.procedure = async (interaction) => {
    const attack = interaction.options.getString("move");
    
    let b = new MessageButton()
            .setCustomId(attack)
            .setLabel("Afficher")
            .setStyle("PRIMARY");

    if (no_animation.includes(attack)) b.setLabel("Aucune hitbox à afficher").setStyle("SECONDARY").setDisabled(true);
    const row = new MessageActionRow()
            .addComponents(b);
    
    interaction.reply({ embeds: [creerEmbedFrameData(attack)], components: [row] });
};

/**
 * Affiche la hitbox du move demandé
 */
exports.buttonProcedure = async (interaction) => {
    let m = interaction.message;
    m.components[0].setComponents(new MessageButton().setLabel("Image envoyée\u202f!").setStyle("SECONDARY").setDisabled(true).setCustomId("0"));
    interaction.message.edit({ embeds: m.embeds, components: m.components });
    
    let attack = interaction.customId;
    interaction.reply({ content: config.BASE_URL + "animations/" + attack + (png.includes(attack) ? ".png" : ".webm") });
};


exports.name = "ufd";
exports.description = "Permet de consulter la frame data du Héros.";
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
                        "name": "Neutral B (Frizz/Frizzle/Kafrizz)",
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
				].concat([
                    "Bang",
					"Kaboom",
                    "Sizz",
					"Sizzle",
					"Whack",
					"Thwack",
					"Kamikazee",
					"Magic Burst",
                    "Snooze",
					"Heal",
                    "Oomph",
                    "Acceleratle",
                    "Bounce",
                    "Kaclang",
                    "Zoom",
					"Hocus Pocus",
					"Flame Slash",
                    "Kacrackle Slash",
					"Hatchet Man",
                    "Metal Slash",
                    "Psych Up"
				].map(nameToChoice))
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
                "description": "Le dodge ou roll à afficher.",
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
