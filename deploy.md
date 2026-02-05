# Déploiement sur VPS

Guide pour déployer le projet **sae301** (frontend Next.js + backend Express/SQLite) sur un VPS Linux.

---

## 1. Prérequis sur le VPS

- **OS** : Ubuntu 22.04 LTS (ou Debian 12)
- **Node.js** : v18 ou supérieur
- Accès SSH et droits sudo

### Installation de Node.js (si besoin)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v   # doit afficher v18+
```

### Optionnel : Nginx (reverse proxy) et Certbot (SSL)

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

---

## 2. Structure sur le VPS

Créez un utilisateur dédié et un répertoire pour l’app (recommandé) :

```bash
sudo adduser appuser
sudo usermod -aG sudo appuser
sudo su - appuser
mkdir -p ~/sae301
cd ~/sae301
```

---

## 2.1 Ce qu’il faut copier sur le serveur

**Ne copiez pas** les dossiers `node_modules` (on les recrée sur le serveur avec `npm ci`).

### Backend — à copier

| À copier | Rôle |
|----------|------|
| `backend/package.json` | Dépendances |
| `backend/package-lock.json` | Versions figées |
| `backend/db/` | Scripts DB (database.js, init.js) |
| `backend/src/` | Code source de l’API |

Sur le serveur, créez à la main `backend/.env` (ne pas copier un fichier contenant des secrets depuis votre PC si ça pose souci).

### Frontend — à copier (build déjà fait)

Si vous avez déjà exécuté `npm run build` en local, copiez :

| À copier | Rôle |
|----------|------|
| `frontend/.next/` | **Build de production** (indispensable) |
| `frontend/public/` | Images et assets statiques |
| `frontend/package.json` | Dépendances |
| `frontend/package-lock.json` | Versions figées |
| `frontend/next.config.mjs` | Config Next.js |
| `frontend/postcss.config.mjs` | Config PostCSS |
| `frontend/jsconfig.json` | Config JS (optionnel) |

Sur le serveur, créez `frontend/.env.local` avec `NEXT_PUBLIC_API_URL` et `NEXT_PUBLIC_ADMIN_PASSWORD`.

**À ne pas copier** : `frontend/node_modules`, `frontend/src` (inutile pour `npm start` une fois `.next` présent).

### Exemple de commandes (depuis votre PC, PowerShell)

```powershell
# Remplacez VOTRE_IP et appuser par vos valeurs
$DEST = "appuser@VOTRE_IP:~/sae301"

# Backend (sans node_modules)
scp -r backend/package.json backend/package-lock.json backend/db backend/src $DEST/backend/

# Frontend avec le build
scp -r frontend/.next frontend/public frontend/package.json frontend/package-lock.json frontend/next.config.mjs frontend/postcss.config.mjs frontend/jsconfig.json $DEST/frontend/
```

Sous Windows, si `scp` ne gère pas plusieurs dossiers comme ci‑dessus, copiez dossier par dossier ou utilisez **WinSCP** / **FileZilla** en cochant les mêmes éléments.

### Alternative : tout copier (sans node_modules) et builder sur le serveur

Vous pouvez aussi copier tout le projet (y compris `frontend/src`) **sans** `node_modules` ni `.next`, puis sur le serveur :

```bash
cd ~/sae301/frontend && npm ci --omit=dev && npm run build
```

Dans ce cas, le dossier `.next` est créé sur le serveur ; pas besoin de copier un build depuis la machine locale.

---

## 3. Backend (API Express)

### 3.1 Dépendances et variables d’environnement

```bash
cd ~/sae301/backend
npm ci --omit=dev
```

Créez un fichier `.env` à la racine de `backend/` (ne pas commiter) :

```env
PORT=4000
DB_NAME=cantine.db
NODE_ENV=production
```

La base SQLite sera créée automatiquement au premier lancement dans `backend/db/cantine.db`.

### 3.2 Lancer avec PM2 (recommandé)

```bash
sudo npm install -g pm2
cd ~/sae301/backend
pm2 start src/server.js --name "sae301-api"
pm2 save
pm2 startup   # suit les instructions pour activer le démarrage au boot
```

Commandes utiles :

```bash
pm2 logs sae301-api
pm2 restart sae301-api
pm2 status
```

---

## 4. Frontend (Next.js)

### 4.1 Variables d’environnement

Créez un fichier `.env.local` dans `frontend/` :

```env
NEXT_PUBLIC_API_URL=https://api.votredomaine.com
NEXT_PUBLIC_ADMIN_PASSWORD=VotreMotDePasseAdminSecurise
```

En production, remplacez `https://api.votredomaine.com` par l’URL réelle de votre API (voir section Nginx).  
Si front et API sont sur le même domaine avec un reverse proxy, vous pouvez utiliser par exemple :  
`NEXT_PUBLIC_API_URL=https://votredomaine.com` (et faire proxyfer `/api` vers le backend).

