# school-labels-generator

> Chaque année, on passe (trop) de temps à récréer les étiquettes prénoms, à remplacer chaque nom, s'assurer que la première lettre est colorée et les imprimer simplement.
> Ce n'est que du remplacement de chaine, rien d'impossible à scripter.

J'ai commencé par utiliser l'extension Inkscape `NextGenerator`, vraiment géniale.
Seulement j'avais une dernière étape pour laquelle j'ai dû créer un script: colorer un rouge la première lettre de chaque nom composant les prénoms, et assembler le tout dans un seul fichier HTML, pour l'imprimer facilement sans étape supplémentaire.

## Comment ça marche

1. Prépare ton template, il doit-être au format SVG (avec Inkscape ou d'autres outils en ligne gratuits):
  - les textes à remplacer doivent avoir la forme `%VAR_nomdevariable%`
  - assures-toi que tu la variable n'est pas séparée dans plusieurs balises `tspan` (pas de couleur ou style différent pour certains caractères différents par exemple)
  - assures-toi que les dimensions finales de ton image correspond à ce que tu souhaites, en millimètres
  - le script ne s'assures pas que le texte rentre dans l'espace prévu et ne fait pas de retour à la ligne automatiquement, c'est à prévoir dans le template
2. Prépare la liste des remplacements (le fichier CSV qui va accompagner):
  - les élements doivent être séparés par des virgules
  - la première ligne doit contenir les noms des variables de remplacement (`nomdevariable` pour reprendre l'example plus haut)
3. Execute le script : `node index.js -t template.svg -l list.csv -v`
  - `-t/--template <template>`: template SVG à utiliser
  - `-l/--list <list>`: liste CSV à utiliser
  - `-c/--color <hexa color>`: couleur hexadécimale de la première lettre, par défaut `#FF0000` (rouge)
  - `-n/--no-colorize`: Ne colore pas la première lettre des prénoms
  - `-v/--verbose`: affiche plus de détails
  - `-h/--help`: affiche l'aide
4. Ouvrir le fichier résultat dans votre navigateur, l'imprimer depuis le navigateur

PS : les exemples fournis utilisent la police `Belle Allure`, dispo sur le [site de son créateur](https://www.jeanboyault.fr/belle-allure/).

## La suite

Une version dans un navigateur est prévue, il n'y a rien de magique dans le script, tout peut-être fait dans le navigateur.