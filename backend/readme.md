# API Cantine Scolaire v2.0

API REST complète pour la gestion des inscriptions à la cantine scolaire.

## 🚀 Démarrage rapide

```bash
# Installation des dépendances
npm install

# Démarrage en développement (avec hot-reload)
npm run dev

# Démarrage en production
npm start

# Tests
npm test
```

Le serveur démarre par défaut sur `http://localhost:4000`

## 📊 Architecture de données

### Schéma des entités

```
┌─────────────────┐
│     FAMILY      │
│  (Dossier)      │
├─────────────────┤
│ id (UUID)       │
│ reference_number│
│ address_line1   │
│ address_line2   │
│ postal_code     │
│ city            │
│ phone_primary   │
│ phone_secondary │
│ email           │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌─────────┐
│ PARENTS │ │ CHILDREN│
├─────────┤ ├─────────┤
│ id      │ │ id      │
│ family_id│ │ family_id│
│ first_name│ │ first_name│
│ last_name│ │ last_name │
│ email   │ │ birth_date│
│ phone   │ │ school_name│
│ role    │ │ class_level│
│ salary  │ └────┬────┘
│ coefficient│     │
└─────────┘  ┌────┴────┐
             │         │
             ▼         ▼
    ┌─────────────┐ ┌─────────────┐
    │CHILD_ALLERGIES│ │CANTEEN_SCHEDULE│
    ├─────────────┤ ├─────────────┤
    │ allergy_id  │ │ day_of_week │
    │ severity    │ │ is_present  │
    │ comment     │ └─────────────┘
    └─────────────┘
```

## 📋 Endpoints API

### Health Check

```http
GET /api/health
```

### 🏠 Familles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/families` | Liste toutes les familles |
| `GET` | `/api/families/:id` | Récupère une famille par ID |
| `GET` | `/api/families/:id/full` | Récupère une famille complète (avec parents, enfants, allergies, planning) |
| `GET` | `/api/families/reference/:ref` | Récupère par numéro de référence |
| `POST` | `/api/families` | Crée une nouvelle famille |
| `PUT` | `/api/families/:id` | Met à jour une famille |
| `DELETE` | `/api/families/:id` | Supprime une famille (et toutes les données associées) |

### 📝 Inscriptions

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/inscription` | **Inscription complète** (famille + parents + enfants + allergies + planning) |
| `GET` | `/api/inscriptions` | Liste toutes les inscriptions |
| `GET` | `/api/inscriptions/:id` | Récupère une inscription par ID |
| `GET` | `/api/inscriptions/family/:familyId` | Récupère l'inscription d'une famille |
| `PUT` | `/api/inscriptions/:id/status` | Met à jour le statut (PENDING, CONFIRMED, CANCELLED) |
| `DELETE` | `/api/inscriptions/:id` | Supprime une inscription |

### 👶 Enfants

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/children/:id` | Récupère un enfant avec ses allergies et planning |
| `GET` | `/api/children/:id/allergies` | Liste les allergies d'un enfant |
| `POST` | `/api/children/:id/allergies` | Ajoute une allergie à un enfant |
| `PUT` | `/api/children/:id/allergies/:allergyId` | Met à jour une allergie |
| `DELETE` | `/api/children/:id/allergies/:allergyId` | Supprime une allergie |
| `GET` | `/api/children/:id/schedule` | Récupère le planning cantine |
| `PUT` | `/api/children/:id/schedule` | Met à jour le planning cantine |

### 🍽️ Allergies (Référentiel)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/allergies` | Liste toutes les allergies disponibles |
| `POST` | `/api/allergies` | Crée une nouvelle allergie |

### 💰 Tarification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/pricing/tiers` | Récupère les tranches tarifaires |
| `POST` | `/api/pricing/calculate` | Calcule la tarification (simulation) |
| `GET` | `/api/pricing/family/:familyId` | Récupère la tarification d'une famille |
| `POST` | `/api/pricing/family/:familyId/recalculate` | Recalcule et enregistre la tarification |
| `GET` | `/api/pricing/family/:familyId/history` | Historique des tarifications |

## 📮 Exemple d'inscription complète

### Request

```http
POST /api/inscription
Content-Type: application/json
```

```json
{
  "family": {
    "address_line1": "123 Rue de la Paix",
    "address_line2": "Bâtiment A",
    "postal_code": "75001",
    "city": "Paris",
    "phone_primary": "0612345678",
    "phone_secondary": "0687654321",
    "email": "famille.dupont@example.fr"
  },
  "parents": [
    {
      "first_name": "Jean",
      "last_name": "Dupont",
      "email": "jean.dupont@example.fr",
      "phone": "0612345678",
      "role": "PERE",
      "salary_monthly": 2500
    },
    {
      "first_name": "Marie",
      "last_name": "Dupont",
      "email": "marie.dupont@example.fr",
      "phone": "0687654321",
      "role": "MERE",
      "social_coefficient": 1.8
    }
  ],
  "children": [
    {
      "info": {
        "first_name": "Lucas",
        "last_name": "Dupont",
        "birth_date": "2016-05-15",
        "school_name": "École Primaire Victor Hugo",
        "class_level": "CE2"
      },
      "allergies": [
        {
          "allergy_id": "allergy_1",
          "severity": "SEVERE",
          "comment": "Réaction anaphylactique possible"
        },
        {
          "allergy_id": "allergy_2",
          "severity": "LEGERE"
        }
      ],
      "canteen_days": ["LUNDI", "MARDI", "JEUDI", "VENDREDI"]
    },
    {
      "info": {
        "first_name": "Emma",
        "last_name": "Dupont",
        "birth_date": "2018-09-22",
        "school_name": "École Maternelle Les Petits Princes",
        "class_level": "Grande Section"
      },
      "allergies": [],
      "canteen_days": ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI"]
    }
  ]
}
```

