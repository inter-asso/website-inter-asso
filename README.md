# 🌊 BDE Emmi Wave - Site Web Officiel

Site web moderne du BDE Emmi Wave permettant de présenter le BDE, gérer les adhésions et promouvoir les événements.

![Logo BDE Emmi Wave](./logo-emmi-wave.png)

## 🚀 Technologies

### Frontend

- **React** 18.x - Framework principal
- **Tailwind CSS** 3.x - Framework CSS utilitaire
- **Magic UI** - Bibliothèque de composants UI modernes
- **GSAP** 3.x - Animations avancées
- **Vite** - Build tool ultra-rapide

### Backend

- **Node.js** 18.x LTS - Runtime JavaScript
- **Express.js** 4.x - Framework web
- **MongoDB** 6.x - Base de données NoSQL
- **Cloudinary** - Gestion et stockage d'images
- **JWT** - Authentification sécurisée

## 📦 Installation

### Prérequis

- Node.js 18.x ou supérieur
- npm ou yarn
- Compte MongoDB Atlas (gratuit)
- Compte Cloudinary (gratuit)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Le site sera accessible sur `http://localhost:5000`

### Backend

```bash
cd backend
npm install
npm run dev
```

L'API sera accessible sur `http://localhost:5000`

## 🔧 Configuration

### Variables d'environnement

Créer un fichier `.env` dans le dossier `backend` :

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5000

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=24h

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Créer un fichier `.env` dans le dossier `frontend` :

```env
VITE_API_URL=http://localhost:5000/api/v1
```

## 📖 Documentation

La documentation technique complète est disponible dans [DOCUMENTATION_TECHNIQUE.md](./DOCUMENTATION_TECHNIQUE.md)

## 🤝 Contribution

Ce projet est collaboratif ! Voir [CONTRIBUTING.md](./CONTRIBUTING.md) pour savoir comment contribuer.

### Workflow Git

```bash
# Créer une nouvelle branche
git checkout -b feature/nom-fonctionnalite

# Faire vos modifications et commit
git add .
git commit -m "feat: description de la fonctionnalité"

# Push et créer une Pull Request
git push origin feature/nom-fonctionnalite
```

## 📝 Structure du projet

```
SiteBDEmmi/
├── frontend/          # Application React
├── backend/           # API Node.js/Express
├── docs/              # Documentation additionnelle
├── DOCUMENTATION_TECHNIQUE.md
└── README.md
```

## 🎯 Roadmap

- [x] Initialisation du projet
- [ ] Setup Frontend + Backend
- [ ] Authentification JWT
- [ ] CRUD Événements
- [ ] CRUD Partenaires
- [ ] CRUD Membres
- [ ] Système d'adhésion
- [ ] Interface Admin
- [ ] Animations GSAP
- [ ] Déploiement

## 👥 Équipe

- **Lead Dev** : Ethan Collin
- **Email** : ethan.collin2304@gmail.com

## 📄 Licence

MIT License - Voir [LICENSE](./LICENSE) pour plus de détails

---

**Version** : 1.0.0  
**Statut** : 🚧 En développement

Fait avec ❤️ par le BDE Emmi Wave
