# Gelul, le bot gluant

Bot créé exclusivement pour le smashcord francophone [Le Havre des Aventuriers](https://discord.gg/sevQSfS).

## Utilisation

Installez les modules Node.js demandés par [package.json](./package.json).  
Créez le fichier *config.json* en utilisant comme modèle [example.config.json](./example.config.json). Vous noterez que la config est faite pour une seule guilde. Normal, le bot a été créé pour une seule guilde, et part du principe que les permissions sont bien gérées. Étendre ses capacités sur ce plan n’est clairement pas une priorité.  
Déclarez les commandes du bot à l’API : `node register.js`.  
Si les commandes sont correctement déclarées, vous pouvez maintenant lancer le bot : `node main.js`.

## Idées

### Frame data
Commande pour afficher la frame data du personnage. Sous quelle forme afficher tout ça ? Faudrait essayer de limiter au maximum l’envoi d’images, par exemple avec des embeds.  
`/ufd [attaque]` affiche les données et (si possible) la hitbox de l’attaque donnée.

### Mini-jeu
Chaque membre du serveur possède une jauge de mana, un pourcentage et un score. La mana se recharge lentement avec le temps, et peut être utilisée pour lancer des sorts parmi une sélection des sorts du Héros dans Smash. Chaque sort coûte la même mana et inflige les mêmes dégâts que dans le jeu. Un calcul est fait pour voir si la cible est expulsée. Si c’est le cas, le lanceur gagne un point de score et la cible en perd un.  
`/spell <attaque: choice> <cible: user>` lance un sort.  
`/stats [membre: user]` affiche les stats d’un membre. Si omis, affiche les stats du lanceur.  
`/leaderboard` affiche les meilleurs scores.  
Utiliser des subcommands ? `/spell attack <attaque: choice> <cible: user>` `/spell stats [member: user]` `/spell leaderboard`

### Message de bienvenue
Le bot envoie un message pour saluer les gens qui rejoignent le serveur. [Message d’accueil actuel](https://discord.com/channels/588074121980805120/588075108975771691/928032992402735124).

### Nouvelles vidéos
Le bot envoie des liens vers les vidéos de matchs où un Héros apparaît dès qu’elles sont postées sur Youtube, en suivant une liste de chaînes, par exemple [VGBootCamp](https://www.youtube.com/c/Vgbootcamp).
