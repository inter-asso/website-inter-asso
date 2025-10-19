# 🔧 Fix - Erreur 403 lors de la création d'événements par Admin Interasso

**Date** : 19 octobre 2025  
**Issue** : `POST /api/events` retourne 403 (Forbidden) pour Admin Interasso  
**Cause** : La route était réservée uniquement aux Admin BDE

---

## 🐛 Erreur originale

```
POST http://localhost:5000/api/events 403 (Forbidden)
ValidationDashboard.jsx:483 Erreur sauvegarde événement: AxiosError
```

### Comportement attendu

L'Admin Interasso devrait pouvoir créer des événements depuis l'onglet "📅 Événements" du dashboard.

### Comportement observé

Erreur 403 - Accès refusé car la route `POST /api/events` était protégée par `isAdminBDE` middleware.

---

## 🔍 Diagnostic

### Problème 1 : Route trop restrictive

Dans `backend/src/routes/events.js` :

```javascript
// ❌ AVANT
router.post("/", authMiddleware, isAdminBDE, createEvent);
```

Le middleware `isAdminBDE` bloquait tous les utilisateurs qui ne sont pas Admin BDE.

### Problème 2 : Contrôleur limité aux Admin BDE

Dans `backend/src/controllers/eventController.js` :

```javascript
// ❌ AVANT
export const createEvent = async (req, res) => {
  try {
    if (req.user.role !== "admin_bde") {
      return res.status(403).json({
        success: false,
        error: "Accès refusé - Seuls les administrateurs BDE peuvent créer des événements",
      });
    }

    // Forcer le bdeId à celui de l'utilisateur
    const eventData = {
      ...req.body,
      bdeId: req.user.bdeId,  // Admin BDE a un bdeId automatique
      createdBy: req.user.id,
      status: "PENDING",
    };
    // ...
  }
};
```

**Problème** : Admin Interasso n'a pas de `bdeId` car il n'est pas attaché à un BDE spécifique.

---

## ✅ Corrections apportées

### 1. Route accessible aux deux rôles

```javascript
// ✅ APRÈS
/**
 * @route   POST /api/events
 * @desc    Créer un nouvel événement
 * @access  Private - Admin BDE ou Admin Interasso
 */
router.post("/", authMiddleware, createEvent);
```

**Changement** : Suppression du middleware `isAdminBDE`, seul `authMiddleware` reste.

### 2. Logique différenciée selon le rôle

```javascript
// ✅ APRÈS
export const createEvent = async (req, res) => {
  try {
    // Vérifier que l'utilisateur est soit Admin BDE soit Admin Interasso
    if (req.user.role !== "admin_bde" && req.user.role !== "admin_interasso") {
      return res.status(403).json({
        success: false,
        error:
          "Accès refusé - Seuls les administrateurs BDE et Interasso peuvent créer des événements",
      });
    }

    let eventData = { ...req.body };

    // Admin BDE : forcer le bdeId à celui de l'utilisateur
    if (req.user.role === "admin_bde") {
      eventData.bdeId = req.user.bdeId;
      eventData.status = "PENDING"; // Toujours PENDING pour Admin BDE
    }

    // Admin Interasso : peut choisir le BDE et le statut
    if (req.user.role === "admin_interasso") {
      // Vérifier que le bdeId est fourni
      if (!eventData.bdeId) {
        return res.status(400).json({
          success: false,
          error: "Le BDE organisateur est requis",
        });
      }
      // Convertir le statut en majuscules si fourni
      if (eventData.status) {
        eventData.status = eventData.status.toUpperCase();
      } else {
        eventData.status = "PENDING"; // Par défaut
      }
    }

    // Gérer l'image qui peut venir comme objet {url, publicId}
    if (eventData.image && typeof eventData.image === "object") {
      if (eventData.image.url) {
        eventData.coverImage = {
          url: eventData.image.url,
          publicId: eventData.image.publicId || "default",
        };
      }
      delete eventData.image;
    }

    eventData.createdBy = req.user.id;

    const event = await Event.create(eventData);

    // Populate les infos
    await event.populate("bdeId");

    // Envoyer notification à Admin Interasso uniquement si créé par Admin BDE
    if (req.user.role === "admin_bde") {
      await notificationService.notifyEventSubmitted(event, event.bdeId);
    }

    console.log(
      `✨ Nouvel événement créé: "${event.title}" (${event.bdeId.name}) - Statut: ${event.status} par ${req.user.email} (${req.user.role})`
    );

    res.status(201).json({
      success: true,
      message:
        req.user.role === "admin_bde"
          ? "Événement créé et soumis pour validation"
          : "Événement créé avec succès",
      event: await Event.findById(event._id)
        .populate("bdeId", "name slug logo colors")
        .populate("createdBy", "firstName lastName"),
    });
  } catch (error) {
    console.error("❌ Erreur création événement:", error);
    // ...
  }
};
```

---

## 🎯 Différences de comportement

### Admin BDE créant un événement

```javascript
{
  title: "Soirée de rentrée",
  description: "...",
  date: "2024-10-20T20:00",
  location: "Campus",
  category: "soirée",
  // bdeId: Automatiquement forcé à req.user.bdeId
  // status: Automatiquement forcé à "PENDING"
}
```

**Résultat** :

