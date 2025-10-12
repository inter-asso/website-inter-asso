# 🚀 Configuration des Services Externes - Interasso

## 📋 Services à configurer

1. ✅ **MongoDB Atlas** - Base de données (GRATUIT)
2. ✅ **Cloudinary** - Stockage d'images (GRATUIT)
3. ✅ **JWT Secrets** - Sécurité authentification

---

## 1️⃣ MongoDB Atlas (Base de données)

### Étape 1 : Créer un compte (5 min)

1. Aller sur **https://www.mongodb.com/cloud/atlas/register**
2. S'inscrire avec email ou Google
3. Sélectionner **"M0 Sandbox"** (Gratuit)
4. Choisir un provider : **AWS** (recommandé)
5. Région : **Europe (Paris) - eu-west-3** (ou la plus proche)

### Étape 2 : Créer un cluster (2 min)

1. Nom du cluster : `interasso-cluster` (ou garder le nom par défaut)
2. Cliquer sur **"Create Cluster"**
3. Attendre 1-2 minutes (création du cluster)

### Étape 3 : Configuration de sécurité (3 min)

#### A. Créer un utilisateur de base de données
1. Dans le menu de gauche : **Database Access**
2. Cliquer sur **"Add New Database User"**
3. Remplir :
   - **Username** : `interasso_admin`
   - **Password** : `[générer mot de passe]` → **NOTER LE MOT DE PASSE** 📝
   - **Database User Privileges** : Atlas admin
4. Cliquer sur **"Add User"**

#### B. Autoriser les connexions
1. Dans le menu de gauche : **Network Access**
2. Cliquer sur **"Add IP Address"**
3. Sélectionner **"Allow Access from Anywhere"** (pour le développement)
   - IP : `0.0.0.0/0`
4. Cliquer sur **"Confirm"**

⚠️ **Important** : En production, restreindre aux IP spécifiques

### Étape 4 : Obtenir la connection string (2 min)

1. Retourner dans **Database** (menu gauche)
2. Cliquer sur **"Connect"** sur votre cluster
3. Choisir **"Connect your application"**
4. Driver : **Node.js** / Version : **5.5 or later**
5. Copier la connection string :

```
mongodb+srv://interasso_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

6. **Remplacer `<password>`** par votre mot de passe
7. **Ajouter le nom de la base de données** : `interasso`

Connection string finale :
```
mongodb+srv://interasso_admin:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/interasso?retryWrites=true&w=majority
```

### Étape 5 : Mettre à jour .env

Ouvrir `backend/.env` et ajouter :

```env
MONGODB_URI=mongodb+srv://interasso_admin:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/interasso?retryWrites=true&w=majority
```

---

## 2️⃣ Cloudinary (Stockage d'images)

### Étape 1 : Créer un compte (3 min)

1. Aller sur **https://cloudinary.com/users/register_free**
2. S'inscrire avec email ou Google
3. Plan : **Free** (gratuit - 25 crédits/mois = ~25 000 images)

### Étape 2 : Récupérer les credentials (1 min)

1. Après inscription, vous êtes sur le **Dashboard**
2. Vous voyez vos credentials :
   ```
   Cloud name:    xxxxxxxx
   API Key:       xxxxxxxxxxxxxxx
   API Secret:    xxxxxxxxxxxxxxxxxxxxx
   ```

3. **NOTER ces 3 informations** 📝

### Étape 3 : Créer les dossiers (optionnel, 2 min)

1. Dans le menu de gauche : **Media Library**
2. Créer les dossiers pour organiser :
   - `interasso/bdes/` (logos des BDE)
   - `interasso/events/` (images événements)
   - `interasso/members/` (photos membres)
   - `interasso/partners/` (logos partenaires)

### Étape 4 : Mettre à jour .env

Ouvrir `backend/.env` et ajouter :

```env
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

---

## 3️⃣ JWT Secrets (Sécurité)

### Générer des clés aléatoires sécurisées

#### Option 1 : Avec Node.js (recommandé)

Ouvrir un terminal et exécuter :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Exécuter **2 fois** pour obtenir 2 clés différentes :
- 1ère clé → `JWT_SECRET`
- 2ème clé → `JWT_REFRESH_SECRET`

#### Option 2 : En ligne

Aller sur **https://generate-random.org/api-key-generator** et générer 2 clés de 64 caractères.

### Mettre à jour .env

```env
JWT_SECRET=votre_clé_générée_1_très_longue_et_aléatoire
JWT_REFRESH_SECRET=votre_clé_générée_2_différente_de_la_première
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
```

---

## 📄 Fichier .env complet

Créer le fichier `backend/.env` avec :

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database MongoDB Atlas
MONGODB_URI=mongodb+srv://interasso_admin:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/interasso?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=votre_clé_secrète_jwt_très_longue_64_caractères_minimum
JWT_REFRESH_SECRET=votre_clé_refresh_différente_également_très_longue
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Email Configuration (Nodemailer) - Optionnel pour l'instant
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=contact@interasso.fr
EMAIL_PASSWORD=votre_app_password
```

---

## ✅ Vérification de la configuration

### Tester MongoDB

Dans `backend/`, exécuter :

```bash
npm run dev
```

Vous devriez voir :
```
✅ MongoDB connecté: cluster0-xxxxx.mongodb.net
📊 Base de données: interasso
🚀 Serveur démarré sur le port 5000
```

### Tester Cloudinary

Créer un fichier test `backend/test-cloudinary.js` :

```javascript
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Test de connexion
cloudinary.v2.api.ping((error, result) => {
  if (error) {
    console.error('❌ Erreur Cloudinary:', error);
  } else {
    console.log('✅ Cloudinary connecté:', result);
  }
});
```

Exécuter :
```bash
node test-cloudinary.js
```

Si tout fonctionne : `✅ Cloudinary connecté: { status: 'ok' }`

---

## 🐛 Dépannage

### Erreur MongoDB "Authentication failed"
- Vérifier que le mot de passe dans la connection string est correct
- Pas de caractères spéciaux non encodés dans le mot de passe
- Si nécessaire, encoder les caractères spéciaux (ex: `@` → `%40`)

### Erreur MongoDB "Network timeout"
- Vérifier que vous avez autorisé `0.0.0.0/0` dans Network Access
- Attendre 1-2 minutes (propagation des règles)

### Erreur Cloudinary "Invalid credentials"
- Vérifier Cloud Name, API Key, API Secret
- Pas d'espaces avant/après dans le .env
- Relancer le serveur après modification du .env

### Le serveur ne lit pas le .env
- Vérifier que le fichier s'appelle exactement `.env` (pas `.env.txt`)
- Vérifier qu'il est bien dans le dossier `backend/`
- Redémarrer le terminal

---

## 🎯 Prochaines étapes

Une fois la configuration terminée :

1. ✅ MongoDB Atlas configuré
2. ✅ Cloudinary configuré
3. ✅ JWT Secrets générés
4. ⏳ Créer les données initiales (seed)
5. ⏳ Créer middleware de permissions
6. ⏳ Créer système de notifications

---

**Besoin d'aide ?** Consultez NEXT_STEPS.md ou la documentation technique v2.
