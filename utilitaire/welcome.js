"use strict";

const { MessageEmbed } = require("discord.js");

exports.welcomeMessage = async (member) => {
    const welcome_channel = await member.guild.channels.fetch(config.WELCOME_CHANNEL_ID);
    const m = new MessageEmbed()
            .setColor(0xe91e62)
            .setDescription(`Bienvenue <@${member.id}> dans **Le Havre des Aventuriers**, le Discord français des joueurs des Héros de Dragon Quest\u202f!

                    Pour accéder à l’entièreté du serveur, rends-toi dans le channel <#588075168480493588> pour y demander un des rôles obligatoires.
                    N’oublie pas de lire les <#588075040625655831> et enfin n’hésite pas à te présenter dans <#588075154836422681> avant de venir dire bonjour dans <#588074122601431051> pour découvrir la commu\u202f!
                    Si tu es débutant sur le personnage, je te recommande de lire <#809445362033098752>\u202f!`
            )
            .setThumbnail(config.BASE_URL + "welcome.png");
    welcome_channel.send({ embeds : [m] });
};
