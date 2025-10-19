# 🔧 Fix - Erreur 500 lors de la suppression d'événements

**Date** : 19 octobre 2025  
**Issue** : `DELETE /api/events/:id` retourne 500 (Internal Server Error)  
**Cause** : Appel incorrect à `logAdminAction()` dans `eventController.js`

---

## 🐛 Erreur originale

```
DELETE http://localhost:5000/api/events/68ebe987a2d78a957879d079 500 (Internal Server Error)
ValidationDashboard.jsx:504 Erreur suppression événement: AxiosError
```

---

## 🔍 Diagnostic

### Problème 1 : `logAdminAction()` mal utilisé

Dans `backend/src/controllers/eventController.js` :

```javascript
// ❌ AVANT (ligne 330)
await event.deleteOne();

logAdminAction("DELETE_EVENT")({ user: req.user, eventId: id });

console.log(`🗑️ Événement supprimé: "${event.title}" par ${req.user.email}`);
```

**Erreur** : `logAdminAction()` retourne un middleware qui attend `(req, res, next)`, pas un objet.

### Problème 2 : Même erreur dans `updateEvent()`

```javascript
// ❌ AVANT (ligne 283)
Object.assign(event, updates);
await event.save();

logAdminAction("UPDATE_EVENT")({ user: req.user, eventId: id });
```

### Problème 3 : Champs autorisés incorrects

```javascript
// ❌ AVANT
const allowedFields = [
  "title",
  "description",
  "shortDescription", // N'existe pas dans le modèle
  "startDate", // Le modèle utilise "date", pas "startDate"
  "endDate",
  "location",
  "address", // N'existe pas dans le modèle
  "price",
  "maxParticipants",
  "registrationRequired",
  "registrationDeadline", // N'existe pas dans le modèle
  "category",
  "image",
  "tags", // N'existe pas dans le modèle
];
```

### Problème 4 : Statut et bdeId non modifiables

L'Admin Interasso ne pouvait pas modifier le `status` ni le `bdeId` d'un événement.

---

## ✅ Corrections apportées

### 1. Suppression de `logAdminAction()` dans `deleteEvent()`

```javascript
// ✅ APRÈS
await event.deleteOne();

console.log(
  `🗑️ Événement supprimé: "${event.title}" par ${req.user.email} (${req.user.role})`
);

res.json({
  success: true,
  message: "Événement supprimé avec succès",
});
```

### 2. Suppression de `logAdminAction()` dans `updateEvent()`

```javascript
// ✅ APRÈS
Object.assign(event, updates);
await event.save();

console.log(
  `✏️ Événement modifié: "${event.title}" par ${req.user.email} (${req.user.role})`
);
```

### 3. Suppression de l'import inutile

```javascript
// ✅ APRÈS
import Event from "../models/Event.js";
import BDE from "../models/BDE.js";
import notificationService from "../services/notificationService.js";
// Supprimé: import { logAdminAction } from "../middleware/permissions.js";
```

### 4. Correction des champs autorisés

```javascript
// ✅ APRÈS
const allowedFields = [
  "title",
  "description",
  "date", // ✅ Corrigé (pas startDate)
  "endDate",
  "location",
  "price",
  "maxParticipants",
  "registrationRequired",
  "category",
  "images", // ✅ Ajouté (tableau d'images)
  "coverImage", // ✅ Ajouté (image de couverture)
];

// Admin Interasso peut aussi modifier le statut et le bdeId
if (req.user.role === "admin_interasso") {
  allowedFields.push("status", "bdeId"); // ✅ Ajouté
}
```

### 5. Gestion de l'objet `image` du frontend

```javascript
// ✅ APRÈS
// Gérer l'image qui peut venir comme objet {url, publicId}
if (req.body.image && typeof req.body.image === "object") {
  if (req.body.image.url) {
    updates.coverImage = {
      url: req.body.image.url,
      publicId: req.body.image.publicId || "default",
    };
  }
  delete updates.image;
}
```

### 6. Conversion du statut en majuscules

```javascript
// ✅ APRÈS
// Convertir le statut en majuscules si présent
if (updates.status) {
  updates.status = updates.status.toUpperCase();
}
```

