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
http://localhost:4000
```

---

## API – Endpoints disponibles

### Vue d'ensemble

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/cantine/inscription` | Créer une nouvelle inscription |
| `GET` | `/api/cantine` | Récupérer toutes les inscriptions |
| `GET` | `/api/cantine/:id` | Récupérer une inscription par ID |
| `PUT` | `/api/cantine/:id` | Modifier une inscription |
| `DELETE` | `/api/cantine/:id` | Supprimer une inscription |

---

### 1. Créer une inscription

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

**Réponse (succès - 201)**

```json
{
  "message": "Inscription à la cantine enregistrée"
}
```

**Erreur (champs manquants - 400)**

```json
{
  "message": "Tous les champs sont obligatoires"
}
```

---

### 2. Récupérer toutes les inscriptions

**URL**

```
GET /api/cantine
```

**Réponse (succès - 200)**

```json
[
  {
    "id": 1,
    "nom": "Durand",
    "prenom": "Léo",
    "classe": "CE1",
    "email_parent": "parent.durand@mail.fr",
    "regime_alimentaire": "sans porc",
    "created_at": "2024-01-15 10:30:00"
  },
  {
    "id": 2,
    "nom": "Martin",
    "prenom": "Sophie",
    "classe": "CE2",
    "email_parent": "parent.martin@mail.fr",
    "regime_alimentaire": "végétarien",
    "created_at": "2024-01-16 14:20:00"
  }
]
```

**Réponse (vide - 200)**

```json
[]
```

---

### 3. Récupérer une inscription par ID

**URL**

```
GET /api/cantine/:id
```

**Exemple**

```
GET /api/cantine/1
```

**Réponse (succès - 200)**

```json
{
  "id": 1,
  "nom": "Durand",
  "prenom": "Léo",
  "classe": "CE1",
  "email_parent": "parent.durand@mail.fr",
  "regime_alimentaire": "sans porc",
  "created_at": "2024-01-15 10:30:00"
}
```

**Erreur (non trouvé - 404)**

```json
{
  "message": "Inscription non trouvée"
}
```

---

### 4. Modifier une inscription

**URL**

```
PUT /api/cantine/:id
```

**Exemple**

```
PUT /api/cantine/1
```

**Body (JSON)**

```json
{
  "nom": "Durand",
  "prenom": "Léo",
  "classe": "CE2",
  "email_parent": "parent.durand@mail.fr",
  "regime_alimentaire": "sans porc"
}
```

**Réponse (succès - 200)**

```json
{
  "message": "Inscription modifiée avec succès"
}
```

**Erreur (champs manquants - 400)**

```json
{
  "message": "Tous les champs sont obligatoires"
}
```

**Erreur (non trouvé - 404)**

```json
{
  "message": "Inscription non trouvée"
}
```

---

### 5. Supprimer une inscription

**URL**

```
DELETE /api/cantine/:id
```

**Exemple**

```
DELETE /api/cantine/1
```

**Réponse (succès - 200)**

```json
{
  "message": "Inscription supprimée avec succès"
}
```

**Erreur (500)**

```json
{
  "message": "Erreur lors de la suppression de l'inscription"
}
```

---

## Structure de la table

La table `cantine_inscriptions` contient les champs suivants :

| Champ | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Identifiant unique (auto-incrémenté) |
| `nom` | TEXT | Nom de l'enfant (obligatoire) |
| `prenom` | TEXT | Prénom de l'enfant (obligatoire) |
| `classe` | TEXT | Classe de l'enfant (obligatoire) |
| `email_parent` | TEXT | Email du parent (obligatoire) |
| `regime_alimentaire` | TEXT | Régime alimentaire (obligatoire) |
| `created_at` | DATETIME | Date de création (automatique) |

---

## Base de données

* Type : SQLite
* Fichier : `backend/db/cantine.db`
* Table : `cantine_inscriptions`

Les fichiers `.db` sont ignorés par Git (`.gitignore`).

---

## Tests

Un script de test est fourni pour :

* envoyer une inscription à l'API
* afficher le contenu complet de la base de données

### Lancer le test

1. Lancer le serveur dans un terminal :

```bash
npm run dev
```

2. Dans un autre terminal :

```bash
node test/test-cantine-inscription.js
```

### Résultat attendu

* statut HTTP
* message de succès ou d'erreur
* affichage complet des inscriptions avec `console.table`

---

## Exemples d'utilisation avec cURL

### Créer une inscription

```bash
curl -X POST http://localhost:4000/api/cantine/inscription \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Durand",
    "prenom": "Léo",
    "classe": "CE1",
    "email_parent": "parent.durand@mail.fr",
    "regime_alimentaire": "sans porc"
  }'
```

### Récupérer toutes les inscriptions

```bash
curl http://localhost:4000/api/cantine
```

### Récupérer une inscription par ID

```bash
curl http://localhost:4000/api/cantine/1
```

### Modifier une inscription

```bash
curl -X PUT http://localhost:4000/api/cantine/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Durand",
    "prenom": "Léo",
    "classe": "CE2",
    "email_parent": "parent.durand@mail.fr",
    "regime_alimentaire": "sans porc"
  }'
```

### Supprimer une inscription

```bash
curl -X DELETE http://localhost:4000/api/cantine/1
```

---

## Intégration avec le Frontend

Ce backend est conçu pour fonctionner avec le frontend Next.js disponible dans le dossier `../frontend`.

Le frontend utilise ces endpoints pour :
* Afficher toutes les inscriptions dans un tableau d'administration
* Modifier les inscriptions via un formulaire
* Supprimer les inscriptions avec confirmation

Pour accéder au panel d'administration :
1. Démarrer le backend : `npm run dev` (port 4000)
2. Démarrer le frontend : `cd ../frontend && npm run dev` (port 3000)
3. Ouvrir : `http://localhost:3000/admin`

---