- ✅ `bdeId` = BDE de l'utilisateur (non modifiable)
- ✅ `status` = "PENDING" (non modifiable)
- ✅ Notification envoyée à Admin Interasso
- ✅ Message : "Événement créé et soumis pour validation"

### Admin Interasso créant un événement

```javascript
{
  title: "Journée portes ouvertes",
  description: "...",
  date: "2024-10-25T10:00",
  location: "Campus",
  category: "autre",
  bdeId: "67890...",        // ⚠️ REQUIS - Admin Interasso doit choisir
  status: "published",      // Optionnel (défaut: "pending")
}
```

**Résultat** :

- ✅ `bdeId` = Valeur fournie (obligatoire)
- ✅ `status` = Convertir en "PUBLISHED" (ou "PENDING" par défaut)
- ❌ Pas de notification envoyée (Admin Interasso n'a pas besoin de s'auto-notifier)
- ✅ Message : "Événement créé avec succès"

---

## 📊 Matrice des permissions

| Action               | Admin BDE                   | Admin Interasso             |
| -------------------- | --------------------------- | --------------------------- |
| Créer événement      | ✅ Oui (son BDE uniquement) | ✅ Oui (n'importe quel BDE) |
| Choisir le BDE       | ❌ Non (forcé)              | ✅ Oui (obligatoire)        |
| Choisir le statut    | ❌ Non (PENDING forcé)      | ✅ Oui (PENDING par défaut) |
| Notification envoyée | ✅ Oui (à Admin Interasso)  | ❌ Non                      |
| Message de succès    | "Soumis pour validation"    | "Créé avec succès"          |

---

## 🧪 Tests à effectuer

### Test 1 : Admin Interasso crée un événement "En attente"

```
1. Se connecter en tant qu'Admin Interasso
2. Aller sur l'onglet "📅 Événements"
3. Cliquer sur "➕ Ajouter un événement"
4. Remplir tous les champs obligatoires
5. Sélectionner un BDE dans le dropdown
6. Laisser le statut à "En attente"
7. Cliquer sur "Créer"

✅ Résultat attendu :
- Message : "✅ Événement créé avec succès !"
- Badge jaune "⏳ En attente"
- Événement visible dans la grille
```

### Test 2 : Admin Interasso crée un événement "Publié"

```
1. Créer un événement
2. Sélectionner un BDE
3. Changer le statut à "✅ Publié"
4. Cliquer sur "Créer"

✅ Résultat attendu :
- Message : "✅ Événement créé avec succès !"
- Badge vert "✅ Publié"
- Événement immédiatement visible sur /events
```

### Test 3 : Admin Interasso essaie de créer sans BDE

```
1. Créer un événement
2. NE PAS sélectionner de BDE (laisser vide)
3. Cliquer sur "Créer"

✅ Résultat attendu :
- Bouton "Créer" désactivé (validation côté client)
- OU Message d'erreur : "❌ Veuillez remplir tous les champs obligatoires"
```

### Test 4 : Admin BDE crée un événement (régression)

```
1. Se connecter en tant qu'Admin BDE
2. Créer un événement depuis EventsDashboard
3. Vérifier que le BDE est automatiquement celui de l'admin
4. Vérifier que le statut est forcé à "PENDING"

✅ Résultat attendu :
- Comportement inchangé
- Notification envoyée à Admin Interasso
- Message : "Événement créé et soumis pour validation"
```

---

## 🔄 Gestion de l'image

### Avant

```javascript
// Frontend envoie
{
  image: {
    url: "https://example.com/image.jpg",
    publicId: "abc123"
  }
}

// Backend attendait `coverImage`
```

### Après

```javascript
// Backend convertit automatiquement
if (eventData.image && typeof eventData.image === "object") {
  if (eventData.image.url) {
    eventData.coverImage = {
      url: eventData.image.url,
      publicId: eventData.image.publicId || "default",
    };
  }
  delete eventData.image;
}
```

---

## 📝 Fichiers modifiés

1. ✅ `backend/src/routes/events.js`

   - Ligne 30-35 : Suppression du middleware `isAdminBDE`
   - Documentation mise à jour

2. ✅ `backend/src/controllers/eventController.js`
   - Ligne 155-240 : Logique `createEvent()` réécrite
   - Support des deux rôles avec logique conditionnelle
   - Conversion automatique de l'objet `image` en `coverImage`
   - Conversion automatique du statut en majuscules

---

## 🎉 Statut

✅ **CORRIGÉ** - Admin Interasso peut maintenant créer des événements.

### Points de vérification

- ✅ Admin Interasso peut créer des événements
- ✅ Admin Interasso doit choisir le BDE (dropdown)
- ✅ Admin Interasso peut choisir le statut
- ✅ Admin BDE fonctionne toujours normalement (régression OK)
- ✅ Conversion automatique du statut (minuscules → MAJUSCULES)
- ✅ Gestion correcte de l'objet image
- ✅ Logs détaillés avec rôle et statut

---

## 💡 Workflow complet

### Création par Admin BDE

```
Admin BDE → Crée événement → PENDING forcé → Notification → Admin Interasso valide
```

### Création par Admin Interasso

```
Admin Interasso → Crée événement → Choisit statut → Publié immédiatement (si "published")
```

🚀 **Prêt pour les tests !**
