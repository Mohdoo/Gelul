// produit une erreur MODULE_NOT_FOUND…
//const { ApplicationCommandOptionTypes } = require('discord.js/typings/enums');

/**
 * Renvoie la frame data demandée en option.
 * @param {*} interaction 
 */
const procedure = (interaction) => {
    /* nom de l’attaque choisie, donc options[X].options[0].choices[Y].value
     * comme ces valeurs sont uniques, on s’en fiche de savoir de quelle sous-commande X il s’agit
    */
    let attack = interaction.options.getString("move");
    interaction.reply(`Vous avez demandé le move ${attack}`); 
};


const name = "ufd";
const description = "Permet de consulter la frame data du Héros.";
const protected = false;
const options = [
    {
        "name": "ground-attacks",
        "description": "Affiche une des attaques au sol.",
        "type": 1,
        "options": [
            {
                "name": "move",
                "description": "L’attaque au sol à afficher.",
                "type": 3,
                "required": true,
                "choices": [
                    {
                        "name": "Jab 1",
                        "value": "jab1"
                    },
                    {
                        "name": "Jab 2",
                        "value": "jab2"
                    },
                    {
                        "name": "Jab 3",
                        "value": "jab3"
                    },
                    {
                        "name": "Forward Tilt 1",
                        "value": "forwardtilt1"
                    },
                    {
                        "name": "Forward Tilt 2",
                        "value": "forwardtilt2"
                    },
                    {
                        "name": "Up Tilt",
                        "value": "uptilt"
                    },
                    {
                        "name": "Down Tilt",
                        "value": "downtilt"
                    },
                    {
                        "name": "Dash Attack",
                        "value": "dashattack"
                    },
                    {
                        "name": "Forward Smash",
                        "value": "forwardsmash"
                    },
                    {
                        "name": "Up Smash",
                        "value": "upsmash"
                    },
                    {
                        "name": "Down Smash",
                        "value": "downsmash"
                    }
                ]
            }
        ]
    },
    {
        "name": "aerial-attacks",
        "description": "Affiche une des attaques aériennes.",
        "type": 1,
        "options": [
            {
                "name": "move",
                "description": "L’attaque aérienne à afficher.",
                "type": 3,
                "required": true,
                "choices": [
                    {
                        "name": "Neutral Air",
                        "value": "neutralair"
                    },
                    {
                        "name": "Forward Air",
                        "value": "forwardair"
                    },
                    {
                        "name": "Back Air",
                        "value": "backair"
                    },
                    {
                        "name": "Up Air",
                        "value": "upair"
                    },
                    {
                        "name": "Down Air",
                        "value": "downair"
                    }
                ]
            }
        ]
    },
    {
        "name": "special-attacks",
        "description": "Affiche une attaque spéciale.",
        "type": 1,
        "options": [
            {
                "name": "move",
                "description": "L’attaque spéciale à afficher.",
                "type": 3,
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
                    {
                        "name": "Bang",
                        "value": "bang"
                    },
                    {
                        "name": "Kaboom",
                        "value": "kaboom"
                    },
                    {
                        "name": "Sizz",
                        "value": "sizz"
                    },
                    {
                        "name": "Sizzle",
                        "value": "sizzle"
                    },
                    {
                        "name": "Whack",
                        "value": "whack"
                    },
                    {
                        "name": "Thwack",
                        "value": "thwack"
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
                        "name": "Snooze",
                        "value": "snooze"
                    },
                    {
                        "name": "Heal",
                        "value": "heal"
                    },
                    {
                        "name": "Oomph",
                        "value": "oomph"
                    },
                    {
                        "name": "Acceleratle",
                        "value": "acceleratle"
                    },
                    {
                        "name": "Bounce",
                        "value": "bounce"
                    },
                    {
                        "name": "Kaclang",
                        "value": "kaclang"
                    },
                    {
                        "name": "Zoom",
                        "value": "zoom"
                    },
                    {
                        "name": "Hocus Pocus",
                        "value": "hocuspocus"
                    },
                    {
                        "name": "Flame Slash",
                        "value": "flameslash"
                    },
                    {
                        "name": "Kacrackle Slash",
                        "value": "kacrackleslash"
                    },
                    {
                        "name": "Hatchet Man",
                        "value": "hatchetman"
                    },
                    {
                        "name": "Metal Slash",
                        "value": "metalslash"
                    },
                    {
                        "name": "Psych Up",
                        "value": "psychup"
                    }
                ]
            }
        ]
    },
    {
        "name": "grabs-throws",
        "description": "Affiche un grab ou un throw.",
        "type": 1,
        "options": [
            {
                "name": "move",
                "description": "Le grab ou throw à afficher.",
                "type": 3,
                "required": true,
                "choices": [
                    {
                        "name": "Grab",
                        "value": "grab"
                    },
                    {
                        "name": "Dash Grab",
                        "value": "dashgrab"
                    },
                    {
                        "name": "Pivot Grab",
                        "value": "pivotgrab"
                    },
                    {
                        "name": "Pummel",
                        "value": "pummel"
                    },
                    {
                        "name": "Forward Throw",
                        "value": "forwardthrow"
                    },
                    {
                        "name": "Backward Throw",
                        "value": "backwardthrow"
                    },
                    {
                        "name": "Up Throw",
                        "value": "upthrow"
                    },
                    {
                        "name": "Down Throw",
                        "value": "downthrow"
                    }
                ]
            }
        ]
    },
    {
        "name": "dodges-rolls",
        "description": "Affiche un dodge ou un roll.",
        "type": 1,
        "options": [
            {
                "name": "move",
                "description": "Le grab ou throw à afficher.",
                "type": 3,
                "required": true,
                "choices": [
                    {
                        "name": "Spot Dodge",
                        "value": "spotdodge"
                    },
                    {
                        "name": "Forward Roll",
                        "value": "forwardroll"
                    },
                    {
                        "name": "Backward Roll",
                        "value": "backwardroll"
                    },
                    {
                        "name": "Neutral Air Dodge",
                        "value": "neutralairdodge"
                    },
                    {
                        "name": "Down Air Dodge",
                        "value": "downairdodge"
                    },
                    {
                        "name": "Diagonal Down Air Dodge",
                        "value": "diagonaldownairdodge"
                    },
                    {
                        "name": "Left/Right Air Dodge",
                        "value": "leftrightairdodge"
                    },
                    {
                        "name": "Diagonal Up Air Dodge",
                        "value": "diagonalupairdodge"
                    },
                    {
                        "name": "Up Air Dodge",
                        "value": "upairdodge"
                    }
                ]
            }
        ]
    },
    {
        "name": "misc-info",
        "description": "Affiche des statistiques générales, ou les getup attacks.",
        "type": 1,
        "options": [
            {
                "name": "move",
                "description": "La statistique à afficher.",
                "type": 3,
                "required": true,
                "choices": [
                    {
                        "name": "Stats",
                        "value": "stats"
                    },
                    {
                        "name": "Ledge Grab",
                        "value": "ledgegrab"
                    },
                    {
                        "name": "Ledge Hang",
                        "value": "ledgehang"
                    },
                    {
                        "name": "Getup Attacks",
                        "value": "getupattacks"
                    },
                ]
            }
        ]
    }
];


exports.procedure = procedure;
exports.name = name;
exports.description = description;
exports.protected = protected;
exports.options = options;
