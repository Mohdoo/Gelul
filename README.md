# Gelul, le bot gluant

Bot créé exclusivement pour le smashcord francophone [Le Havre des Aventuriers](https://discord.gg/sevQSfS).

## Utilisation

Installez les modules Node.js demandés par [package.json](./package.json).  
Créez le fichier *config.json* en utilisant comme modèle [example.config.json](./example.config.json). Vous noterez que la config est faite pour une seule guilde. Normal, le bot a été créé pour une seule guilde, et part du principe que les permissions sont bien gérées. Étendre ses capacités sur ce plan n’est clairement pas une priorité.  
Pour lancer le bot : `node main.js`.

## Organisation des fichiers

Chaque fichier JavaScript dans le dossier `commandes` représente une et une seule commande du bot. La liste est `config.commands`.  

Le dossier `utilitaire` contient tous les fichiers JavaScript qui ne sont pas des commandes, hormis `main.js` qui est le seul à la racine.  
Le dossier `data` contient les données statiques en JSON et je recommande d’y mettre aussi le fichier de base de données.

## Idées

### Frame data
*`/ufd` implémenté.*  
Commande pour afficher la frame data du personnage.  
`/ufd <catégorie d’attaques : choice> <attaque : choice>` affiche les données et (si possible) la hitbox de l’attaque donnée.
On utilise des subcommands (la « catégorie » de frame data à afficher) car on a une limite de 25 choix   
Comme on ne fait que répéter les données d’UFD, certaines sont manquantes ou incomplètes.

### Mini-jeu
*`/spell` implémenté.*  
*`/stats` implémenté.*  
*`/leaderboard` implémenté.*  
Chaque membre du serveur possède une jauge de mana, un pourcentage et un score. La mana se recharge lentement avec le temps, et peut être utilisée pour lancer des sorts parmi une sélection des sorts du Héros dans Smash. Chaque sort coûte la même mana et inflige les mêmes dégâts que dans le jeu. Un calcul est fait pour voir si la cible est expulsée. Si c’est le cas, le lanceur gagne un point de score et la cible en perd un.  
`/spell <attaque: choice> <cible: user>` lance un sort.  
`/stats [membre: user]` affiche les stats d’un membre. Si omis, affiche les stats du lanceur.  
`/leaderboard` affiche les meilleurs scores.  

### Message de bienvenue
*Implémenté.*  
Le bot envoie un message pour saluer les gens qui rejoignent le serveur.

### Nouvelles vidéos
Le bot envoie des liens vers les vidéos de matchs où un Héros apparaît dès qu’elles sont postées sur Youtube, en suivant une liste de chaînes, par exemple [VGBootCamp](https://www.youtube.com/c/Vgbootcamp).

### Choix d’un skin
Ça retourne un skin parmi les 8 du jeu, accompagné d’une petite phrase (rigolote et/ou avec une réf au jeu d’inspiration de préférence) selon le skin tiré, pour indiquer par exemple le prochain qu’on va jouer (si quelqu’un a du mal à se décider)

### Optimisations non prioritaires
[À faire régulièrement svp] Review et clean du code.  
Faire en sorte que `ufd.js` et `spell.js` utilisent la même liste de sorts pour ne pas avoir à écrire les noms et stats deux fois.  
Localiser les slash commands (est-il seulement possible de localiser `/spell` côté serveur ?). → peut-être pas au final car on par du principe que les utilisateurs parlent français et utilisent le vocabulaire anglophone du jeu.  

## Contribuer

Je suis toujours ouvert aux suggestions de nouvelles commandes et aux améliorations de code.
J’ai conscience que je suis un débutant en JS, et que certaines parties sont « sales » à cause du nombre de données hardcodées.
Mais que voulez-vous, c’est un bot Discord, on peut pas y échapper entièrement.  
N’hésitez pas à lire les [conventions](./conventions.md) que j’utilise pour coder.  
De manière générale, toute critique est bienvenue, tant qu’elle a pour but d’améliorer le bot.
