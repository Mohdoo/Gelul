# Conventions d’écriture

**Je mets ici ma manière d’écrire du JavaScript. Ne vous sentez pas obligés de suivre ces indications, mais je pourrais les appliquer en faisant un cleanup de code.**  

Prévoir de réorganiser les dossiers/fichiers du bot.

Mon code est un mélange bizarre d’anglais et de français… Dommage ! On pourra essayer d’harmoniser tout ça un jour.

---

Dans chaque fichier JS, essayer d’organiser ainsi :
```
imports
attributs privés
fonctions privées
attributs à exporter
fonctions à exporter
exports
```

Indentations : avec 4 espaces

Le nom des variables est en `snake_case`, celui des fonctions en `lowerCamelCase`, celui des classes en `CamelCase`, et certaines constantes importantes qui ne sont pas des objets est en `UPPER_SNAKE_CASE`. Mais c’est plus l’habitude qu’une vraie convention.

Faire attention au choix entre `const`, `let` et `var` quand on déclare une variable. Ne jamais déclarer sans mot-clé.
> `const` : variable qu’on ne modifie pas  
> `let` : déclaration par défaut, portée sur le bloc  
> `var` : portée sur la fonction (à n’utiliser que si c’est justifié)

Les accolades sont faites comme ça :  
```js
if (my_var === 1) {
    console.log("Var is 1.");
}
```
Ne pas oublier le point-virgule à la fin de chaque instruction.

Pour les comparaisons, utiliser `===` le plus souvent possible, au lieu de `==`.

Retours à la ligne : ne pas hésiter à en utiliser pour augmenter la lisibilité du code.

Quand on importe un module avec `require()`, essayer de désérialiser pour ne pas importer d’éléments superflus qui ralentiraient le code :  
```js
const my_module = require("my_module"); // risque d’importer des éléments en trop
console.log(mymodule.my_object);

const { my_object, other_object } = require("my_module");
console.log(my_object);
```
Pour l’import, j’utilise `require()` au lieu de `import`. Même syntaxe CommonJS pour les exports.

Pour les chaînes de caractères, je préfère utiliser `"` et \` quand il faut faire un litéral de gabarit. De même, faire attention avec les caractères spéciaux, utiliser `\uXXXX` s’ils sont ambigus. Utilisez `+` ou les litéraux de gabarit comme vous voulez.  
```js
console.log("Hello\u202f!");
let e = 1;
console.log(`e = ${e}`);
console.log("e = " + e); // identique, prenez celui que vous préférez
```

Pour créer un objet vide, utiliser `new` si possible.  
```js
let my_array = new Array; // yes
let my_array = []; // no thanks
let my_string = new String; // techniquement différent de la ligne suivante
let my_string = ""; // mais je préfère new String pour rester cohérent avec Array
let my_object = new Object; // en théorie on a jamais besoin de faire ça
```
