# Backend – API Cantine (Site de Mairie)

## Technologies utilisées

* Node.js (>= 18)
* Express
* SQLite
* Cors
* Dotenv
* Nodemon (développement)

---

## Arborescence du projet

```
backend/
├── db/
│   ├── cantine.db          # Base de données SQLite (locale)
│   └── database.js         # Connexion SQLite
├── src/
│   ├── app.js              # Configuration Express
│   ├── server.js           # Lancement du serveur
│   ├── routes/
│   │   └── cantine.routes.js
│   ├── controllers/
│   │   └── cantine.controller.js
│   └── models/
│       └── cantine.model.js
├── test/
│   └── test-cantine-inscription.js
├── package.json
├── package-lock.json
├── .gitignore
└── readme.md
```

---

## Installation

### 1. Prérequis

* Node.js installé (version 18 ou supérieure)
* NPM installé

Vérification :

```bash
node -v
npm -v
```

---

### 2. Installation des dépendances

Depuis le dossier `backend` :

```bash
npm install
```

---

## Lancer le serveur

### Mode développement (recommandé)

```bash
npm run dev
```

Le serveur démarre sur :

```
http://localhost:3000
```

---

## API – Endpoints disponibles

### Inscription à la cantine

**URL**

```
POST /api/cantine/inscription
```

**Body (JSON)**

```json
{
  "nom": "Durand",
  "prenom": "Léo",
  "classe": "CE1",
  "email_parent": "parent.durand@mail.fr",
  "regime_alimentaire": "sans porc"
}
```

**Réponse (succès)**

```json
{
  "message": "Inscription à la cantine enregistrée"
}
```

**Erreur (champs manquants)**

```json
{
  "message": "Tous les champs sont obligatoires"
}
```

---

## Base de données

* Type : SQLite
* Fichier : `backend/db/cantine.db`
* Table : `cantine_inscriptions`

Les fichiers `.db` sont ignorés par Git (`.gitignore`).

---

## Tests

Un script de test est fourni pour :

* envoyer une inscription à l’API
* afficher le contenu complet de la base de données

### Lancer le test

1. Lancer le serveur dans un terminal :

```bash
npm run test
```

2. Dans un autre terminal :

```bash
node test/test-cantine-inscription.js
```

### Résultat attendu

* statut HTTP
* message de succès ou d’erreur
* affichage complet des inscriptions avec `console.table`

---