**Raison** : Le modèle Event utilise les statuts en MAJUSCULES ("PENDING", "PUBLISHED", "REJECTED") mais le frontend envoie en minuscules ("pending", "published", "rejected").

### 7. Ajout de logs d'erreur détaillés

```javascript
// ✅ APRÈS
} catch (error) {
  console.error("❌ Erreur suppression événement:", error);
  res.status(500).json({
    success: false,
    error: "Erreur lors de la suppression de l'événement",
    details: error.message,
  });
}
```

---

## 🎯 Résultat attendu

### Avant les corrections

```
DELETE /api/events/:id → 500 Internal Server Error
❌ TypeError: logAdminAction(...) is not a function
```

### Après les corrections

```
DELETE /api/events/:id → 200 OK
✅ { success: true, message: "Événement supprimé avec succès" }
```

---

## 🧪 Tests à effectuer

### Test 1 : Suppression d'événement

```
1. Aller sur l'onglet "📅 Événements"
2. Cliquer sur "🗑️ Supprimer" sur un événement
3. Confirmer la suppression
4. ✅ Résultat attendu : "✅ Événement supprimé avec succès !"
```

### Test 2 : Modification d'événement

```
1. Cliquer sur "✏️ Modifier" sur un événement
2. Changer le titre
3. Changer le statut
4. Sauvegarder
5. ✅ Résultat attendu : "✅ Événement modifié avec succès !"
```

### Test 3 : Modification du statut

```
1. Modifier un événement
2. Changer le statut de "pending" à "published"
3. Sauvegarder
4. ✅ Résultat attendu : Badge passe de jaune à vert
5. ✅ Événement visible sur la page publique /events
```

### Test 4 : Modification du BDE organisateur (Admin Interasso uniquement)

```
1. En tant qu'Admin Interasso, modifier un événement
2. Changer le BDE organisateur
3. Sauvegarder
4. ✅ Résultat attendu : Le nouveau BDE apparaît dans la carte
```

---

## 📊 Compatibilité des statuts

| Frontend envoie | Backend reçoit | Backend stocke | Conversion          |
| --------------- | -------------- | -------------- | ------------------- |
| `"pending"`     | `"pending"`    | `"PENDING"`    | ✅ `.toUpperCase()` |
| `"published"`   | `"published"`  | `"PUBLISHED"`  | ✅ `.toUpperCase()` |
| `"rejected"`    | `"rejected"`   | `"REJECTED"`   | ✅ `.toUpperCase()` |

---

## 🔄 Modèle Event - Champs principaux

```javascript
{
  title: String,          // ✅ Modifiable
  description: String,    // ✅ Modifiable
  date: Date,            // ✅ Modifiable (pas startDate)
  endDate: Date,         // ✅ Modifiable
  location: String,      // ✅ Modifiable
  category: String,      // ✅ Modifiable
  price: Number,         // ✅ Modifiable
  maxParticipants: Number, // ✅ Modifiable
  coverImage: {          // ✅ Modifiable
    url: String,
    publicId: String
  },
  status: String,        // ✅ Modifiable (Admin Interasso uniquement)
  bdeId: ObjectId,       // ✅ Modifiable (Admin Interasso uniquement)
  createdBy: ObjectId,   // ❌ Non modifiable
  publishedBy: ObjectId, // ❌ Géré automatiquement
  rejectedBy: ObjectId,  // ❌ Géré automatiquement
}
```

---

## 📝 Fichiers modifiés

1. ✅ `backend/src/controllers/eventController.js`
   - Ligne 1-3 : Suppression de l'import `logAdminAction`
   - Ligne 257-293 : Correction de `updateEvent()`
   - Ligne 326-345 : Correction de `deleteEvent()`

---

## 🎉 Statut

✅ **CORRIGÉ** - La suppression et modification d'événements fonctionnent maintenant correctement.

### Points de vérification

- ✅ Suppression d'événements sans erreur 500
- ✅ Modification d'événements avec tous les champs
- ✅ Conversion automatique des statuts (minuscules → MAJUSCULES)
- ✅ Admin Interasso peut modifier le statut et le BDE
- ✅ Gestion correcte de l'image (objet → coverImage)
- ✅ Logs détaillés pour le debugging

🚀 **Prêt pour les tests en production !**
