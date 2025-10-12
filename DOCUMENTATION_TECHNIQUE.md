# Documentation Technique - Site Web Interasso

## 📋 Table des matières

1. [Vue d'ensemble du projet](#vue-densemble-du-projet)
2. [Architecture technique](#architecture-technique)
3. [Stack technologique](#stack-technologique)
4. [Structure du projet](#structure-du-projet)
5. [Fonctionnalités principales](#fonctionnalités-principales)
6. [Système de rôles et permissions](#système-de-rôles-et-permissions)
7. [Design et UI/UX](#design-et-uiux)
8. [Backend et API](#backend-et-api)
9. [Base de données](#base-de-données)
10. [Déploiement](#déploiement)
11. [Contribution et collaboration](#contribution-et-collaboration)
12. [Roadmap](#roadmap)

---

## 🎯 Vue d'ensemble du projet

### Objectif

Créer une **plateforme centralisée Interasso** regroupant **5 BDE** de l'école, permettant de :

- **Présenter les 5 BDE** et leurs membres respectifs
- **Promouvoir les événements** de chaque BDE avec système de validation
- **Gérer les partenariats** communs à tous les BDE
- **Faciliter la collaboration** entre les différents BDE
- **Offrir une expérience utilisateur unifiée** pour tous les étudiants

### Les 5 BDE d'Interasso

1. **BDE MMI** (Métiers du Multimédia et de l'Internet) - Logo violet/noir "Emmi Wave"
2. **BDE MP**
3. **BDE Info**
4. **BDE Info-com**
5. **BDE R&T**

### Concept Interasso

**Interasso** est l'association centrale qui :

- Regroupe et coordonne les 5 BDE
- Gère les partenariats communs (restaurants, commerces, etc.)
- Valide les événements proposés par chaque BDE
- Assure une cohérence visuelle et fonctionnelle

### Inspiration

Le site s'inspire du BDE ENSSAT (https://bde-enssat.fr/) avec une identité visuelle modulaire permettant à chaque BDE d'avoir sa propre identité tout en restant dans la charte Interasso.

### Public cible

- **Étudiants de l'école** (tous les départements)
- **Membres des bureaux** des 5 BDE
- **Administrateurs Interasso**
- **Partenaires** et sponsors
- **Visiteurs externes**

---

## 🏗️ Architecture technique

### Architecture globale

```
┌─────────────────────────────────────────┐
│         Frontend (React)                │
│  - Magic UI Components                  │
│  - Tailwind CSS                          │
│  - GSAP Animations                       │
└──────────────┬──────────────────────────┘
               │
               │ REST API / GraphQL
               │
┌──────────────▼──────────────────────────┐
│         Backend (Node.js)               │
│  - Express.js                            │
│  - API Routes                            │
│  - Authentication                        │
└──────────────┬──────────────────────────┘
               │
               │
┌──────────────▼──────────────────────────┐
│         Base de données                 │
│  - MongoDB / PostgreSQL                 │
│  - Stockage médias (Cloudinary/AWS S3)  │
└─────────────────────────────────────────┘
```

### Type d'architecture

- **Frontend** : SPA (Single Page Application) avec React
- **Backend** : API RESTful avec Node.js/Express
- **Communication** : JSON via HTTP/HTTPS
- **Déploiement** : Séparé (Frontend + Backend)

---

## 🛠️ Stack technologique

### Frontend

| Technologie         | Version | Rôle                       |
| ------------------- | ------- | -------------------------- |
| **React**           | 18.x    | Framework principal        |
| **JavaScript**      | ES6+    | Langage de programmation   |
| **Tailwind CSS**    | 3.x     | Framework CSS utilitaire   |
| **Magic UI**        | Latest  | Bibliothèque de composants |
| **GSAP**            | 3.x     | Animations avancées        |
| **React Router**    | 6.x     | Navigation                 |
| **Axios**           | 1.x     | Requêtes HTTP              |
| **React Hook Form** | 7.x     | Gestion des formulaires    |
| **Framer Motion**   | 10.x    | Animations complémentaires |

### Backend

| Technologie    | Version  | Rôle                      |
| -------------- | -------- | ------------------------- |
| **Node.js**    | 18.x LTS | Runtime JavaScript        |
| **Express.js** | 4.x      | Framework web             |
| **JavaScript** | ES6+     | Langage de programmation  |
| **MongoDB**    | 6.x      | Base de données NoSQL     |
| **Mongoose**   | 7.x      | ODM MongoDB               |
| **JWT**        | 9.x      | Authentication tokens     |
| **bcrypt**     | 5.x      | Hashage de mots de passe  |
| **Multer**     | 1.x      | Upload de fichiers        |
| **Cloudinary** | 1.x      | Stockage d'images         |
| **Nodemailer** | 6.x      | Envoi d'emails            |
| **dotenv**     | 16.x     | Variables d'environnement |
| **CORS**       | 2.x      | Gestion CORS              |

### Outils de développement

| Outil        | Rôle                  |
| ------------ | --------------------- |
| **Vite**     | Bundler et dev server |
| **ESLint**   | Linting JavaScript    |
| **Prettier** | Formatage de code     |
| **Git**      | Contrôle de version   |
| **GitHub**   | Hébergement du code   |
| **Postman**  | Tests API             |

---

## 📁 Structure du projet

### Structure Frontend

```
frontend/
├── public/
│   ├── images/
│   │   ├── logo-emmi-wave.png
│   │   ├── events/
│   │   └── partners/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navigation.jsx
│   │   │   ├── Button.jsx
│   │   │   └── Card.jsx
│   │   ├── home/
│   │   │   ├── Hero.jsx
│   │   │   ├── Stats.jsx
│   │   │   ├── About.jsx
│   │   │   └── CallToAction.jsx
│   │   ├── events/
│   │   │   ├── EventList.jsx
│   │   │   ├── EventCard.jsx
│   │   │   ├── EventDetails.jsx
│   │   │   └── EventCalendar.jsx
│   │   ├── members/
│   │   │   ├── MembersList.jsx
│   │   │   ├── MemberCard.jsx
│   │   │   └── MemberProfile.jsx
│   │   ├── partners/
│   │   │   ├── PartnersList.jsx
│   │   │   ├── PartnerCard.jsx
│   │   │   └── PartnerCarousel.jsx
│   │   ├── adhesion/
│   │   │   ├── AdhesionForm.jsx
│   │   │   ├── PaymentOptions.jsx
│   │   │   └── AdhesionSuccess.jsx
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       ├── EventManager.jsx
│   │       ├── PartnerManager.jsx
│   │       └── MemberManager.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Events.jsx
│   │   ├── Members.jsx
│   │   ├── Partners.jsx
│   │   ├── Adhesion.jsx
│   │   ├── Contact.jsx
│   │   └── Admin.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useEvents.js
│   │   ├── usePartners.js
│   │   └── useAnimation.js
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── eventService.js
│   │   ├── partnerService.js
│   │   └── memberService.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── styles/
│   │   ├── globals.css
│   │   └── animations.css
│   ├── App.jsx
│   ├── main.jsx
│   └── router.jsx
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

### Structure Backend

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── cloudinary.js
│   │   └── email.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Partner.js
│   │   ├── Member.js
│   │   └── Adhesion.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   ├── partnerController.js
│   │   ├── memberController.js
│   │   └── adhesionController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── events.js
│   │   ├── partners.js
│   │   ├── members.js
│   │   └── adhesions.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── upload.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── emailTemplates.js
│   │   ├── imageProcessor.js
│   │   └── validators.js
│   ├── services/
│   │   ├── emailService.js
│   │   └── paymentService.js
│   └── server.js
├── uploads/
├── .env.example
├── .eslintrc.js
├── package.json
└── README.md
```

---

## 🎨 Fonctionnalités principales

### 1. Page d'accueil

#### Hero Section

- **Animation GSAP** : Logo Emmi Wave avec effet wave
- **Call-to-action** : Bouton "Devenir adhérent" prominent
- **Slogan** : Présentation du BDE

#### Section Statistiques

- Nombre d'adhérents
- Nombre d'événements
- Nombre de partenaires
- Nombre de clubs
- **Animation** : Compteur animé avec GSAP

#### Section Présentation

- **"Pour les étudiants"** : Mission du BDE
- **"Par les étudiants"** : Engagement de l'équipe
- **"Le BDE 2025"** : Présentation de l'équipe actuelle

#### Derniers événements

- Carousel d'événements à venir
- Cards avec images et dates

#### Partenaires

- Carousel de logos partenaires
- Animation au survol

### 2. Page Événements

#### Fonctionnalités

- **Liste complète** : Tous les événements (passés et à venir)
- **Filtres** : Par date, catégorie, statut
- **Vue calendrier** : Visualisation mensuelle
- **Détails** : Page dédiée par événement avec :
  - Titre, date, lieu
  - Description complète
  - Galerie photos
  - Bouton d'inscription (si applicable)
  - Partage sur réseaux sociaux

#### Gestion (Admin)

- Formulaire d'ajout simplifié :
  ```javascript
  {
    title: "Nom de l'événement",
    date: "Date/heure",
    location: "Lieu",
    description: "Description",
    category: "Soirée/Sportif/Culturel/Autre",
    images: [], // Upload multiple
    maxParticipants: number,
    price: number,
    status: "upcoming/past/cancelled"
  }
  ```
- Upload d'images par drag & drop
- Édition/suppression
- Gestion des inscriptions

### 3. Page Membres

#### Affichage

- **Bureau BDE** : Cards avec photo, nom, rôle
- **Animation GSAP** : Apparition progressive
- **Hover effect** : Rotation 3D de la card

#### Informations par membre

- Photo
- Prénom & Nom
- Rôle (Président, Trésorier, etc.)
- Description courte
- Réseaux sociaux (optionnel)

### 4. Page Partenaires

#### Affichage

- **Grille de logos** : Responsive
- **Catégories** : Restauration, Culture, Sport, etc.
- **Liens** : Redirection vers site partenaire

#### Gestion (Admin)

- Formulaire simplifié :
  ```javascript
  {
    name: "Nom du partenaire",
    category: "Catégorie",
    logo: "Upload image",
    website: "URL",
    description: "Description",
    advantages: "Avantages pour adhérents"
  }
  ```
- Preview en temps réel
- Gestion des catégories

### 5. Page Adhésion

#### Formulaire

- **Informations personnelles** :
  - Nom, Prénom
  - Email (étudiant)
  - Téléphone
  - Promotion/Classe
- **Type d'adhésion** :
  - Adhésion annuelle
  - Prix affiché
- **Paiement** :
  - Intégration HelloAsso / Stripe / Lydia
  - Confirmation par email

#### Process

1. Remplissage du formulaire
2. Validation des données
3. Redirection vers paiement
4. Confirmation
5. Email de bienvenue + carte membre virtuelle

### 6. Espace Admin

#### Dashboard

- Vue d'ensemble (stats)
- Activité récente
- Actions rapides

#### Gestion

- **Événements** : CRUD complet
- **Partenaires** : CRUD complet
- **Membres du bureau** : CRUD complet
- **Adhérents** : Liste, export CSV
- **Contenu** : Modification textes homepage

#### Sécurité

- Authentification JWT
- Rôles : Admin, Modérateur
- Logs d'activité

---

## 🎨 Design et UI/UX

### Charte graphique

#### Couleurs principales

```css
:root {
  /* Couleurs du logo */
  --primary-purple: #8b3fbf;
  --primary-violet: #a855f7;
  --accent-pink: #d946ef;
  --dark-bg: #0f0f0f;
  --white: #ffffff;

  /* Couleurs complémentaires */
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-800: #1f2937;
  --gray-900: #111827;

  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #8b3fbf 0%, #a855f7 100%);
  --gradient-glow: radial-gradient(
    circle,
    rgba(168, 85, 247, 0.3) 0%,
    transparent 70%
  );
}
```

#### Typographie

```css
/* Headings */
--font-heading: "Montserrat", sans-serif;
--font-heading-weight: 700;

/* Body */
--font-body: "Inter", sans-serif;
--font-body-weight: 400;

/* Sizes */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
--text-4xl: 2.25rem;
--text-5xl: 3rem;
```

### Composants Magic UI utilisés

1. **Hero Section**

   - `AnimatedBeam` pour effets de connexion
   - `ShimmerButton` pour CTA
   - `TypingAnimation` pour le slogan

2. **Cards**

   - `BentoGrid` pour layout moderne
   - `Card3D` pour membres du bureau
   - `GlowingCard` pour événements

3. **Animations**

   - `MarqueeDemo` pour partenaires
   - `NumberTicker` pour statistiques
   - `ParticlesBackground` pour hero

4. **Interactions**
   - `MagneticButton` pour CTA
   - `RippleEffect` sur boutons
   - `ScrollProgress` dans header

### Animations GSAP

#### Au chargement de page

```javascript
// Exemple d'animation hero
gsap.from(".hero-logo", {
  scale: 0,
  rotation: -180,
  duration: 1.5,
  ease: "elastic.out(1, 0.5)",
});

gsap.from(".hero-title", {
  y: 100,
  opacity: 0,
  duration: 1,
  delay: 0.5,
});
```

#### Scroll animations

```javascript
// ScrollTrigger pour sections
gsap.from(".event-card", {
  scrollTrigger: {
    trigger: ".events-section",
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none reverse",
  },
  y: 100,
  opacity: 0,
  stagger: 0.2,
});
```

#### Effets wave (logo)

```javascript
// Animation vague sur le logo
gsap.to(".wave-path", {
  morphSVG: ".wave-path-alt",
  duration: 2,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
});
```

### Responsive Design

#### Breakpoints Tailwind

```javascript
module.exports = {
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
};
```

#### Mobile-first approach

- Navigation burger menu
- Cards en colonne unique
- Touch-friendly buttons (min 44px)
- Optimisation images pour mobile

---

## 🔧 Backend et API

### Architecture API REST

#### Base URL

```
Production: https://api.bde-emmi-wave.fr/api/v1
Development: http://localhost:5000/api/v1
```

### Endpoints principaux

#### Authentication

```javascript
POST / auth / register; // Inscription admin
POST / auth / login; // Connexion
POST / auth / refresh - token; // Refresh JWT
POST / auth / logout; // Déconnexion
```

#### Events

```javascript
GET    /events                 // Liste tous les événements
GET    /events/:id             // Détails d'un événement
POST   /events                 // Créer événement (auth required)
PUT    /events/:id             // Modifier événement (auth required)
DELETE /events/:id             // Supprimer événement (auth required)
GET    /events/upcoming        // Événements à venir
GET    /events/past            // Événements passés
POST   /events/:id/register    // Inscription à un événement
```

#### Partners

```javascript
GET    /partners               // Liste tous les partenaires
GET    /partners/:id           // Détails partenaire
POST   /partners               // Ajouter partenaire (auth required)
PUT    /partners/:id           // Modifier partenaire (auth required)
DELETE /partners/:id           // Supprimer partenaire (auth required)
GET    /partners/category/:cat // Partenaires par catégorie
```

#### Members

```javascript
GET    /members                // Liste membres du bureau
GET    /members/:id            // Détails membre
POST   /members                // Ajouter membre (auth required)
PUT    /members/:id            // Modifier membre (auth required)
DELETE /members/:id            // Supprimer membre (auth required)
```

#### Adhesions

```javascript
POST   /adhesions              // Nouvelle adhésion
GET    /adhesions              // Liste adhérents (auth required)
GET    /adhesions/:id          // Détails adhésion
PUT    /adhesions/:id/status   // Valider adhésion (auth required)
GET    /adhesions/export/csv   // Export CSV (auth required)
```

#### Upload

```javascript
POST   /upload/image           // Upload image (auth required)
POST   /upload/images          // Upload multiple images (auth required)
DELETE /upload/image/:id       // Supprimer image (auth required)
```

### Modèles de données

#### Event Model

```javascript
const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    endDate: Date,
    location: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["soirée", "sport", "culture", "autre"],
      default: "autre",
    },
    images: [
      {
        url: String,
        publicId: String,
        alt: String,
      },
    ],
    coverImage: {
      url: String,
      publicId: String,
    },
    maxParticipants: Number,
    currentParticipants: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "past", "cancelled"],
      default: "upcoming",
    },
    registrationRequired: {
      type: Boolean,
      default: false,
    },
    registrations: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        registeredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
```

#### Partner Model

```javascript
const partnerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["restauration", "culture", "sport", "commerce", "autre"],
    },
    logo: {
      url: String,
      publicId: String,
      required: true,
    },
    website: String,
    description: String,
    advantages: String,
    contactEmail: String,
    contactPhone: String,
    address: String,
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
```

#### Member Model

```javascript
const memberSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: [
        "Président",
        "Vice-Président",
        "Trésorier",
        "Secrétaire",
        "Responsable Communication",
        "Responsable Événements",
        "Responsable Partenariats",
        "Membre",
      ],
    },
    photo: {
      url: String,
      publicId: String,
      required: true,
    },
    bio: String,
    email: String,
    promotion: String,
    socialLinks: {
      linkedin: String,
      instagram: String,
      twitter: String,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
```

#### Adhesion Model

```javascript
const adhesionSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: String,
    promotion: {
      type: String,
      required: true,
    },
    adhesionType: {
      type: String,
      enum: ["annuelle", "semestrielle"],
      default: "annuelle",
    },
    price: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["helloasso", "stripe", "lydia", "cash"],
      default: "helloasso",
    },
    paymentId: String,
    validFrom: {
      type: Date,
      default: Date.now,
    },
    validUntil: Date,
    cardNumber: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);
```

#### User Model (Admin)

```javascript
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["admin", "moderator"],
      default: "moderator",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
    refreshToken: String,
  },
  {
    timestamps: true,
  }
);
```

### Middleware

#### Authentication Middleware

```javascript
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Token manquant",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      error: "Token invalide",
    });
  }
};
```

#### Upload Middleware (Multer + Cloudinary)

```javascript
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Images uniquement!"));
    }
  },
});
```

#### Validation Middleware

```javascript
const validateEvent = (req, res, next) => {
  const { title, description, date, location } = req.body;

  if (!title || !description || !date || !location) {
    return res.status(400).json({
      error: "Champs requis manquants",
    });
  }

  if (new Date(date) < new Date()) {
    return res.status(400).json({
      error: "La date doit être dans le futur",
    });
  }

  next();
};
```

### Sécurité

#### Headers sécurité (Helmet)

```javascript
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      },
    },
  })
);
```

#### Rate Limiting

```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requêtes par IP
  message: "Trop de requêtes, réessayez plus tard",
});

app.use("/api/", limiter);
```

#### CORS Configuration

```javascript
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

---

## 💾 Base de données

### Choix : MongoDB

#### Avantages

- Flexibilité du schéma
- Facilité avec Node.js (Mongoose)
- Bon pour images/médias (références)
- Scalabilité horizontale

### Collections

1. **users** : Administrateurs
2. **events** : Événements
3. **partners** : Partenaires
4. **members** : Membres du bureau
5. **adhesions** : Adhésions

### Indexes

```javascript
// Events
eventSchema.index({ date: -1 });
eventSchema.index({ status: 1 });
eventSchema.index({ slug: 1 });

// Partners
partnerSchema.index({ category: 1 });
partnerSchema.index({ slug: 1 });

// Adhesions
adhesionSchema.index({ email: 1 });
adhesionSchema.index({ validUntil: -1 });
adhesionSchema.index({ cardNumber: 1 });
```

### Stockage des médias

#### Cloudinary

- Upload d'images
- Transformation automatique
- CDN intégré
- Optimisation WebP

```javascript
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Folders
- /emmi-wave/events/
- /emmi-wave/partners/
- /emmi-wave/members/
- /emmi-wave/general/
```

---

## 🚀 Déploiement

### Environnements

#### Production

- **Frontend** : Vercel / Netlify
- **Backend** : Railway / Render / DigitalOcean
- **Database** : MongoDB Atlas
- **CDN** : Cloudinary

#### Staging

- **Frontend** : Vercel preview
- **Backend** : Railway staging
- **Database** : MongoDB Atlas cluster dédié

### Variables d'environnement

#### Frontend (.env)

```env
VITE_API_URL=https://api.bde-emmi-wave.fr
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_SITE_URL=https://bde-emmi-wave.fr
VITE_ANALYTICS_ID=your_analytics_id
```

#### Backend (.env)

```env
# Server
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://bde-emmi-wave.fr

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bde-emmi-wave

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=contact@bde-emmi-wave.fr
EMAIL_PASSWORD=your_app_password

# Payment
HELLOASSO_API_KEY=your_api_key
HELLOASSO_API_SECRET=your_api_secret
# ou
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

### CI/CD avec GitHub Actions

#### Frontend deployment (.github/workflows/frontend.yml)

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths:
      - "frontend/**"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Build
        working-directory: ./frontend
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend
```

#### Backend deployment (.github/workflows/backend.yml)

```yaml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths:
      - "backend/**"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        working-directory: ./backend
        run: npm ci

      - name: Run tests
        working-directory: ./backend
        run: npm test

      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend
```

### Domaine et DNS

#### Configuration DNS

```
Type  | Name | Value
------|------|------
A     | @    | Vercel IP
CNAME | www  | cname.vercel-dns.com
CNAME | api  | Railway/Render URL
```

---

## 👥 Contribution et collaboration

### Workflow Git

#### Branches principales

```
main          → Production
develop       → Développement
feature/*     → Nouvelles fonctionnalités
bugfix/*      → Corrections de bugs
hotfix/*      → Corrections urgentes
```

#### Convention de commits

```
feat: Ajout formulaire adhésion
fix: Correction bug upload images
docs: Mise à jour README
style: Formatage code événements
refactor: Restructuration API partners
test: Ajout tests événements
chore: Mise à jour dépendances
```

### Structure GitHub

#### README.md principal

```markdown
# BDE Emmi Wave - Site Web Officiel

Site web moderne du BDE Emmi Wave permettant de présenter le BDE,
gérer les adhésions et promouvoir les événements.

## 🚀 Technologies

- Frontend: React, Tailwind CSS, Magic UI, GSAP
- Backend: Node.js, Express, MongoDB
- Déploiement: Vercel (frontend), Railway (backend)

## 📦 Installation

### Frontend

cd frontend
npm install
npm run dev

### Backend

cd backend
npm install
npm run dev

## 🤝 Contribution

Voir CONTRIBUTING.md

## 📄 License

MIT
```

#### CONTRIBUTING.md

```markdown
# Guide de contribution

## Ajouter un événement

1. Accéder à l'admin : `/admin`
2. Section "Événements" → "Ajouter"
3. Remplir le formulaire :
   - Titre de l'événement
   - Date et heure
   - Lieu
   - Description
   - Catégorie
   - Photos (drag & drop)
4. Sauvegarder

## Ajouter un partenaire

1. Accéder à l'admin : `/admin`
2. Section "Partenaires" → "Ajouter"
3. Remplir le formulaire :
   - Nom du partenaire
   - Logo (format PNG transparent recommandé)
   - Catégorie
   - Site web
   - Avantages
4. Sauvegarder

## Code de conduite

- Code propre et commenté
- Tests avant commit
- Respecter la structure du projet
- Pas de données sensibles dans les commits
```

### Documentation

#### docs/API.md

- Liste complète des endpoints
- Exemples de requêtes/réponses
- Codes d'erreur

#### docs/COMPONENTS.md

- Liste des composants réutilisables
- Props et usage
- Exemples

#### docs/DEPLOYMENT.md

- Process de déploiement
- Configuration serveurs
- Troubleshooting

### Issues et Pull Requests

#### Templates d'issue

**Bug report**

```markdown
**Description**
Description claire du bug

**Reproduction**
Étapes pour reproduire

**Comportement attendu**
Ce qui devrait se passer

**Screenshots**
Si applicable

**Environnement**

- OS:
- Navigateur:
- Version:
```

**Feature request**

```markdown
**Fonctionnalité demandée**
Description claire

**Pourquoi ?**
Justification

**Solution proposée**
Comment l'implémenter

**Alternatives**
Autres solutions possibles
```

#### Template de Pull Request

```markdown
**Type de changement**

- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

**Description**
Décrivez vos changements

**Tests**

- [ ] Tests ajoutés/mis à jour
- [ ] Tous les tests passent

**Checklist**

- [ ] Code formaté (Prettier)
- [ ] Pas d'erreurs ESLint
- [ ] Documentation mise à jour
- [ ] Screenshots si changement UI
```

---

## 🗓️ Roadmap

### Phase 1 : Setup & Core (Semaines 1-2)

#### Semaine 1

- [x] Initialiser les repos Git (frontend/backend)
- [x] Configuration Tailwind + Magic UI
- [x] Setup backend Express + MongoDB
- [x] Configuration Cloudinary
- [x] Mise en place authentification JWT
- [ ] Création modèles de données

#### Semaine 2

- [ ] Développement composants de base (Header, Footer, Card)
- [ ] API CRUD événements
- [ ] API CRUD partenaires
- [ ] API CRUD membres
- [ ] Upload d'images fonctionnel

### Phase 2 : Pages principales (Semaines 3-4)

#### Semaine 3

- [ ] Page d'accueil complète
  - Hero avec logo animé
  - Section stats
  - Présentation BDE
  - Derniers événements
  - Partenaires
- [ ] Page Événements
  - Liste
  - Filtres
  - Détails

#### Semaine 4

- [ ] Page Membres
  - Grille du bureau
  - Animations cards
- [ ] Page Partenaires
  - Grille logos
  - Catégories
- [ ] Page Contact
  - Formulaire
  - Infos pratiques

### Phase 3 : Adhésion & Admin (Semaines 5-6)

#### Semaine 5

- [ ] Formulaire d'adhésion
- [ ] Intégration paiement (HelloAsso/Stripe)
- [ ] Emails automatiques
- [ ] Génération carte membre

#### Semaine 6

- [ ] Dashboard admin
- [ ] Gestion événements (CRUD)
- [ ] Gestion partenaires (CRUD)
- [ ] Gestion membres bureau (CRUD)
- [ ] Export adhérents CSV

### Phase 4 : Animations & Polish (Semaine 7)

- [ ] Animations GSAP
  - Hero logo wave
  - Scroll reveals
  - Transitions pages
- [ ] Optimisation performances
  - Lazy loading images
  - Code splitting
  - Compression
- [ ] Tests responsive
- [ ] Accessibilité (a11y)

### Phase 5 : Testing & Deploy (Semaine 8)

- [ ] Tests unitaires
- [ ] Tests d'intégration
- [ ] Tests E2E (Cypress)
- [ ] Configuration CI/CD
- [ ] Déploiement staging
- [ ] Tests utilisateurs
- [ ] Déploiement production
- [ ] DNS et SSL

### Phase 6 : Post-launch

- [ ] Monitoring (Sentry, Analytics)
- [ ] Documentation complète
- [ ] Formation admin
- [ ] Collecte feedback
- [ ] Itérations

---

## 📊 Fonctionnalités futures (V2)

### Court terme

- [ ] Newsletter
- [ ] Système de notifications push
- [ ] Galerie photos événements passés
- [ ] Système de vote/sondages
- [ ] Integration réseaux sociaux (feed Instagram)

### Moyen terme

- [ ] Application mobile (React Native)
- [ ] Marketplace (vente de goodies)
- [ ] Système de réservation (salles, matériel)
- [ ] Blog/Actualités
- [ ] Forum/Discussion

### Long terme

- [ ] Gamification (points, badges)
- [ ] Matching événements (recommandations)
- [ ] API publique pour applications tierces
- [ ] Multi-langues (FR/EN)

---

## 🛠️ Commandes utiles

### Frontend

```bash
# Développement
npm run dev

# Build production
npm run build

# Preview build
npm run preview

# Linting
npm run lint

# Format code
npm run format

# Tests
npm run test
```

### Backend

```bash
# Développement (nodemon)
npm run dev

# Production
npm start

# Linting
npm run lint

# Tests
npm test

# Seed database (données test)
npm run seed

# Reset database
npm run db:reset
```

### Git

```bash
# Nouvelle fonctionnalité
git checkout -b feature/nom-fonctionnalite

# Commit
git add .
git commit -m "feat: description"

# Push
git push origin feature/nom-fonctionnalite

# Merge develop → main
git checkout main
git merge develop
git push origin main
```

---

## 📞 Support et contact

### Équipe technique

- **Lead Dev** : Collin Ethan
- **Email** : ethan.collin2304@gmail.com

### Ressources

- **Documentation** : `/docs`
- **API Docs** : `/docs/API.md`
- **Issues GitHub** : `github.com/votre-org/bde-emmi-wave/issues`
- **Wiki** : `github.com/votre-org/bde-emmi-wave/wiki`

---

## 📝 Notes importantes

### Bonnes pratiques

1. **Sécurité**

   - Ne jamais commit de secrets
   - Utiliser `.env` pour variables sensibles
   - Valider toutes les entrées utilisateur
   - Sanitizer les données

2. **Performance**

   - Optimiser images (WebP, lazy loading)
   - Minimiser les requêtes API
   - Cache côté client
   - CDN pour assets statiques

3. **Accessibilité**

   - Utiliser balises sémantiques
   - Alt text sur images
   - Navigation clavier
   - Contrastes WCAG AA

4. **SEO**
   - Meta tags appropriés
   - Sitemap.xml
   - Robots.txt
   - URLs descriptives

### Checklist avant production

- [ ] Variables d'environnement configurées
- [ ] HTTPS activé
- [ ] Monitoring en place
- [ ] Backups automatiques DB
- [ ] Rate limiting activé
- [ ] Logs configurés
- [ ] Analytics installés
- [ ] Tests de charge effectués
- [ ] Documentation à jour
- [ ] Politique de confidentialité
- [ ] Mentions légales

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Dernière mise à jour** : Octobre 2025  
**Version** : 1.0.0  
**Statut** : 🚧 En développement

---

## 🎨 Annexes

### Inspirations design

- https://bde-enssat.fr/
- https://magicui.design/
- https://ui.aceternity.com/
- https://www.awwwards.com/

### Ressources utiles

- **React** : https://react.dev/
- **Tailwind** : https://tailwindcss.com/
- **Magic UI** : https://magicui.design/docs
- **GSAP** : https://greensock.com/gsap/
- **MongoDB** : https://www.mongodb.com/docs/
- **Express** : https://expressjs.com/

### Outils de développement

- **VS Code** + Extensions (ESLint, Prettier, Tailwind CSS IntelliSense)
- **Postman** : Tests API
- **MongoDB Compass** : GUI MongoDB
- **Figma** : Design UI (si nécessaire)
- **Excalidraw** : Diagrammes

---

**Bonne chance pour le développement ! 🚀**
