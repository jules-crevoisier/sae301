# 📖 Guide d'Utilisation - Panel d'Administration Cantine

## 🎯 Vue d'ensemble

Ce projet est composé de **deux parties** :
1. **Backend** : API REST qui gère la base de données SQLite
2. **Frontend** : Interface web Next.js pour visualiser et modifier les données

---

## 🚀 Démarrage Rapide

### Étape 1 : Démarrer le Backend (API)

Ouvrez un **premier terminal** et exécutez :

```bash
cd backend
npm install  # (si pas encore fait)
npm run dev
```

✅ **Résultat attendu** : 
```
Serveur API démarré sur http://localhost:4000
SQLite connecté : cantine.db
```

Le backend est maintenant actif et écoute sur le port **4000**.

---

### Étape 2 : Démarrer le Frontend (Interface Web)

Ouvrez un **deuxième terminal** et exécutez :

```bash
cd frontend
npm install  # (si pas encore fait)
npm run dev
```

✅ **Résultat attendu** :
```
- ready started server on 0.0.0.0:3000
- Local: http://localhost:3000
```

Le frontend est maintenant actif sur le port **3000**.

---

### Étape 3 : Accéder au Panel Admin

1. Ouvrez votre navigateur
2. Allez sur : **http://localhost:3000**
3. Cliquez sur le bouton **"Panel Admin"**
4. Ou accédez directement à : **http://localhost:3000/admin**

---

## 📊 Comment Utiliser le Panel Admin

### Visualiser les Inscriptions

Quand vous ouvrez `/admin`, le tableau affiche automatiquement **toutes les inscriptions** de la base de données :

| Colonnes affichées |
|-------------------|
| ID |
| Nom |
| Prénom |
| Classe |
| Email Parent |
| Régime Alimentaire |
| Date de création |
| Actions (Modifier / Supprimer) |

---

### Modifier une Inscription

1. **Cliquez sur "Modifier"** dans la ligne de l'inscription que vous voulez modifier
2. Un **formulaire apparaît directement dans le tableau** avec les champs pré-remplis
3. **Modifiez les valeurs** que vous souhaitez changer
4. **Cliquez sur "Enregistrer"** pour sauvegarder
   - ✅ Un message vert confirme la modification
   - Le tableau se met à jour automatiquement
5. **Ou cliquez sur "Annuler"** pour abandonner les modifications

**Exemple** :
- Vous cliquez sur "Modifier" pour l'inscription ID 5
- Le formulaire s'affiche avec les données actuelles
- Vous changez "CE1" en "CE2" dans le champ Classe
- Vous cliquez "Enregistrer"
- ✅ Message : "Inscription modifiée avec succès"

---

### Supprimer une Inscription

1. **Cliquez sur "Supprimer"** dans la ligne de l'inscription
2. Une **boîte de confirmation** apparaît : "Êtes-vous sûr de vouloir supprimer cette inscription ?"
3. **Cliquez sur "OK"** pour confirmer la suppression
   - ✅ Un message vert confirme la suppression
   - L'inscription disparaît du tableau
4. **Ou cliquez sur "Annuler"** pour ne pas supprimer

**Exemple** :
- Vous cliquez sur "Supprimer" pour l'inscription ID 3
- Confirmation : "Êtes-vous sûr de vouloir supprimer cette inscription ?"
- Vous cliquez "OK"
- ✅ Message : "Inscription supprimée avec succès"
- L'inscription ID 3 n'apparaît plus dans le tableau

---

### Actualiser la Liste

Si vous avez ajouté des inscriptions via l'API (ou un autre moyen), cliquez sur le bouton **"Actualiser"** en haut à droite pour recharger la liste.

---

## 🔧 Comment Ça Fonctionne Techniquement

### Architecture

```
┌─────────────────┐         HTTP Requests         ┌─────────────────┐
│                 │  ───────────────────────────> │                 │
│   Frontend      │                                │    Backend      │
│   (Next.js)     │  <─────────────────────────── │    (Express)    │
│   Port 3000     │         JSON Responses         │    Port 4000    │
│                 │                                │                 │
└─────────────────┘                                └─────────────────┘
                                                           │
                                                           │ SQL Queries
                                                           ▼
                                                   ┌─────────────────┐
                                                   │   SQLite DB     │
                                                   │  cantine.db     │
                                                   └─────────────────┘
```

---

### Flux de Données

#### 1. **Chargement Initial** (Quand vous ouvrez `/admin`)

```javascript
// Le composant React s'exécute
useEffect(() => {
  fetchInscriptions();  // Appel automatique au chargement
}, []);

// Fonction qui fait une requête HTTP
const fetchInscriptions = async () => {
  const response = await fetch("http://localhost:4000/api/cantine");
  const data = await response.json();  // Reçoit toutes les inscriptions
  setInscriptions(data);  // Met à jour l'état React
};
```

**Ce qui se passe** :
- Frontend → `GET http://localhost:4000/api/cantine`
- Backend → Exécute `SELECT * FROM cantine_inscriptions`
- Backend → Retourne le JSON avec toutes les inscriptions
- Frontend → Affiche les données dans le tableau

---

#### 2. **Modification d'une Inscription**

```javascript
// Quand vous cliquez "Enregistrer"
const handleUpdate = async (e) => {
  const response = await fetch(`http://localhost:4000/api/cantine/${editingId}`, {
    method: "PUT",  // Méthode HTTP pour modifier
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)  // Les nouvelles données
  });
  fetchInscriptions();  // Recharge la liste
};
```

**Ce qui se passe** :
- Frontend → `PUT http://localhost:4000/api/cantine/5` avec les nouvelles données
- Backend → Exécute `UPDATE cantine_inscriptions SET ... WHERE id = 5`
- Backend → Retourne un message de succès
- Frontend → Recharge la liste pour afficher les modifications