### Response

```json
{
  "success": true,
  "message": "Inscription enregistrée avec succès",
  "data": {
    "family_id": "uuid-xxx",
    "reference_number": "FAM-20260109-ABCD",
    "confirmation_id": "uuid-yyy",
    "pricing": {
      "social_coefficient": 1.8,
      "price_per_meal": 3.50,
      "estimated_monthly_price": 126.00,
      "children_pricing": [
        {
          "child_id": "uuid-child1",
          "first_name": "Lucas",
          "canteen_days": ["LUNDI", "MARDI", "JEUDI", "VENDREDI"],
          "meals_per_month": 16,
          "monthly_price": 56.00
        },
        {
          "child_id": "uuid-child2",
          "first_name": "Emma",
          "canteen_days": ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI"],
          "meals_per_month": 20,
          "monthly_price": 70.00
        }
      ]
    }
  }
}
```

## 📊 Valeurs acceptées

### Rôles parentaux
- `PERE`
- `MERE`
- `TUTEUR`

### Jours de la semaine
- `LUNDI`
- `MARDI`
- `MERCREDI`
- `JEUDI`
- `VENDREDI`

### Sévérité des allergies
- `LEGERE`
- `MOYENNE`
- `SEVERE`

### Statuts d'inscription
- `PENDING`
- `CONFIRMED`
- `CANCELLED`

### Allergies pré-enregistrées
| ID | Label |
|----|-------|
| allergy_1 | Arachides |
| allergy_2 | Gluten |
| allergy_3 | Lactose |
| allergy_4 | Oeufs |
| allergy_5 | Fruits à coque |
| allergy_6 | Soja |
| allergy_7 | Poisson |
| allergy_8 | Crustacés |
| allergy_9 | Céleri |
| allergy_10 | Moutarde |
| allergy_11 | Sésame |
| allergy_12 | Sulfites |
| allergy_13 | Lupin |
| allergy_14 | Mollusques |

## 💰 Grille tarifaire

| Coefficient social | Prix par repas |
|-------------------|----------------|
| 0 - 0.5 | 0.50€ |
| 0.5 - 1.0 | 1.50€ |
| 1.0 - 1.5 | 2.50€ |
| 1.5 - 2.0 | 3.50€ |
| 2.0 - 2.5 | 4.50€ |
| > 2.5 | 5.50€ |

Le coefficient social est calculé automatiquement :
- Si `social_coefficient` est fourni directement → utilisé tel quel
- Sinon, calculé depuis `salary_monthly` : `coefficient = salaire / 1500`

## 🔒 Validation des données

L'API effectue une validation stricte :

- **Email** : Format valide requis
- **Téléphone** : Format français (0612345678, +33612345678)
- **Code postal** : 5 chiffres
- **Date de naissance** : Format YYYY-MM-DD, enfant < 25 ans
- **Jours** : Uniquement LUNDI à VENDREDI
- **Sévérité** : LEGERE, MOYENNE ou SEVERE

## 📁 Structure du projet

```
backend/
├── db/
│   ├── database.js          # Connexion SQLite
│   └── init.js              # Initialisation des tables
├── src/
│   ├── app.js               # Configuration Express
│   ├── server.js            # Point d'entrée
│   ├── controllers/
│   │   ├── allergy.controller.js
│   │   ├── family.controller.js
│   │   ├── pricing.controller.js
│   │   └── registration.controller.js
│   ├── models/
│   │   ├── allergy.model.js
│   │   ├── canteen-schedule.model.js
│   │   ├── child.model.js
│   │   ├── family.model.js
│   │   ├── parent.model.js
│   │   ├── pricing.model.js
│   │   └── registration.model.js
│   ├── routes/
│   │   ├── allergy.routes.js
│   │   ├── child.routes.js
│   │   ├── family.routes.js
│   │   ├── pricing.routes.js
│   │   └── registration.routes.js
│   └── utils/
│       ├── pricing.js       # Calcul tarification
│       ├── uuid.js          # Génération UUID
│       └── validators.js    # Validation données
└── test/
    └── test-inscription-complete.js
```

## 🧪 Tests

Lancez les tests avec le serveur démarré :

```bash
# Terminal 1 - Démarrer le serveur
npm run dev

# Terminal 2 - Lancer les tests
npm test
```

## 📝 Variables d'environnement

Créez un fichier `.env` à la racine :

```env
PORT=4000
DB_NAME=cantine.db
NODE_ENV=development
```

## 🔧 Technologies

- **Node.js** >= 18
- **Express** 4.x
- **SQLite3** (base de données)
- **CORS** (Cross-Origin Resource Sharing)

## 📜 Licence

MIT
