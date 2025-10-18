# Documentation Technique - Plateforme Interasso

## 📋 Table des matières

1. [Vue d'ensemble du projet](#vue-densemble-du-projet)
2. [Architecture technique](#architecture-technique)
3. [Système de rôles et permissions](#système-de-rôles-et-permissions)
4. [Stack technologique](#stack-technologique)
5. [Structure du projet](#structure-du-projet)
6. [Fonctionnalités principales](#fonctionnalités-principales)
7. [Design et UI/UX](#design-et-uiux)
8. [Backend et API](#backend-et-api)
9. [Base de données](#base-de-données)
10. [Déploiement](#déploiement)
11. [Roadmap](#roadmap)

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
2. **BDE [À définir]** - Nom et identité à compléter
3. **BDE [À définir]** - Nom et identité à compléter
4. **BDE [À définir]** - Nom et identité à compléter
5. **BDE [À définir]** - Nom et identité à compléter

### Concept Interasso

**Interasso** est l'association centrale qui :

- Regroupe et coordonne les 5 BDE
- Gère les partenariats communs (restaurants, commerces, etc.)
- **Valide les événements** proposés par chaque BDE
- Assure une cohérence visuelle et fonctionnelle
- Centralise la communication étudiante

### Public cible

- **Étudiants** de l'école (tous les départements)
- **Membres des bureaux** des 5 BDE
- **Administrateurs Interasso**
- **Partenaires** et sponsors
- **Visiteurs externes**

---

## 🏗️ Architecture technique

### Architecture globale

```
┌─────────────────────────────────────────────────────────────┐
│                  Frontend (React SPA)                       │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ Interface    │  │ Dashboard    │  │  Dashboard      │   │
│  │ Publique     │  │ BDE          │  │  Interasso      │   │
│  │ (visiteurs)  │  │ (5 comptes)  │  │  (Admin)        │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
│                                                             │
│  - Événements par BDE                                       │
│  - Membres des bureaux                                      │
│  - Partenaires communs                                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ REST API (JWT Authentication)
                         │ Rôles: admin_interasso, admin_bde, public
                         │
┌────────────────────────▼────────────────────────────────────┐
│              Backend (Node.js/Express)                      │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Middleware d'authentification et permissions        │  │
│  │  - JWT verification                                   │  │
│  │  - Role-based access control (RBAC)                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Système de validation événements                    │  │
│  │  - Création → Status PENDING                         │  │
│  │  - Notification Admin Interasso                      │  │
│  │  - Validation → Status PUBLISHED / REJECTED          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Système de notifications                            │  │
│  │  - Nouveau événement soumis                          │  │
│  │  - Événement validé/rejeté                           │  │
│  │  - Email automatique                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │
┌────────────────────────▼────────────────────────────────────┐
│                 Base de données MongoDB                     │
│                                                             │
│  Collections:                                               │
│  ┌────────────────────────────────────────────────────┐    │
│  │ users         → Admin Interasso + 5 comptes BDE    │    │
│  │ bdes          → Informations des 5 BDE             │    │
│  │ events        → Événements avec statut validation  │    │
│  │ members       → Membres des bureaux par BDE        │    │
│  │ partners      → Partenaires communs                │    │
│  │ notifications → Alertes pour validations           │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  + Cloudinary pour stockage images                          │
└─────────────────────────────────────────────────────────────┘
```

### Flux de validation des événements

```
┌──────────────────────────────────────────────────────────┐
│  ÉTAPE 1: Création événement par Admin BDE               │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Status: PENDING │
                │ createdBy: BDE  │
                │ bdeId: [ID]     │
                └────────┬────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│  ÉTAPE 2: Notification automatique                       │
│  → Email à Admin Interasso                               │
│  → Notification in-app                                   │
│  → Badge sur dashboard                                   │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│  ÉTAPE 3: Admin Interasso consulte                       │
│  → Dashboard "Événements en attente"                     │
│  → Voir détails, images, date, BDE concerné              │
└────────────────────────┬─────────────────────────────────┘
                         │
                    ┌────┴────┐
                    │ Décision │
                    └────┬────┘
                         │
            ┌────────────┴────────────┐
            ▼                         ▼
    ┌──────────────┐         ┌──────────────┐
    │   ACCEPTER   │         │   REFUSER    │
    └──────┬───────┘         └──────┬───────┘
           │                        │
           ▼                        ▼
 ┌──────────────────┐    ┌──────────────────┐
 │ Status: PUBLISHED│    │ Status: REJECTED │
 │ publishedAt: NOW │    │ rejectionReason  │
 └──────┬───────────┘    └──────┬───────────┘
        │                       │
        ▼                       ▼
 ┌──────────────┐        ┌──────────────┐
 │ Visible sur  │        │ Email au BDE │
 │ le site web  │        │ + raison     │
 └──────────────┘        └──────────────┘
```

---

## 🔐 Système de rôles et permissions

### Types de comptes

#### 1. Admin Interasso (Super Admin)

**Nombre** : 1 compte (ou 2-3 membres clés)

**Permissions** :

- ✅ **Événements** : Valider/Refuser tous les événements soumis
- ✅ **Partenaires** : CRUD complet (Create, Read, Update, Delete)
- ✅ **BDE** : Modifier les informations des 5 BDE
- ✅ **Utilisateurs** : Créer/Modifier les comptes Admin BDE
- ✅ **Dashboard** : Vue globale de toute la plateforme
- ✅ **Statistiques** : Accès à toutes les analytics

**Restrictions** :

- ❌ Ne peut pas créer d'événements directement (doit passer par un BDE)
- ❌ Ne peut pas modifier les membres d'un bureau BDE

#### 2. Admin BDE (5 comptes)

**Nombre** : 5 comptes (1 par BDE)

**Permissions** :

- ✅ **Événements de son BDE** : Créer, Modifier, Supprimer
- ✅ **Membres de son bureau** : CRUD complet
- ✅ **Partenaires** : Lecture seule (peut consulter)
- ✅ **Dashboard BDE** : Vue de son propre BDE
- ✅ **Notifications** : Recevoir alertes validation

**Restrictions** :

- ❌ Ne peut pas valider ses propres événements
- ❌ Ne peut pas voir/modifier les autres BDE
- ❌ Ne peut pas gérer les partenaires
- ❌ Ne peut pas créer d'autres comptes

#### 3. Public (Non connecté)

**Permissions** :

- ✅ Voir tous les événements **PUBLISHED**
- ✅ Voir tous les membres des bureaux
- ✅ Voir tous les partenaires
- ✅ Filtrer par BDE
- ✅ Contacter via formulaire

**Restrictions** :

- ❌ Pas d'accès aux dashboards
- ❌ Ne voit pas les événements PENDING/REJECTED

### Matrice de permissions

| Action                    | Admin Interasso | Admin BDE                | Public |
| ------------------------- | --------------- | ------------------------ | ------ |
| **Événements**            |
| Créer événement           | ❌              | ✅ (son BDE)             | ❌     |
| Modifier événement        | ✅ (tous)       | ✅ (son BDE, si PENDING) | ❌     |
| Supprimer événement       | ✅ (tous)       | ✅ (son BDE)             | ❌     |
| Valider événement         | ✅              | ❌                       | ❌     |
| Voir événements PUBLISHED | ✅              | ✅                       | ✅     |
| Voir événements PENDING   | ✅              | ✅ (les siens)           | ❌     |
| **Membres**               |
| Ajouter membre            | ❌              | ✅ (son bureau)          | ❌     |
| Modifier membre           | ❌              | ✅ (son bureau)          | ❌     |
| Supprimer membre          | ❌              | ✅ (son bureau)          | ❌     |
| Voir membres              | ✅              | ✅                       | ✅     |
| **Partenaires**           |
| Ajouter partenaire        | ✅              | ❌                       | ❌     |
| Modifier partenaire       | ✅              | ❌                       | ❌     |
| Supprimer partenaire      | ✅              | ❌                       | ❌     |
| Voir partenaires          | ✅              | ✅                       | ✅     |
| **BDE**                   |
| Modifier infos BDE        | ✅              | ❌                       | ❌     |
| Voir infos BDE            | ✅              | ✅                       | ✅     |
| **Utilisateurs**          |
| Créer compte BDE          | ✅              | ❌                       | ❌     |
| Modifier compte BDE       | ✅              | ❌                       | ❌     |

---

## 🛠️ Stack technologique

### Frontend

| Technologie         | Version | Rôle                          |
| ------------------- | ------- | ----------------------------- |
| **React**           | 18.x    | Framework principal           |
| **JavaScript**      | ES6+    | Langage de programmation      |
| **Tailwind CSS**    | 3.x     | Framework CSS utilitaire      |
| **Magic UI**        | Latest  | Bibliothèque de composants    |
| **GSAP**            | 3.x     | Animations avancées           |
| **React Router**    | 6.x     | Navigation + Protected Routes |
| **Axios**           | 1.x     | Requêtes HTTP                 |
| **React Hook Form** | 7.x     | Gestion des formulaires       |
| **Framer Motion**   | 10.x    | Animations complémentaires    |
| **React Query**     | 4.x     | State management API          |
| **Zustand**         | 4.x     | State management global       |

### Backend

| Technologie            | Version  | Rôle                      |
| ---------------------- | -------- | ------------------------- |
| **Node.js**            | 18.x LTS | Runtime JavaScript        |
| **Express.js**         | 4.x      | Framework web             |
| **JavaScript**         | ES6+     | Langage de programmation  |
| **MongoDB**            | 6.x      | Base de données NoSQL     |
| **Mongoose**           | 7.x      | ODM MongoDB               |
| **JWT**                | 9.x      | Authentication tokens     |
| **bcrypt**             | 5.x      | Hashage de mots de passe  |
| **Multer**             | 1.x      | Upload de fichiers        |
| **Cloudinary**         | 1.x      | Stockage d'images         |
| **Nodemailer**         | 6.x      | Envoi d'emails            |
| **dotenv**             | 16.x     | Variables d'environnement |
| **CORS**               | 2.x      | Gestion CORS              |
| **Helmet**             | 8.x      | Sécurité headers          |
| **express-rate-limit** | 8.x      | Rate limiting             |

---

## 📁 Structure du projet

### Structure Frontend

```
frontend/
├── public/
│   ├── images/
│   │   ├── logo-interasso.png
│   │   ├── logos-bde/
│   │   │   ├── emmi-wave.png
│   │   │   ├── bde2.png
│   │   │   ├── bde3.png
│   │   │   ├── bde4.png
│   │   │   └── bde5.png
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
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Notification.jsx
│   │   ├── home/
│   │   │   ├── Hero.jsx
│   │   │   ├── BDEGrid.jsx              // Grille des 5 BDE
│   │   │   ├── UpcomingEvents.jsx
│   │   │   ├── Stats.jsx
│   │   │   └── PartnersCarousel.jsx
│   │   ├── bde/
│   │   │   ├── BDECard.jsx              // Card d'un BDE
│   │   │   ├── BDEPage.jsx              // Page dédiée à un BDE
│   │   │   └── BDESelector.jsx          // Filtre par BDE
│   │   ├── events/
│   │   │   ├── EventList.jsx
│   │   │   ├── EventCard.jsx
│   │   │   ├── EventDetails.jsx
│   │   │   ├── EventFilter.jsx          // Filtre par BDE/date/catégorie
│   │   │   └── EventCalendar.jsx
│   │   ├── members/
│   │   │   ├── MembersList.jsx          // Par BDE
│   │   │   ├── MemberCard.jsx
│   │   │   └── BureauSection.jsx
│   │   ├── partners/
│   │   │   ├── PartnersList.jsx
│   │   │   ├── PartnerCard.jsx
│   │   │   └── PartnerCarousel.jsx
│   │   ├── dashboards/
│   │   │   ├── interasso/
│   │   │   │   ├── InterassoDashboard.jsx
│   │   │   │   ├── EventValidation.jsx   // Validation événements
│   │   │   │   ├── PartnerManager.jsx
│   │   │   │   ├── BDEManager.jsx
│   │   │   │   ├── UserManager.jsx       // Gérer les 5 comptes BDE
│   │   │   │   └── Statistics.jsx
│   │   │   └── bde/
│   │   │       ├── BDEDashboard.jsx
│   │   │       ├── EventManager.jsx      // CRUD événements
│   │   │       ├── MemberManager.jsx     // CRUD membres bureau
│   │   │       ├── Notifications.jsx     // Alertes validation
│   │   │       └── MyBDEStats.jsx
│   │   └── auth/
│   │       ├── LoginForm.jsx
│   │       ├── ProtectedRoute.jsx
│   │       └── RoleGuard.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── BDEs.jsx                      // Liste des 5 BDE
│   │   ├── BDEDetail.jsx                 // Page d'un BDE spécifique
│   │   ├── Events.jsx
│   │   ├── Members.jsx
│   │   ├── Partners.jsx
│   │   ├── Contact.jsx
│   │   ├── Login.jsx
│   │   ├── DashboardInterasso.jsx
│   │   └── DashboardBDE.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useEvents.js
│   │   ├── useNotifications.js
│   │   ├── useBDEs.js
│   │   └── usePermissions.js
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── eventService.js
│   │   ├── bdeService.js
│   │   ├── memberService.js
│   │   ├── partnerService.js
│   │   └── notificationService.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── permissions.js
│   │   ├── validators.js
│   │   └── helpers.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── BDEContext.jsx
│   │   └── NotificationContext.jsx
│   ├── store/                            // Zustand
│   │   ├── authStore.js
│   │   ├── bdeStore.js
│   │   └── notificationStore.js
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
│   │   ├── User.js                       // Admin Interasso + Admin BDE
│   │   ├── BDE.js                        // Les 5 BDE
│   │   ├── Event.js                      // Avec status validation
│   │   ├── Member.js                     // Membres bureaux par BDE
│   │   ├── Partner.js
│   │   └── Notification.js               // Système de notifications
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bdeController.js
│   │   ├── eventController.js
│   │   ├── memberController.js
│   │   ├── partnerController.js
│   │   ├── notificationController.js
│   │   └── validationController.js       // Validation événements
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bdes.js
│   │   ├── events.js
│   │   ├── members.js
│   │   ├── partners.js
│   │   ├── notifications.js
│   │   └── validation.js
│   ├── middleware/
│   │   ├── auth.js                       // JWT verification
│   │   ├── permissions.js                // RBAC (Role-Based Access Control)
│   │   ├── upload.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── emailTemplates.js
│   │   ├── imageProcessor.js
│   │   ├── validators.js
│   │   ├── permissions.js
│   │   └── slugify.js
│   ├── services/
│   │   ├── emailService.js
│   │   └── notificationService.js
│   └── server.js
├── uploads/
├── .env.example
├── .eslintrc.js
├── package.json
└── README.md
```

---

## 🎨 Fonctionnalités principales

### 1. Page d'accueil (Publique)

#### Hero Section Interasso

- **Logo Interasso** avec animation GSAP
- **Slogan** : "5 BDE, 1 communauté"
- **Call-to-action** : Explorer les BDE
- **Animation** : Effet wave sur le background

#### Section "Les 5 BDE"

- **Grille interactive** des 5 BDE
- Chaque card affiche :
  - Logo du BDE
  - Nom du BDE
  - Slogan court
  - Nombre de membres
  - Nombre d'événements à venir
  - Bouton "Découvrir"
- **Hover effect** : Animation 3D avec Magic UI
- **Click** : Redirection vers page dédiée du BDE

#### Événements à venir (tous BDE)

- **Carousel** des prochains événements
- **Badge** indiquant le BDE organisateur (logo + couleur)
- Filtres rapides par BDE

#### Partenaires communs

- **Marquee** avec logos partenaires
- Catégories : Restauration, Culture, Sport, Commerce

#### Statistiques globales

```
┌──────────────────────────────────────────────┐
│  🎓 5 BDE    |   📅 24 événements à venir    │
│  👥 45 membres bureau  |  🤝 18 partenaires  │
└──────────────────────────────────────────────┘
```

### 2. Page BDE individuelle

**URL** : `/bde/emmi-wave` ou `/bde/:slug`

#### Header BDE

- Logo + couleurs du BDE
- Nom complet
- Présentation (2-3 lignes)
- Réseaux sociaux du BDE

#### Bureau du BDE

- **Cards des membres** avec photo, nom, rôle
- Animation GSAP au scroll
- Click → Modal avec bio complète

#### Événements du BDE

- **Liste filtrée** : uniquement événements de ce BDE
- Tri par date (à venir / passés)
- Status PUBLISHED uniquement

#### Call-to-action

- Suivre le BDE (lien Instagram/Facebook)
- Contacter le bureau

### 3. Page Événements (Publique)

#### Fonctionnalités

- **Liste complète** de tous les événements PUBLISHED
- **Filtres** :
  - Par BDE (dropdown avec les 5 BDE)
  - Par date (à venir / passés)
  - Par catégorie (Soirée, Sport, Culture, Autre)
  - Recherche par mot-clé
- **Vue** :
  - Grille de cards
  - Vue calendrier
  - Vue liste

#### Event Card

```
┌────────────────────────────────────┐
│  [IMAGE COVER]                     │
│                                    │
│  🎭 Soirée Halloween               │
│  📅 31 Oct 2025 - 20h00            │
│  📍 Amphithéâtre A                 │
│  🎓 [Logo BDE MMI]                 │
│                                    │
│  [Voir détails →]                  │
└────────────────────────────────────┘
```

#### Détails d'un événement

- Titre, date, lieu, BDE organisateur
- Description complète
- Galerie photos
- Informations pratiques
- Partage sur réseaux sociaux

### 4. Dashboard Admin Interasso

**Accès** : `/dashboard/interasso` (protégé, role: admin_interasso)

#### Vue d'ensemble

```
┌─────────────────────────────────────────────────┐
│  📊 Statistiques globales                       │
│  - Événements en attente : 3                    │
│  - Événements publiés ce mois : 12              │
│  - Nouveaux partenaires : 2                     │
│  - Total membres bureaux : 45                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  🔔 Événements en attente de validation         │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ 🎭 Soirée Halloween                       │ │
│  │ BDE MMI - Créé le 10/10/2025              │ │
│  │ [Voir détails] [✅ Accepter] [❌ Refuser] │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ ⚽ Tournoi de foot                        │ │
│  │ BDE [Autre] - Créé le 09/10/2025          │ │
│  │ [Voir détails] [✅ Accepter] [❌ Refuser] │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

#### Sections

1. **Validation événements**
   - Liste des événements PENDING
   - Modal de détails complet
   - Boutons Accepter/Refuser
   - Champ "Raison du refus" (si rejet)
2. **Gestion partenaires**

   - CRUD complet
   - Upload logo
   - Catégories
   - Avantages pour étudiants

3. **Gestion BDE**

   - Modifier infos des 5 BDE
   - Logos, couleurs, descriptions
   - Activer/Désactiver un BDE

4. **Gestion utilisateurs**

   - Créer les 5 comptes Admin BDE
   - Modifier emails/mots de passe
   - Réinitialiser accès

5. **Statistiques**
   - Analytics par BDE
   - Événements les plus populaires
   - Graphiques d'activité

### 5. Dashboard Admin BDE

**Accès** : `/dashboard/bde` (protégé, role: admin_bde)

#### Vue d'ensemble (Mon BDE)

```
┌─────────────────────────────────────────────────┐
│  📊 BDE MMI - Tableau de bord                   │
│                                                 │
│  - Événements publiés : 8                       │
│  - Événements en attente : 1                    │
│  - Événements refusés : 0                       │
│  - Membres du bureau : 9                        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  🔔 Notifications                               │
│  ✅ "Soirée Halloween" a été ACCEPTÉ            │
│  ❌ "Sortie ski" a été REFUSÉ                   │
│     Raison: Date trop proche, manque d'infos    │
└─────────────────────────────────────────────────┘
```

#### Sections

1. **Mes événements**

   - Liste de tous les événements de son BDE
   - Status : PENDING / PUBLISHED / REJECTED
   - Créer nouvel événement
   - Modifier événements PENDING
   - Supprimer événements

2. **Formulaire création événement**

   ```javascript
   {
     title: "Nom de l'événement",
     date: "Date/heure",
     location: "Lieu",
     description: "Description complète",
     category: "Soirée/Sport/Culture/Autre",
     images: [], // Upload multiple (drag & drop)
     coverImage: {}, // Image principale
     maxParticipants: number, // Optionnel
     price: number, // Optionnel (0 = gratuit)
     // Automatique:
     status: "PENDING",
     bdeId: "[ID du BDE connecté]",
     createdBy: "[ID user connecté]"
   }
   ```

3. **Membres de mon bureau**

   - CRUD complet des membres
   - Upload photos
   - Ordre d'affichage (drag & drop)

4. **Notifications**
   - Événement validé → notification verte
   - Événement refusé → notification rouge + raison
   - Marquer comme lu

### 6. Page Partenaires (Publique)

#### Affichage

- **Grille responsive** de logos
- **Catégories** :
  - 🍔 Restauration
  - 🎨 Culture
  - ⚽ Sport
  - 🛍️ Commerce
  - 🎓 Autres

#### Partner Card

```
┌────────────────────────────────┐
│  [LOGO PARTENAIRE]             │
│                                │
│  Nom du partenaire             │
│  Catégorie                     │
│                                │
│  💰 -10% avec ta carte BDE     │
│                                │
│  [Voir détails →]              │
└────────────────────────────────┘
```

#### Détails partenaire

- Logo, nom, description
- **Avantages** pour adhérents
- Site web, adresse
- Réseaux sociaux

---

## 💾 Base de données

### Collections MongoDB

#### 1. Collection `users`

**Administrateurs** (Interasso + 5 BDE)

```javascript
{
  _id: ObjectId,
  username: String,           // "admin_interasso" ou "admin_bde_mmi"
  email: String,
  password: String,           // Hash bcrypt
  role: String,               // "admin_interasso" | "admin_bde"
  bdeId: ObjectId,            // Référence au BDE (null si admin_interasso)
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes** :

```javascript
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ bdeId: 1 });
```

#### 2. Collection `bdes`

**Les 5 BDE**

```javascript
{
  _id: ObjectId,
  name: String,               // "BDE MMI"
  slug: String,               // "emmi-wave" (unique, pour URL)
  fullName: String,           // "BDE MMI - Emmi Wave"
  description: String,        // Présentation du BDE
  logo: {
    url: String,
    publicId: String
  },
  colors: {
    primary: String,          // "#8B3FBF"
    secondary: String         // "#A855F7"
  },
  socialLinks: {
    instagram: String,
    facebook: String,
    twitter: String,
    email: String
  },
  contactEmail: String,
  isActive: Boolean,          // Activer/désactiver un BDE
  displayOrder: Number,       // Ordre d'affichage
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes** :

```javascript
bdeSchema.index({ slug: 1 }, { unique: true });
bdeSchema.index({ isActive: 1 });
bdeSchema.index({ displayOrder: 1 });
```

#### 3. Collection `events`

**Événements avec validation**

```javascript
{
  _id: ObjectId,
  title: String,
  slug: String,               // URL-friendly
  description: String,
  date: Date,
  endDate: Date,
  location: String,
  category: String,           // "soirée" | "sport" | "culture" | "autre"
  images: [{
    url: String,
    publicId: String,
    alt: String
  }],
  coverImage: {
    url: String,
    publicId: String
  },
  maxParticipants: Number,
  price: Number,

  // NOUVEAU: Système de validation
  status: String,             // "PENDING" | "PUBLISHED" | "REJECTED"
  bdeId: ObjectId,            // Référence au BDE organisateur
  createdBy: ObjectId,        // Référence au user qui a créé

  // Si PUBLISHED
  publishedAt: Date,
  publishedBy: ObjectId,      // Admin Interasso qui a validé

  // Si REJECTED
  rejectionReason: String,
  rejectedAt: Date,
  rejectedBy: ObjectId,

  createdAt: Date,
  updatedAt: Date
}
```

**Indexes** :

```javascript
eventSchema.index({ status: 1 });
eventSchema.index({ bdeId: 1 });
eventSchema.index({ date: -1 });
eventSchema.index({ slug: 1 }, { unique: true });
eventSchema.index({ createdBy: 1 });
```

**Middleware** :

```javascript
// Auto-génération du slug
eventSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title);
  }
  next();
});

// Par défaut: status PENDING
eventSchema.pre("save", function (next) {
  if (this.isNew) {
    this.status = "PENDING";
  }
  next();
});
```

#### 4. Collection `members`

**Membres des bureaux par BDE**

```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  role: String,               // "Président" | "Vice-Président" | "Trésorier" | etc.
  photo: {
    url: String,
    publicId: String
  },
  bio: String,
  email: String,
  promotion: String,          // "2024-2025"

  // NOUVEAU: Référence au BDE
  bdeId: ObjectId,            // Référence au BDE

  socialLinks: {
    linkedin: String,
    instagram: String
  },
  displayOrder: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes** :

```javascript
memberSchema.index({ bdeId: 1 });
memberSchema.index({ isActive: 1 });
memberSchema.index({ displayOrder: 1 });
```

#### 5. Collection `partners`

**Partenaires communs** (pas de changement)

```javascript
{
  _id: ObjectId,
  name: String,
  slug: String,
  category: String,           // "restauration" | "culture" | "sport" | "commerce" | "autre"
  logo: {
    url: String,
    publicId: String
  },
  website: String,
  description: String,
  advantages: String,         // Avantages pour étudiants
  contactEmail: String,
  contactPhone: String,
  address: String,
  socialLinks: {
    facebook: String,
    instagram: String
  },
  isActive: Boolean,
  displayOrder: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### 6. Collection `notifications`

**Système de notifications** (NOUVEAU)

```javascript
{
  _id: ObjectId,
  type: String,               // "EVENT_SUBMITTED" | "EVENT_VALIDATED" | "EVENT_REJECTED"
  title: String,
  message: String,

  // Destinataire
  recipientId: ObjectId,      // User qui reçoit la notif
  recipientRole: String,      // "admin_interasso" | "admin_bde"

  // Référence
  eventId: ObjectId,          // Événement concerné
  bdeId: ObjectId,            // BDE concerné

  // Statut
  isRead: Boolean,
  readAt: Date,

  createdAt: Date
}
```

**Indexes** :

```javascript
notificationSchema.index({ recipientId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ eventId: 1 });
```

---

## 🔧 Backend et API

### Endpoints principaux

#### Base URL

```
Production: https://api.interasso.fr/api/v1
Development: http://localhost:5000/api/v1
```

### Authentication

```javascript
POST / auth / login; // Connexion (Interasso ou BDE)
POST / auth / logout; // Déconnexion
POST / auth / refresh - token; // Refresh JWT
GET / auth / me; // Profil utilisateur connecté
PUT / auth / change - password; // Changer mot de passe
```

### BDEs

```javascript
GET    /bdes                   // Liste des 5 BDE (public)
GET    /bdes/:slug             // Détails d'un BDE (public)
PUT    /bdes/:id               // Modifier BDE (admin_interasso only)
GET    /bdes/:id/events        // Événements d'un BDE (public, PUBLISHED uniquement)
GET    /bdes/:id/members       // Membres d'un BDE (public)
```

### Events

**Public (non authentifié)**

```javascript
GET    /events                 // Liste événements PUBLISHED
GET    /events/:slug           // Détails événement PUBLISHED
GET    /events?bdeId=xxx       // Filtrer par BDE
GET    /events?category=xxx    // Filtrer par catégorie
GET    /events/upcoming        // Événements à venir
GET    /events/past            // Événements passés
```

**Admin BDE (authentifié, role: admin_bde)**

```javascript
POST   /events                 // Créer événement (→ status PENDING)
GET    /events/my-bde          // Événements de mon BDE (tous status)
PUT    /events/:id             // Modifier événement (si PENDING et son BDE)
DELETE /events/:id             // Supprimer événement (si son BDE)
```

**Admin Interasso (authentifié, role: admin_interasso)**

```javascript
GET    /events/pending         // Tous événements PENDING
PUT    /events/:id/validate    // Valider événement (PENDING → PUBLISHED)
PUT    /events/:id/reject      // Refuser événement (PENDING → REJECTED)
                               // Body: { rejectionReason: "..." }
GET    /events/all             // Tous événements (tous status)
```

### Members

**Public**

```javascript
GET    /members                // Tous membres actifs
GET    /members?bdeId=xxx      // Membres d'un BDE
GET    /members/:id            // Détails membre
```

**Admin BDE (authentifié)**

```javascript
POST   /members                // Ajouter membre (à son BDE uniquement)
PUT    /members/:id            // Modifier membre (de son BDE uniquement)
DELETE /members/:id            // Supprimer membre (de son BDE uniquement)
GET    /members/my-bde         // Membres de mon BDE
```

### Partners

**Public**

```javascript
GET    /partners               // Tous partenaires actifs
GET    /partners/:slug         // Détails partenaire
GET    /partners?category=xxx  // Filtrer par catégorie
```

**Admin Interasso uniquement**

```javascript
POST   /partners               // Ajouter partenaire
PUT    /partners/:id           // Modifier partenaire
DELETE /partners/:id           // Supprimer partenaire
```

### Notifications

**Admin Interasso**

```javascript
GET    /notifications          // Mes notifications
PUT    /notifications/:id/read // Marquer comme lu
DELETE /notifications/:id      // Supprimer notification
GET    /notifications/unread   // Nombre non lues
```

**Admin BDE**

```javascript
GET    /notifications          // Mes notifications (validations de mes events)
PUT    /notifications/:id/read
DELETE /notifications/:id
```

### Upload

```javascript
POST   /upload/image           // Upload image (auth required)
POST   /upload/images          // Upload multiple (auth required)
DELETE /upload/image/:id       // Supprimer image (auth required)
```

### Users (Admin Interasso uniquement)

```javascript
GET    /users                  // Liste des 5 comptes BDE
POST   /users                  // Créer compte Admin BDE
PUT    /users/:id              // Modifier compte BDE
DELETE /users/:id              // Supprimer compte BDE
PUT    /users/:id/reset-password // Réinitialiser mot de passe
```

---

## 🔒 Middleware de permissions

### auth.js

```javascript
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token manquant" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, bdeId }
    next();
  } catch (error) {
    res.status(401).json({ error: "Token invalide" });
  }
};
```

### permissions.js (RBAC)

```javascript
// Vérifier si admin Interasso
const isAdminInterasso = (req, res, next) => {
  if (req.user.role !== "admin_interasso") {
    return res.status(403).json({
      error: "Accès refusé: Admin Interasso requis",
    });
  }
  next();
};

// Vérifier si admin BDE
const isAdminBDE = (req, res, next) => {
  if (req.user.role !== "admin_bde") {
    return res.status(403).json({
      error: "Accès refusé: Admin BDE requis",
    });
  }
  next();
};

// Vérifier si admin Interasso OU admin BDE
const isAdmin = (req, res, next) => {
  if (!["admin_interasso", "admin_bde"].includes(req.user.role)) {
    return res.status(403).json({
      error: "Accès refusé: Administrateur requis",
    });
  }
  next();
};

// Vérifier si l'événement appartient au BDE de l'user
const canEditEvent = async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({ error: "Événement non trouvé" });
  }

  // Admin Interasso peut tout modifier
  if (req.user.role === "admin_interasso") {
    return next();
  }

  // Admin BDE peut modifier uniquement ses événements PENDING
  if (req.user.role === "admin_bde") {
    if (event.bdeId.toString() !== req.user.bdeId.toString()) {
      return res.status(403).json({
        error: "Vous ne pouvez modifier que les événements de votre BDE",
      });
    }

    if (event.status !== "PENDING") {
      return res.status(403).json({
        error: "Vous ne pouvez modifier que les événements en attente",
      });
    }
  }

  next();
};
```

### Utilisation dans les routes

```javascript
// routes/events.js
import {
  authMiddleware,
  isAdminInterasso,
  isAdminBDE,
  canEditEvent,
} from "../middleware/permissions.js";

// Public
router.get("/", eventController.getPublishedEvents);
router.get("/:slug", eventController.getEventBySlug);

// Admin BDE
router.post("/", authMiddleware, isAdminBDE, eventController.createEvent);
router.put("/:id", authMiddleware, canEditEvent, eventController.updateEvent);
router.delete(
  "/:id",
  authMiddleware,
  canEditEvent,
  eventController.deleteEvent
);

// Admin Interasso
router.get(
  "/pending",
  authMiddleware,
  isAdminInterasso,
  eventController.getPendingEvents
);
router.put(
  "/:id/validate",
  authMiddleware,
  isAdminInterasso,
  eventController.validateEvent
);
router.put(
  "/:id/reject",
  authMiddleware,
  isAdminInterasso,
  eventController.rejectEvent
);
```

---

## 📧 Système de notifications

### Service de notifications

```javascript
// services/notificationService.js
import Notification from "../models/Notification.js";
import emailService from "./emailService.js";

class NotificationService {
  // Nouvelle soumission d'événement
  async notifyEventSubmitted(event, adminInterassoId) {
    // Créer notification in-app
    const notification = await Notification.create({
      type: "EVENT_SUBMITTED",
      title: "Nouvel événement à valider",
      message: `${event.title} soumis par ${event.bdeId.name}`,
      recipientId: adminInterassoId,
      recipientRole: "admin_interasso",
      eventId: event._id,
      bdeId: event.bdeId,
      isRead: false,
    });

    // Envoyer email
    await emailService.sendEventSubmittedEmail(event, adminInterassoId);

    return notification;
  }

  // Événement validé
  async notifyEventValidated(event, adminBDEId) {
    const notification = await Notification.create({
      type: "EVENT_VALIDATED",
      title: "Événement validé ✅",
      message: `Votre événement "${event.title}" a été publié !`,
      recipientId: adminBDEId,
      recipientRole: "admin_bde",
      eventId: event._id,
      bdeId: event.bdeId,
      isRead: false,
    });

    await emailService.sendEventValidatedEmail(event, adminBDEId);

    return notification;
  }

  // Événement refusé
  async notifyEventRejected(event, adminBDEId, reason) {
    const notification = await Notification.create({
      type: "EVENT_REJECTED",
      title: "Événement refusé ❌",
      message: `Votre événement "${event.title}" a été refusé. Raison: ${reason}`,
      recipientId: adminBDEId,
      recipientRole: "admin_bde",
      eventId: event._id,
      bdeId: event.bdeId,
      isRead: false,
    });

    await emailService.sendEventRejectedEmail(event, adminBDEId, reason);

    return notification;
  }
}

export default new NotificationService();
```

### Controllers de validation

```javascript
// controllers/validationController.js
import Event from "../models/Event.js";
import notificationService from "../services/notificationService.js";

// Valider un événement
export const validateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "bdeId createdBy"
    );

    if (!event) {
      return res.status(404).json({ error: "Événement non trouvé" });
    }

    if (event.status !== "PENDING") {
      return res.status(400).json({
        error: "Seuls les événements en attente peuvent être validés",
      });
    }

    // Mettre à jour le statut
    event.status = "PUBLISHED";
    event.publishedAt = new Date();
    event.publishedBy = req.user.id;
    await event.save();

    // Envoyer notification au BDE
    await notificationService.notifyEventValidated(event, event.createdBy._id);

    res.json({
      message: "Événement validé et publié",
      event,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Refuser un événement
export const rejectEvent = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        error: "La raison du refus est requise",
      });
    }

    const event = await Event.findById(req.params.id).populate(
      "bdeId createdBy"
    );

    if (!event) {
      return res.status(404).json({ error: "Événement non trouvé" });
    }

    if (event.status !== "PENDING") {
      return res.status(400).json({
        error: "Seuls les événements en attente peuvent être refusés",
      });
    }

    // Mettre à jour le statut
    event.status = "REJECTED";
    event.rejectionReason = rejectionReason;
    event.rejectedAt = new Date();
    event.rejectedBy = req.user.id;
    await event.save();

    // Envoyer notification au BDE
    await notificationService.notifyEventRejected(
      event,
      event.createdBy._id,
      rejectionReason
    );

    res.json({
      message: "Événement refusé",
      event,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

---

## 🎨 Design et UI/UX

### Identité visuelle Interasso

#### Couleurs principales

```css
:root {
  /* Interasso - Neutre et moderne */
  --interasso-primary: #2563eb; /* Bleu principal */
  --interasso-secondary: #3b82f6;
  --interasso-dark: #1e293b;
  --interasso-light: #f8fafc;

  /* BDE MMI - Violet (Emmi Wave) */
  --mmi-primary: #8b3fbf;
  --mmi-secondary: #a855f7;

  /* BDE 2 - À définir */
  --bde2-primary: #10b981;
  --bde2-secondary: #34d399;

  /* BDE 3 - À définir */
  --bde3-primary: #f59e0b;
  --bde3-secondary: #fbbf24;

  /* BDE 4 - À définir */
  --bde4-primary: #ef4444;
  --bde4-secondary: #f87171;

  /* BDE 5 - À définir */
  --bde5-primary: #8b5cf6;
  --bde5-secondary: #a78bfa;

  /* Couleurs communes */
  --gray-100: #f3f4f6;
  --gray-800: #1f2937;
  --white: #ffffff;
}
```

### Pages spécifiques BDE

Chaque page BDE utilise dynamiquement les couleurs du BDE :

```jsx
// Example: BDEPage.jsx
const BDEPage = ({ bde }) => {
  return (
    <div
      className="bde-page"
      style={{
        "--bde-primary": bde.colors.primary,
        "--bde-secondary": bde.colors.secondary,
      }}
    >
      {/* Les composants utilisent var(--bde-primary) */}
    </div>
  );
};
```

---

## 🗓️ Roadmap

### Phase 1 : Setup & Core (Semaines 1-2)

#### Semaine 1

- [x] Initialiser repos Git
- [x] Configuration Tailwind + Magic UI
- [x] Setup backend Express + MongoDB
- [ ] Mettre à jour modèles de données (BDE, Event avec validation, Notification)
- [ ] Système d'authentification JWT avec rôles

#### Semaine 2

- [ ] Middleware de permissions (RBAC)
- [ ] API CRUD BDE
- [ ] API CRUD événements avec validation
- [ ] Système de notifications
- [ ] Upload d'images Cloudinary

### Phase 2 : Pages publiques (Semaines 3-4)

#### Semaine 3

- [ ] Page d'accueil Interasso
  - Hero section
  - Grille des 5 BDE
  - Événements à venir
  - Partenaires
- [ ] Page liste BDE
- [ ] Page individuelle BDE

#### Semaine 4

- [ ] Page événements (avec filtres)
- [ ] Page détails événement
- [ ] Page partenaires
- [ ] Page contact

### Phase 3 : Dashboards (Semaines 5-6)

#### Semaine 5

- [ ] Dashboard Admin Interasso
  - Vue d'ensemble
  - Validation événements
  - Gestion partenaires
  - Gestion BDE
  - Gestion utilisateurs

#### Semaine 6

- [ ] Dashboard Admin BDE
  - Vue d'ensemble
  - Gestion événements
  - Gestion membres bureau
  - Notifications
- [ ] Système de notifications en temps réel

### Phase 4 : Polish & Tests (Semaine 7)

- [ ] Animations GSAP
- [ ] Optimisation performances
- [ ] Tests responsive
- [ ] Accessibilité (a11y)
- [ ] Tests E2E

### Phase 5 : Deploy (Semaine 8)

- [ ] Configuration CI/CD
- [ ] Déploiement staging
- [ ] Tests utilisateurs
- [ ] Déploiement production
- [ ] Formation admin

---

## 📝 Notes importantes

### Données initiales à créer

#### Les 5 BDE

```javascript
// Seed database
const bdes = [
  {
    name: "BDE MMI",
    slug: "emmi-wave",
    fullName: "BDE MMI - Emmi Wave",
    description:
      "Le BDE des étudiants en Métiers du Multimédia et de l'Internet",
    colors: {
      primary: "#8B3FBF",
      secondary: "#A855F7",
    },
    isActive: true,
    displayOrder: 1,
  },
  // ... 4 autres BDE à définir
];
```

#### Compte Admin Interasso

```javascript
{
  username: 'admin_interasso',
  email: 'admin@interasso.fr',
  password: 'hashedPassword',
  role: 'admin_interasso',
  bdeId: null
}
```

#### 5 comptes Admin BDE

```javascript
{
  username: 'admin_bde_mmi',
  email: 'bde.mmi@interasso.fr',
  password: 'hashedPassword',
  role: 'admin_bde',
  bdeId: ObjectId('...') // Référence au BDE MMI
}
// ... x4 pour les autres BDE
```

---

**Dernière mise à jour** : Janvier 2025  
**Version** : 2.0.0 - Architecture Interasso  
**Statut** : 🚧 Documentation mise à jour