### 4.2 Build et démarrage

```bash
cd ~/sae301/frontend
npm ci --omit=dev
npm run build
pm2 start npm --name "sae301-front" -- start
pm2 save
```

Le front tourne sur le port **3001** (configuré dans `package.json`).

---

## 5. Nginx (reverse proxy)

Nginx sert le site Next.js et redirige les appels API vers le backend.

### 5.1 Un seul domaine (site + API sur le même domaine)

Fichier de config (ex. `/etc/nginx/sites-available/sae301`) :

```nginx
server {
    listen 80;
    server_name votredomaine.com www.votredomaine.com;

    # Frontend Next.js
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API backend
    location /api {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Dans ce cas, côté frontend, utilisez :

```env
NEXT_PUBLIC_API_URL=https://votredomaine.com
```

Les requêtes iront vers `https://votredomaine.com/api/...`, Nginx les enverra au port 4000.

### 5.2 Sous-domaine dédié pour l’API (ex. api.votredomaine.com)

```nginx
# Frontend
server {
    listen 80;
    server_name votredomaine.com www.votredomaine.com;
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}

# API
server {
    listen 80;
    server_name api.votredomaine.com;
    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Côté frontend :

```env
NEXT_PUBLIC_API_URL=https://api.votredomaine.com
```

### 5.3 Activer le site et recharger Nginx

```bash
sudo ln -s /etc/nginx/sites-available/sae301 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5.4 SSL avec Certbot

```bash
sudo certbot --nginx -d votredomaine.com -d www.votredomaine.com
# Si sous-domaine API :
sudo certbot --nginx -d api.votredomaine.com
```

Renouvellement automatique : déjà géré par `certbot` (cron).

### 5.5 Apache (sae301.mmi24c01.mmi-troyes.fr)

Si vous utilisez **Apache** au lieu de Nginx, un fichier de config est fourni : `deploy/apache-sae301.conf`.

**1. Activer les modules proxy :**

```bash
sudo a2enmod proxy proxy_http
sudo systemctl restart apache2
```

**2. Installer le site :**

```bash
# Copier la config (depuis la racine du projet sur le serveur)
sudo cp /var/www/sae301/deploy/apache-sae301.conf /etc/apache2/sites-available/
sudo a2ensite apache-sae301.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

**3. Côté frontend**, dans `frontend/.env.local` sur le serveur :

```env
NEXT_PUBLIC_API_URL=https://sae301.mmi24c01.mmi-troyes.fr
NEXT_PUBLIC_ADMIN_PASSWORD=VotreMotDePasse
```

Le site sera servi sur `http://sae301.mmi24c01.mmi-troyes.fr` (et `https://...` si vous ajoutez SSL avec `certbot --apache -d sae301.mmi24c01.mmi-troyes.fr`).

**4. Firewall** (si Apache au lieu de Nginx) :

```bash
sudo ufw allow 'Apache Full'
sudo ufw enable
```

---

## 6. Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

Les ports 3001 (front) et 4000 (API) ne doivent pas être ouverts publiquement : seul Nginx (80/443) est exposé.

---

## 7. Résumé des commandes après mise à jour du code

```bash
cd ~/sae301/backend
git pull   # ou scp des fichiers
npm ci --omit=dev
pm2 restart sae301-api

cd ~/sae301/frontend
git pull
npm ci --omit=dev
npm run build
pm2 restart sae301-front
```

---

## 8. Points importants

| Élément | Détail |
|--------|--------|
| **Base de données** | SQLite, fichier `backend/db/cantine.db`. Pensez à sauvegarder ce fichier régulièrement. |
| **Secrets** | Ne jamais commiter `.env` / `.env.local`. Changer `NEXT_PUBLIC_ADMIN_PASSWORD` en production. |
| **CORS** | Le backend autorise toutes origines (`cors()`). En prod, vous pouvez restreindre à votre domaine si besoin. |
| **URL API dans le front** | Toutes les pages doivent utiliser `NEXT_PUBLIC_API_URL` (certains fichiers utilisent encore `localhost:4000` en dur ; à remplacer pour la prod). |

---

## 9. Vérifications rapides

- **API** : `curl https://votredomaine.com/api/health` (ou `https://api.votredomaine.com/api/health`) → doit retourner `{"status":"ok",...}`.
- **Front** : ouvrir `https://votredomaine.com` dans un navigateur.
- **Logs** : `pm2 logs` pour voir les erreurs backend et frontend.
