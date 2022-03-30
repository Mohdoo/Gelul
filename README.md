# Gelul, le bot gluant

Bot créé exclusivement pour le smashcord francophone [Le Havre des Aventuriers](https://discord.gg/sevQSfS).

## Utilisation

Installez les modules Node.js demandés par [package.json](./package.json).  
Créez le fichier *config.json* en utilisant comme modèle [example.config.json](./example.config.json).  
Déclarez les commandes du bot à l’API : `node register.js`.  
Si les commandes sont correctement déclarées, vous pouvez maintenant lancer le bot : `node main.js`.

## Idées

### Frame data
Commande pour afficher la frame data du personnage.  
`/ufd [attaque]` affiche les données et (si possible) la hitbox de l’attaque donnée. Si le paramètre est omis, donne juste le lien vers la [page UFD du Héros](https://ultimateframedata.com/hero).

### Mini-jeu
Chaque membre du serveur possède une jauge de mana, un pourcentage et un score. La mana se recharge lentement avec le temps, et peut être utilisée pour lancer des sorts parmi une sélection des sorts du Héros dans Smash. Chaque sort coûte la même mana et inflige les mêmes dégâts que dans le jeu. Un calcul est fait pour voir si la cible est expulsée. Si c’est le cas, le lanceur gagne un point de score et la cible en perd un.  
`/spell <attaque> <cible>` lance un sort.  
`/stats [membre]` affiche les stats d’un membre. Si omis, affiche les stats du lanceur.  
`/leaderboard` affiche les meilleurs scores.

### Message de bienvenue
Le bot envoie un message pour saluer les gens qui rejoignent le serveur. [Message d’accueil actuel](https://discord.com/channels/588074121980805120/588075108975771691/928032992402735124).
