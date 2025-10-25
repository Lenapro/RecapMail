# Rapport Exercice - Développement Web & Automatisation avec n8n 🚀

L'objectif de cet exercice est de conevoir un agent intelligent capable d'analyser automatiquement des e-mails à l'aide d'un flux d'automatisation créé dans n8n et de produire un résumé de tous ces e-mails.

L'approche choisie combine deux outils:
- **n8n**: Pour orchestrer le workflow et automatiser la récupération, le traitement et la génération du résumé;
- **Angular**: Pour afficher dynamiquement le rapport de synthèse dans l'interface web.

## ✨ Etapes d’installation

### Installation de Angular CLI

L'installation de **Angular CLI** requiert au préalable d'avoir nodejs installé(version>=18).

```javascript
npm install -g @angular/cli
```
### Création d'un nouveau projet
Après que l'installation soit bien passée, on navigue dans le dossier où l'on souhaite créer le projet et on exécute: 

```javascript
ng new nom-du-projet  // recapMail dans notre cas
```
Angular posera ensuite quelques questions:
```javascript
- Which stylesheet format would you like to use ? (CSS, Sass (SCSS), Sass (Indented), Less) 
// CSS dans notre cas
- Do you Want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)? (y/N)
// y dans notre cas
- Do you want to create a 'zoneless' application without zone.js? (y/N)
// N dans notre cas
```
la création du projet se lance ensuite. Et cela génère une structure complète du projet.

### Lancement du serveur de développement
```javascript
cd nom-du-projet
ng serve  // pour démarrer le serveur en local
```
###### Ensuite on ouvre le navigateur sur : http://localhost:4200 
---

### Installation de n8n en local
n8n peut être installé globalement avec ``` npm ``` : ``` npm install n8n -g ```

Après l'installation, n8n est lancé avec la commande : 
```
n8n
# or
n8n start

```
Le terminal indique d'appuyer sur la lettre "o" pour ouvrir n8n sur le navigateur.

---

## ✨ Architecture choisie
### Architecture du workflow dans n8n
Le worflow final comporte les noeuds suivants: 

- **Email Trigger (IMAP)**: il récupère automatique les e-mails récents non lus, chaque e-mail est renvoyé sous forme d'objet JSON brut contenant les métadonnées et le contenu;
- **Code in Javascript**: C'est une fonction utilisée principalement pour récupérer de l'objet JSON du trigger l'expéditeur, l'objet et la date et l'heure de réception de l'e-mail. La particularité de cette foncton est qu'elle regroupe tous les items dans un seul objet JSON;
- **Agent IA qui va utiliser Groq Chat Model** comme model: le but de ce noeud est d'envoyer les instructions au model, dans notre cas on lui indique simplement ce qu'il doit faire avec le JSON du **Code Javascript**, c'est à dire le résumé global de tous les e-mails reçus pendant la journée;
-   **Code in Javascript1** : Ce code nettoie la réponse du modèle et extrait la partie JSON propre du texte. Il renvoie un JSON qui ne contient que le résumé attendu;

- **Edit Fields**: ce noeud assemble des deux résultats c'est-à-dire le tableau des e-mails du **Code in Javascript** et le résumé du **Code in Javascript1**, pour donner au final un seul JSON;
- **Convert to File**: ce noeud va convertir en un fichier Json sous forme binaire le résultat du noeud **Edit Fields**;
- **Read/Write Files from Disk**: ce noeud va sauvegarder sous forme d'un fichier JSON, le fichier du noeud précédent, accessible dans le dossier ```public/ ``` du frontend.

### Intégration dans Angular
L'application Angular lit le fichier JSON produit par n8n et va l'utiliser pour afficher les e-mails et le résumé.

Nous avons mis en place 4 components, un model et un service.

- **Le model email.ts**: mis en place pour décrire la forme globale des données attendues pour nos emails;
- **Le service email-list.service.ts** : se charge de lier le fichier généré par n8n, ```mails-today.json``` dans notre cas Il va récupérér le fichier json, et l'utiliser pour extraire les e-mails et le résumé;
- le filtrage des emails selon l'expéditeur ou les mots clés, la liste de chaque e-mail contenant l'expéditeur, l'objet et la date et l'heure de réception, sont gérés par le fichier **email-list.ts** et l'affichage dans le fichier **email-list.html**;
- **email-summary.ts** : fait appel au service pour obtenir le résumé des e-mails;
- **Header** : un composant pour gérer l'ent-tête de l'application;
- **La main-page**: assemble les différents composants et donne le rendu final.

---

## ✨ Les difficultés rencontrés

- La compréhension global du fonctionnement de n8n pour le besoin a pris un peu de temps;

- Le trigger **Email Trigger (IMAP)** ne se déclenche que lorsqu'il y a reception d'un nouveau e-mail. Il ne récupère que les nouveaux messages entrants, et s'ils ont déjà été lu, il ne les récupère pas. Il a donc fallu ajouter une autre options pour lui indiquer qu'il devrait considérer les mails de la journée, cela s'est fait en ajoutant ceci:
```
[ "UNSEEN",  ["SINCE", "{{ new Date( new Date().setHours(0, 0, 0, 0)) }}"]]
```
   Plusieurs essais ont été fait afin d'aboutir au résultats souhaités;

-  Le modèle Groq ne pouvait pas traiter plusieurs entrées à la fois, il a fallu donc regrouper tous les e-mails récupérés en un seul item pour les envoyer au modèle;

-  Il a été difficile de déterminer si l’instruction devait être transmise à l’agent IA afin d’obtenir un résumé clair et précis. Une lecture plus approfondie de la documentation a été nécessaire, car il avait d’abord été supposé que l’instruction devait être adressée directement au modèle;

- La sauvegarde du fichier JSON localement:  le noeud en effet attendait un binaire, mais il recevait  directement le résultat de la fonction, ce qui renvoyait une erreur. il a fallu donc le convertir d'abord en un fichier json avant de  pouvoir le sauvegarder;

- Le projet étant fait sur la dernière version de angular, il y a eu quelques problèmes de compatibilité avec certains dépendances, notemment ngModel.  

## ✨ Les résultats obtenus

Finalement, après avoir surmonté toutes ces difficultés, les résultats ont été concrets:

- Le workflow s'exécute normalement quand on le lance et récupère bien tous les e-mails de la journée, tout dépend de l'heure à laquelle il est lancé;
- Le modèle Groq respecte bien l'instruction et produit un résumé cohérents et contextualisé;
- Dès que le worflow est lancé, le fichier stocké est bien à l'emplacement dans le projet et remplace directement l'ancien fichier et on n'a plus qu'à lancer le frontend pour visualiser;
- le filtre des données fonctionne normalement;
- Il n'y a aucun bug pour le moment et les objetifs sont atteints.

---
