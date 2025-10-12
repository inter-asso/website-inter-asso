# 📝 Modèles de données - Interasso

## ✅ Modèles mis à jour

### 1. User.js (Administrateurs)
**Changements** :
- ✅ `role` : `admin_interasso` | `admin_bde` (au lieu de admin/moderator)
- ✅ `bdeId` : Référence au BDE (null si admin_interasso)

**Utilisation** :
- 1 compte Admin Interasso (gère toute la plateforme)
- 5 comptes Admin BDE (1 par BDE)

---

### 2. BDE.js (Les 5 BDE) - NOUVEAU ✨
**Champs principaux** :
- `name` : Nom court (ex: "BDE MMI")
- `slug` : URL-friendly (ex: "emmi-wave")
- `fullName` : Nom complet (ex: "BDE MMI - Emmi Wave")
- `description` : Présentation du BDE
- `logo` : { url, publicId }
- `colors` : { primary, secondary } (hex)
- `socialLinks` : { instagram, facebook, twitter, email }
- `contactEmail` : Email de contact
- `isActive` : Actif/Inactif
- `displayOrder` : Ordre d'affichage

**Virtuals** :
- `eventsCount` : Nombre d'événements du BDE
- `membersCount` : Nombre de membres du bureau

---

### 3. Event.js (Événements avec validation)
**Changements majeurs** :
- ✅ `status` : `PENDING` | `PUBLISHED` | `REJECTED` (au lieu de upcoming/past/cancelled)
- ✅ `bdeId` : Référence au BDE organisateur (REQUIS)
- ✅ `publishedAt` : Date de publication (si PUBLISHED)
- ✅ `publishedBy` : User qui a validé (Admin Interasso)
- ✅ `rejectionReason` : Raison du refus (si REJECTED)
- ✅ `rejectedAt` : Date du refus
- ✅ `rejectedBy` : User qui a refusé

**Workflow** :
1. Admin BDE crée événement → status = `PENDING`
2. Admin Interasso valide → status = `PUBLISHED`
3. Admin Interasso refuse → status = `REJECTED` + rejectionReason

**Indexes** :
- `status`, `bdeId`, `date`, `slug`, `category`, `createdBy`

---

### 4. Member.js (Membres des bureaux)
**Changements** :
- ✅ `bdeId` : Référence au BDE (REQUIS)

**Utilisation** :
- Chaque membre est lié à UN BDE
- Permet d'afficher les bureaux par BDE

**Indexes** :
- `bdeId`, `displayOrder`, `isActive`

---

### 5. Partner.js (Partenaires communs)
**Aucun changement** - Les partenaires restent communs à tous les BDE

---

### 6. Notification.js - NOUVEAU ✨
**Champs principaux** :
- `type` : `EVENT_SUBMITTED` | `EVENT_VALIDATED` | `EVENT_REJECTED`
- `title` : Titre de la notification
- `message` : Message descriptif
- `recipientId` : User destinataire (ref User)
- `recipientRole` : `admin_interasso` | `admin_bde`
- `eventId` : Événement concerné (ref Event)
- `bdeId` : BDE concerné (ref BDE)
- `isRead` : Statut de lecture
- `readAt` : Date de lecture

**Methods** :
- `markAsRead()` : Marquer comme lu
- `getUnreadCount(userId)` : Nombre de notifications non lues
- `getUserNotifications(userId, limit)` : Notifications d'un user
- `markAllAsRead(userId)` : Tout marquer comme lu

**Scénarios** :
1. Admin BDE crée événement → Notification `EVENT_SUBMITTED` pour Admin Interasso
2. Admin Interasso valide → Notification `EVENT_VALIDATED` pour Admin BDE
3. Admin Interasso refuse → Notification `EVENT_REJECTED` pour Admin BDE

---

## 🗑️ Modèles supprimés

### Adhesion.js
- Supprimé car la gestion des adhésions n'est plus nécessaire pour l'instant
- Peut être réintégré plus tard si besoin

---

## 📊 Relations entre modèles

```
User (Admin Interasso/BDE)
  └─ bdeId → BDE (si admin_bde)

BDE (5 BDE)
  ├─ members → Member[] (membres du bureau)
  └─ events → Event[] (événements du BDE)

Event
  ├─ bdeId → BDE (BDE organisateur)
  ├─ createdBy → User (Admin BDE qui a créé)
  ├─ publishedBy → User (Admin Interasso qui a validé)
  └─ rejectedBy → User (Admin Interasso qui a refusé)

Member
  └─ bdeId → BDE (BDE auquel appartient le membre)

Notification
  ├─ recipientId → User (destinataire)
  ├─ eventId → Event (événement concerné)
  └─ bdeId → BDE (BDE concerné)
```

---

## 🔄 Prochaines étapes

1. ✅ Modèles de données mis à jour
2. ⏳ Créer middleware de permissions (RBAC)
3. ⏳ Créer système de notifications (service + controller)
4. ⏳ Mettre à jour controllers et routes
5. ⏳ Configurer MongoDB Atlas et Cloudinary
6. ⏳ Créer données initiales (seed)

---

**Date de mise à jour** : Janvier 2025