---

#### 3. **Suppression d'une Inscription**

```javascript
// Quand vous cliquez "Supprimer" et confirmez
const handleDelete = async (id) => {
  const response = await fetch(`http://localhost:4000/api/cantine/${id}`, {
    method: "DELETE"  // Méthode HTTP pour supprimer
  });
  fetchInscriptions();  // Recharge la liste
};
```

**Ce qui se passe** :
- Frontend → `DELETE http://localhost:4000/api/cantine/3`
- Backend → Exécute `DELETE FROM cantine_inscriptions WHERE id = 3`
- Backend → Retourne un message de succès
- Frontend → Recharge la liste (l'inscription a disparu)

---

## 📡 Les Endpoints API Disponibles

Le backend expose ces routes :

| Méthode | URL | Description |
|---------|-----|-------------|
| `GET` | `/api/cantine` | Récupère toutes les inscriptions |
| `GET` | `/api/cantine/:id` | Récupère une inscription par ID |
| `POST` | `/api/cantine/inscription` | Crée une nouvelle inscription |
| `PUT` | `/api/cantine/:id` | Modifie une inscription |
| `DELETE` | `/api/cantine/:id` | Supprime une inscription |

---

## 🎨 Fonctionnalités de l'Interface

### États Visuels

- **Chargement** : Affiche "Chargement..." pendant la récupération des données
- **Vide** : Affiche "Aucune inscription trouvée" si la base est vide
- **Succès** : Message vert en haut de page après modification/suppression
- **Erreur** : Message rouge en haut de page en cas d'erreur

### Mode Édition

Quand vous cliquez sur "Modifier" :
- La ligne du tableau se transforme en formulaire
- Les champs sont pré-remplis avec les valeurs actuelles
- Vous pouvez modifier n'importe quel champ
- Boutons "Enregistrer" (vert) et "Annuler" (gris)

### Responsive Design

- Le tableau s'adapte aux petits écrans (scroll horizontal)
- Les formulaires s'empilent sur mobile
- Support du mode sombre (dark mode)

---

## ⚠️ Problèmes Courants

### Erreur : "Erreur lors du chargement des données"

**Cause** : Le backend n'est pas démarré ou n'est pas accessible

**Solution** :
1. Vérifiez que le backend tourne sur le port 4000
2. Vérifiez dans la console du navigateur (F12) l'erreur exacte
3. Assurez-vous que l'URL dans `admin/page.js` est correcte : `http://localhost:4000/api/cantine`

---

### Le tableau est vide

**Causes possibles** :
1. La base de données est vraiment vide
2. Le backend ne peut pas lire la base de données

**Solution** :
1. Vérifiez que le fichier `backend/db/cantine.db` existe
2. Testez l'API directement : `http://localhost:4000/api/cantine` dans votre navigateur
3. Vous devriez voir un tableau JSON (même vide : `[]`)

---

### Les modifications ne s'enregistrent pas

**Cause** : Erreur de validation ou problème de connexion

**Solution** :
1. Ouvrez la console du navigateur (F12)
2. Regardez les erreurs dans l'onglet "Console" ou "Network"
3. Vérifiez que tous les champs sont remplis (ils sont obligatoires)
4. Vérifiez que le backend répond bien (testez avec Postman ou curl)

---

## 🧪 Tester l'API Directement

Vous pouvez tester l'API sans passer par le frontend :

### Avec votre navigateur :
```
http://localhost:4000/api/cantine
```
Vous verrez toutes les inscriptions en JSON.

### Avec curl (terminal) :
```bash
# Récupérer toutes les inscriptions
curl http://localhost:4000/api/cantine

# Récupérer une inscription par ID
curl http://localhost:4000/api/cantine/1

# Modifier une inscription
curl -X PUT http://localhost:4000/api/cantine/1 \
  -H "Content-Type: application/json" \
  -d '{"nom":"Dupont","prenom":"Jean","classe":"CE1","email_parent":"jean@mail.fr","regime_alimentaire":"sans porc"}'

# Supprimer une inscription
curl -X DELETE http://localhost:4000/api/cantine/1
```

---

## 📝 Structure des Données

Chaque inscription contient :

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

---

## 🎓 Concepts React Utilisés

### `useState` - Gestion de l'état
```javascript
const [inscriptions, setInscriptions] = useState([]);
```
Stocke la liste des inscriptions et permet de la mettre à jour.

### `useEffect` - Effets de bord
```javascript
useEffect(() => {
  fetchInscriptions();
}, []);
```
Exécute `fetchInscriptions()` une seule fois au chargement du composant.

### `async/await` - Requêtes asynchrones
```javascript
const response = await fetch(API_URL);
const data = await response.json();
```
Permet d'attendre la réponse de l'API avant de continuer.

---

## ✅ Checklist de Vérification

Avant d'utiliser le panel, vérifiez :

- [ ] Le backend est démarré (`npm run dev` dans `backend/`)
- [ ] Le frontend est démarré (`npm run dev` dans `frontend/`)
- [ ] Le backend écoute sur le port 4000
- [ ] Le frontend écoute sur le port 3000
- [ ] Vous pouvez accéder à `http://localhost:3000/admin`
- [ ] Le tableau se charge (ou affiche "Aucune inscription trouvée")

---

## 🆘 Besoin d'Aide ?

Si quelque chose ne fonctionne pas :

1. **Vérifiez les deux terminaux** (backend et frontend doivent tourner)
2. **Ouvrez la console du navigateur** (F12) pour voir les erreurs
3. **Testez l'API directement** dans votre navigateur : `http://localhost:4000/api/cantine`
4. **Vérifiez les logs** dans les terminaux pour voir les erreurs serveur

---

**Bon courage ! 🚀**

