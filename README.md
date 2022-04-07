# Gelul, le bot gluant

Bot créé exclusivement pour le smashcord francophone [Le Havre des Aventuriers](https://discord.gg/sevQSfS).

## Utilisation

Installez les modules Node.js demandés par [package.json](./package.json).  
Créez le fichier *config.json* en utilisant comme modèle [example.config.json](./example.config.json). Vous noterez que la config est faite pour une seule guilde. Normal, le bot a été créé pour une seule guilde, et part du principe que les permissions sont bien gérées. Étendre ses capacités sur ce plan n’est clairement pas une priorité.  
Déclarez les commandes du bot à l’API : `node register.js`.  
Si les commandes sont correctement déclarées, vous pouvez maintenant lancer le bot : `node main.js`.

## Organisation des fichiers

Chaque fichier JavaScript dans le dossier `commandes` représente une et une seule commande du bot. La liste est `config.commands`. Voilà c’est tout allez salut abonne-toi.

## Idées

### Frame data
*Partie commande faite. Reste à faire la réponse…*  
Commande pour afficher la frame data du personnage. Sous quelle forme afficher tout ça ? Faudrait essayer de limiter au maximum l’envoi d’images, par exemple avec des embeds.  
`/ufd [attaque]` affiche les données et (si possible) la hitbox de l’attaque donnée.

### Mini-jeu
*`/spell` implémenté. Reste à faire la réponse…*  
*`/stats` implémenté.*  
*`/leaderboard` implémenté.*  
Chaque membre du serveur possède une jauge de mana, un pourcentage et un score. La mana se recharge lentement avec le temps, et peut être utilisée pour lancer des sorts parmi une sélection des sorts du Héros dans Smash. Chaque sort coûte la même mana et inflige les mêmes dégâts que dans le jeu. Un calcul est fait pour voir si la cible est expulsée. Si c’est le cas, le lanceur gagne un point de score et la cible en perd un.  
`/spell <attaque: choice> <cible: user>` lance un sort.  
`/stats [membre: user]` affiche les stats d’un membre. Si omis, affiche les stats du lanceur.  
`/leaderboard` affiche les meilleurs scores.  
Utiliser des subcommands ? `/spell attack <attaque: choice> <cible: user>` `/spell stats [member: user]` `/spell leaderboard`

### Message de bienvenue
*Implémenté. Reste à faire la réponse…*  
Le bot envoie un message pour saluer les gens qui rejoignent le serveur. [Message d’accueil actuel](https://discord.com/channels/588074121980805120/588075108975771691/928032992402735124).

### Nouvelles vidéos
Le bot envoie des liens vers les vidéos de matchs où un Héros apparaît dès qu’elles sont postées sur Youtube, en suivant une liste de chaînes, par exemple [VGBootCamp](https://www.youtube.com/c/Vgbootcamp).

### Choix d’un skin
Ça retourne un skin parmi les 8 du jeu, accompagné d'une petite phrase (rigolote et/ou avec une réf au jeu d'inspiration de préférence) selon le skin tiré, pour indiquer par exemple le prochain qu'on va jouer (si quelqu'un a du mal à se décider)

### Optimisations non prioritaires
[À faire régulièrement svp] Review et clean du code.  
Faire en sorte que `ufd.js` et `spell.js` utilisent la même liste de sorts pour ne pas avoir à écrire les noms et stats deux fois.  
Localiser les slash commands (est-il seulement possible de localiser `/spell` côté serveur ?).  
Automatiser `register.js`.  
Regarder comment supprimer une commande déclarée à l’API (pour le moment on ne fait qu’en ajouter et modifier celles qui existent). Si le nombre de commandes devient grand, ne redéclarer que celles qui ont changé.
