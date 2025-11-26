# 🔧 Backend API - BDE Emmi Wave

API RESTful pour le site du BDE Emmi Wave.

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18.x ou supérieur
- Compte MongoDB Atlas (gratuit)
- Compte Cloudinary (gratuit)

### Installation

1. **Installer les dépendances**

```bash
npm install
```

2. **Configurer les variables d'environnement**

Créer un fichier `.env` à la racine du dossier backend :

```bash
cp .env.example .env
```

Remplir le fichier `.env` avec vos informations :

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5000

# MongoDB Atlas
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/bde-emmi-wave

# JWT
JWT_SECRET=votre_secret_super_securise_ici
JWT_EXPIRES_IN=24h

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. **Démarrer le serveur**

```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

Le serveur sera accessible sur `http://localhost:5000`

## 📁 Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js         # Configuration MongoDB
│   │   └── cloudinary.js       # Configuration Cloudinary
│   ├── models/
│   │   ├── User.js             # Modèle Admin
│   │   ├── Event.js            # Modèle Événement
│   │   ├── Partner.js          # Modèle Partenaire
│   │   ├── Member.js           # Modèle Membre
│   │   └── Adhesion.js         # Modèle Adhésion
│   ├── controllers/            # Logique métier
│   ├── routes/                 # Routes API
│   ├── middleware/             # Middleware (auth, upload, etc.)
│   ├── utils/                  # Fonctions utilitaires
│   ├── services/               # Services (email, etc.)
│   └── server.js               # Point d'entrée
├── uploads/                    # Uploads temporaires
├── .env                        # Variables d'environnement (ne pas commit)
├── .env.example                # Exemple de variables
└── package.json
```

## 🔑 Configuration MongoDB Atlas

1. Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un cluster gratuit
3. Créer un utilisateur de base de données
4. Ajouter votre IP dans Network Access (ou 0.0.0.0/0 pour dev)
5. Récupérer la connection string et la mettre dans `.env`

## ☁️ Configuration Cloudinary

1. Créer un compte sur [Cloudinary](https://cloudinary.com/)
2. Dans le Dashboard, récupérer :
   - Cloud name
   - API Key
   - API Secret
3. Les mettre dans `.env`

## 📊 Modèles de données

### User (Admin)

- username
- email
- password (hashé)
- role (admin/moderator)

### Event

- title, description
- date, location
- images[], coverImage
- category (soirée/sport/culture/autre)
- prix, participants
- status (upcoming/past/cancelled)

### Partner

- name, logo
- category (restauration/culture/sport/commerce)
- website, description
- advantages (réductions pour adhérents)

### Member

- firstName, lastName
- role (Président, Trésorier, etc.)
- photo, bio
- socialLinks

### Adhesion

- firstName, lastName, email
- promotion
- adhesionType (annuelle/semestrielle)
- paymentStatus
- cardNumber (généré automatiquement)
- validUntil

## 🛠️ Commandes utiles

```bash
# Développement
npm run dev

# Production
npm start

# Tests
npm test
```

## 📄 Licence

MIT
