# 🔐 Middleware de Permissions (RBAC)

Ce fichier contient tous les middlewares de contrôle d'accès basé sur les rôles.

## 📋 Middlewares disponibles

### 1. `isAdminInterasso`
Vérifie que l'utilisateur est **Admin Interasso** (super admin).

**Usage** :
```javascript
router.put('/bdes/:id', authMiddleware, isAdminInterasso, bdeController.updateBDE);
```

---

### 2. `isAdminBDE`
Vérifie que l'utilisateur est **Admin BDE** et qu'il a un BDE associé.

**Usage** :
```javascript
router.post('/events', authMiddleware, isAdminBDE, eventController.createEvent);
```

---

### 3. `isAdmin`
Vérifie que l'utilisateur est un Admin (Interasso **OU** BDE).

**Usage** :
```javascript
router.get('/dashboard', authMiddleware, isAdmin, dashboardController.getStats);
```

---

### 4. `canEditEvent`
Vérifie les permissions de modification d'un événement :
- ✅ **Admin Interasso** : peut modifier tous les événements
- ✅ **Admin BDE** : peut modifier uniquement **ses événements PENDING**

**Usage** :
```javascript
router.put('/events/:id', authMiddleware, canEditEvent, eventController.updateEvent);
```

**Vérifie** :
- Événement existe
- Admin BDE → même BDE + status PENDING
- Admin Interasso → tout autorisé

---

### 5. `canDeleteEvent`
Vérifie les permissions de suppression d'un événement :
- ✅ **Admin Interasso** : peut supprimer tous les événements
- ✅ **Admin BDE** : peut supprimer uniquement **ses événements** (tous status)

**Usage** :
```javascript
router.delete('/events/:id', authMiddleware, canDeleteEvent, eventController.deleteEvent);
```

---

### 6. `canEditMember`
Vérifie les permissions de modification d'un membre du bureau :
- ❌ **Admin Interasso** : ne peut PAS gérer les membres
- ✅ **Admin BDE** : peut modifier uniquement **les membres de son BDE**

**Usage** :
```javascript
router.put('/members/:id', authMiddleware, canEditMember, memberController.updateMember);
router.delete('/members/:id', authMiddleware, canEditMember, memberController.deleteMember);
```

---

### 7. `canEditBDE`
Vérifie les permissions de modification d'un BDE :
- ✅ **Admin Interasso** : peut modifier tous les BDE
- ❌ **Admin BDE** : ne peut PAS modifier les infos BDE

**Usage** :
```javascript
router.put('/bdes/:id', authMiddleware, canEditBDE, bdeController.updateBDE);
```

---

### 8. `belongsToBDE(bdeIdField)`
Middleware paramétrable pour vérifier qu'une ressource appartient au BDE de l'user.

**Paramètres** :
- `bdeIdField` : nom du champ contenant le BDE ID (défaut: 'bdeId')

**Usage** :
```javascript
// Créer un événement (force le bdeId à celui de l'admin BDE)
router.post('/events', authMiddleware, belongsToBDE('bdeId'), eventController.createEvent);

// Créer un membre (force le bdeId)
router.post('/members', authMiddleware, belongsToBDE('bdeId'), memberController.createMember);
```

**Comportement** :
- Admin Interasso → passe directement
- Admin BDE → force `req.body.bdeId = req.user.bdeId`

---

### 9. `logAdminAction(action)`
Logger les actions admin (audit).

**Usage** :
```javascript
router.put('/events/:id/validate', 
  authMiddleware, 
  isAdminInterasso,
  logAdminAction('VALIDATE_EVENT'),
  validationController.validateEvent
);
```

---

## 🔒 Matrice de permissions

| Action | Admin Interasso | Admin BDE | Public |
|--------|----------------|-----------|--------|
| **Événements** |
| Créer événement | ❌ | ✅ (→ PENDING) | ❌ |
| Modifier événement | ✅ (tous) | ✅ (siens, PENDING) | ❌ |
| Supprimer événement | ✅ (tous) | ✅ (siens, tous status) | ❌ |
| Valider événement | ✅ | ❌ | ❌ |
| Voir PUBLISHED | ✅ | ✅ | ✅ |
| Voir PENDING | ✅ (tous) | ✅ (siens) | ❌ |
| **Membres** |
| Ajouter membre | ❌ | ✅ (son bureau) | ❌ |
| Modifier membre | ❌ | ✅ (son bureau) | ❌ |
| Supprimer membre | ❌ | ✅ (son bureau) | ❌ |
| Voir membres | ✅ | ✅ | ✅ |
| **BDE** |
| Modifier infos BDE | ✅ | ❌ | ❌ |
| Voir infos BDE | ✅ | ✅ | ✅ |
| **Partenaires** |
| CRUD partenaires | ✅ | ❌ | ❌ |
| Voir partenaires | ✅ | ✅ | ✅ |

---

## 📝 Exemples d'utilisation

### Routes événements
```javascript
import { authMiddleware } from './middleware/auth.js';
import { 
  isAdminInterasso, 
  isAdminBDE, 
  canEditEvent, 
  canDeleteEvent,
  belongsToBDE 
} from './middleware/permissions.js';

// Public
router.get('/events', eventController.getPublishedEvents);
router.get('/events/:slug', eventController.getEventBySlug);

// Admin BDE
router.post('/events', 
  authMiddleware, 
  isAdminBDE, 
  belongsToBDE('bdeId'), 
  eventController.createEvent
);

router.put('/events/:id', 
  authMiddleware, 
  canEditEvent, 
  eventController.updateEvent
);

router.delete('/events/:id', 
  authMiddleware, 
  canDeleteEvent, 
  eventController.deleteEvent
);

// Admin Interasso
router.get('/events/pending', 
  authMiddleware, 
  isAdminInterasso, 
  eventController.getPendingEvents
);

router.put('/events/:id/validate', 
  authMiddleware, 
  isAdminInterasso, 
  validationController.validateEvent
);
```

---

## 🐛 Codes d'erreur

| Code | Message | Signification |
|------|---------|---------------|
| 401 | Authentification requise | Pas de token JWT ou invalide |
| 403 | Accès refusé: Admin Interasso requis | Rôle insuffisant |
| 403 | Vous ne pouvez modifier que les événements de votre BDE | BDE différent |
| 403 | Vous ne pouvez modifier que les événements en attente | Status != PENDING |
| 404 | Événement non trouvé | ID invalide |
| 500 | Erreur lors de la vérification des permissions | Erreur serveur |

---

## ✅ Tests recommandés

1. **Admin Interasso** :
   - ✅ Peut valider/refuser événements
   - ✅ Peut gérer partenaires
   - ✅ Peut modifier infos BDE
   - ❌ Ne peut pas créer d'événements directement

2. **Admin BDE** :
   - ✅ Peut créer événements (→ PENDING)
   - ✅ Peut modifier ses événements PENDING
   - ✅ Peut gérer membres de son bureau
   - ❌ Ne peut pas modifier événements d'autres BDE
   - ❌ Ne peut pas valider ses propres événements
   - ❌ Ne peut pas gérer partenaires

3. **Public** :
   - ✅ Voir événements PUBLISHED
   - ❌ Pas d'accès aux dashboards
   - ❌ Ne voit pas les événements PENDING

---

**Date de création** : Janvier 2025
