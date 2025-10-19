# 🧪 Guide de test - Gestion des événements dans le Dashboard Admin

## ✅ Fonctionnalités ajoutées

Dans le **Dashboard Admin (Admin Interasso)**, un nouvel onglet **"📅 Événements"** a été ajouté pour gérer tous les événements de la plateforme.

### 🎯 Objectif

Permettre à l'Admin Interasso de :

- ✅ Créer des événements
- ✏️ Modifier n'importe quel événement
- � **Changer le statut des événements** (En attente → Publié → Rejeté)
- �🗑️ Supprimer des événements
- 👀 Voir tous les événements (published, pending, rejected)

---

## 🚀 Comment tester

### 1. **Accéder au Dashboard Admin**

1. Connectez-vous en tant qu'**Admin Interasso** :

   - Email : `admin@interasso.fr`
   - Mot de passe : (votre mot de passe admin)

2. Vous êtes redirigé vers `/admin/validation`

3. Cliquez sur l'onglet **"📅 Événements"** dans la barre de navigation

---

### 2. **Créer un nouvel événement**

1. Cliquez sur le bouton **"➕ Ajouter un événement"**

2. Un modal s'ouvre avec le formulaire :

   **Champs obligatoires** (marqués \*) :

   - **Titre de l'événement** : ex. "Soirée de rentrée 2024"
   - **Description** : max 1000 caractères
   - **Date et heure** : sélecteur de date/heure
   - **Lieu** : ex. "Campus universitaire"
   - **Catégorie** : dropdown (soirée, sport, culturel, etc.)
   - **BDE organisateur** : dropdown (liste des BDE)
   - **Statut** : dropdown (⏳ En attente, ✅ Publié, ❌ Rejeté)

   **Champs optionnels** :

   - **Prix (€)** : 0 = gratuit
   - **Nombre max de participants** : 0 = illimité
   - **Date limite d'inscription** : sélecteur date/heure
   - **URL de l'image** : lien vers l'image de couverture

3. Remplissez tous les champs obligatoires

4. Cliquez sur **"Créer"**

5. **Résultat attendu** :
   - ✅ Message de succès : "✅ Événement créé avec succès !"
   - Le modal se ferme
   - La liste des événements se recharge
   - Le nouvel événement apparaît dans la grille

---

### 3. **Modifier un événement existant**

1. Dans la grille des événements, repérez un événement

2. Chaque carte affiche :

   - 🖼️ Image (si disponible)
   - 🏷️ Badge de statut (Publié/En attente/Rejeté)
   - 🏷️ Badge de catégorie
   - 📝 Titre
   - 📄 Description (2 lignes max)
   - 🎓 BDE organisateur
   - 📅 Date et heure
   - 📍 Lieu
   - 💰 Prix (si > 0)

3. Cliquez sur le bouton **"✏️ Modifier"**

4. Le modal s'ouvre avec les données pré-remplies

5. Modifiez les champs souhaités (y compris le **statut**)

6. Cliquez sur **"Modifier"**

7. **Résultat attendu** :
   - ✅ Message : "✅ Événement modifié avec succès !"
   - La carte de l'événement est mise à jour dans la grille
   - Le badge de statut reflète le nouveau statut

---

### 3.1 **Changer le statut d'un événement**

💡 **Cas d'usage principal** : Publier ou rejeter rapidement un événement

1. Cliquez sur **"✏️ Modifier"** sur un événement

2. Dans le dropdown **"Statut"**, sélectionnez :

   - **⏳ En attente** : L'événement n'est pas encore validé
   - **✅ Publié** : L'événement est visible publiquement
   - **❌ Rejeté** : L'événement est refusé

3. Cliquez sur **"Modifier"**

4. **Résultat attendu** :
   - Le badge de statut change de couleur immédiatement
   - Si "Publié" → l'événement apparaît sur la page publique `/events`
   - Si "Rejeté" → l'événement n'est plus visible publiquement

---

### 4. **Supprimer un événement**

1. Repérez un événement dans la grille

2. Cliquez sur le bouton **"🗑️ Supprimer"**

3. Une boîte de confirmation apparaît :

   > "Êtes-vous sûr de vouloir supprimer "[Titre de l'événement]" ?"

4. Cliquez sur **OK** pour confirmer

5. **Résultat attendu** :
   - ✅ Message : "✅ Événement supprimé avec succès !"
   - L'événement disparaît de la grille
   - Le compteur est mis à jour

---

## 🔍 Points de vérification

### ✅ Validation côté client

- Le bouton "Créer" est **désactivé** tant que les champs obligatoires ne sont pas remplis
- Compteur de caractères pour la description (1000 max)
- Extraction automatique du `publicId` depuis l'URL de l'image
- Le statut par défaut est "En attente" pour les nouveaux événements

### ✅ États de chargement

- Bouton "Sauvegarde..." pendant l'enregistrement
- Spinner de chargement pendant le chargement des données
- Boutons désactivés pendant les actions

### ✅ Gestion des erreurs

- Messages d'erreur détaillés en cas de problème
- Affichage via `alert()` (pourra être remplacé par Toast plus tard)

### ✅ Responsive

- Grille adaptative :
  - Mobile : 1 colonne
  - Tablette : 2 colonnes
  - Desktop : 3 colonnes
- Modal scrollable pour petits écrans

---

## 🎨 Interface utilisateur

### Onglets du Dashboard

```
┌─────────────────────────────────────────────────────────┐
│  En attente | Tous | Statistiques | Partenaires | BDE | 📅 Événements  │
└─────────────────────────────────────────────────────────┘
```

### Grille des événements

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  [Image]    │  │  [Image]    │  │  [Image]    │
│ ✅ Publié   │  │ ⏳ En attente│  │ ❌ Rejeté   │
│             │  │             │  │             │
│ Titre       │  │ Titre       │  │ Titre       │
│ Description │  │ Description │  │ Description │
│ 🎓 BDE MMI  │  │ 🎓 BDE Info │  │ 🎓 BDE Art  │
│ 📅 15/01/24 │  │ 📅 20/01/24 │  │ 📅 25/01/24 │
│ 📍 Campus   │  │ 📍 Gymnase  │  │ 📍 Amphi A  │
│             │  │             │  │             │
│ ✏️ Modifier │  │ ✏️ Modifier │  │ ✏️ Modifier │
│ 🗑️ Supprimer│  │ 🗑️ Supprimer│  │ 🗑️ Supprimer│
└─────────────┘  └─────────────┘  └─────────────┘
```

---

## 🐛 Erreurs possibles et solutions

### ❌ Erreur 400 : "Veuillez remplir tous les champs obligatoires"

**Solution** : Vérifiez que tous les champs marqués \* sont remplis

### ❌ Erreur 404 : "BDE not found"

**Solution** : Sélectionnez un BDE valide dans le dropdown

### ❌ Liste des BDE vide dans le dropdown

**Solution** :

1. Allez dans l'onglet "🎓 BDE"
2. Créez au moins un BDE
3. Retournez dans l'onglet "📅 Événements"

### ❌ Image ne s'affiche pas

**Solution** : Vérifiez que l'URL de l'image est valide et accessible

---

## 📋 Checklist de test complète

- [ ] Se connecter en tant qu'Admin Interasso
- [ ] Accéder à l'onglet "📅 Événements"
- [ ] Voir la liste de tous les événements (avec statuts différents)
- [ ] Cliquer sur "➕ Ajouter un événement"
- [ ] Remplir le formulaire avec tous les champs obligatoires
- [ ] Vérifier que le statut par défaut est "En attente"
- [ ] Créer l'événement → succès
- [ ] Vérifier que l'événement apparaît dans la grille avec badge "⏳ En attente"
- [ ] Cliquer sur "✏️ Modifier" sur un événement
- [ ] Changer le titre et la description
- [ ] **Changer le statut de "En attente" à "Publié"**
- [ ] Sauvegarder → succès
- [ ] Vérifier que les modifications sont visibles
- [ ] Vérifier que le badge est maintenant "✅ Publié"
- [ ] Aller sur la page publique `/events` → l'événement doit être visible
- [ ] Retourner au dashboard, modifier à nouveau l'événement
- [ ] **Changer le statut à "Rejeté"**
- [ ] Vérifier que le badge est maintenant "❌ Rejeté"
- [ ] Cliquer sur "🗑️ Supprimer" sur un événement
- [ ] Confirmer la suppression → succès
- [ ] Vérifier que l'événement disparaît
- [ ] Tester la validation : essayer de créer sans titre → bouton désactivé
- [ ] Tester avec une image valide → affichage correct
- [ ] Tester les 3 statuts (pending, published, rejected)
- [ ] Tester le dropdown des BDE (liste correcte)
- [ ] Vérifier le responsive (mobile, tablette, desktop)

---

## 🎯 Prochaines améliorations possibles

1. **Remplacer `alert()` par Toast notifications** (UX améliorée)
2. **Ajouter des filtres** (par BDE, par catégorie, par statut)
3. **Ajouter la recherche** (par titre)
4. **Ajouter l'upload d'images** (Cloudinary)
5. **Ajouter la pagination** (si > 50 événements)
6. **Ajouter un aperçu de l'image** dans le formulaire
7. **Ajouter la validation de date** (empêcher dates passées)
8. **Ajouter la duplication d'événement** (copier un événement existant)

---

## ✨ Notes importantes

- **L'Admin Interasso peut gérer TOUS les événements** (tous statuts, tous BDE)
- **Le BDE organisateur est obligatoire** pour créer un événement
- **Les événements créés ont le statut "pending" par défaut**
- **Le statut peut être modifié directement dans ce formulaire** :
  - ⏳ **En attente** : Événement en cours de validation
  - ✅ **Publié** : Événement visible publiquement sur `/events`
  - ❌ **Rejeté** : Événement refusé (non visible publiquement)
- **Alternative** : Utiliser l'onglet "En attente" pour valider/rejeter avec une raison
- **La suppression est définitive** (pas de corbeille)

---

## 🎉 Fonctionnalité complète !

L'onglet "📅 Événements" est maintenant **100% fonctionnel** avec :

- ✅ Création d'événements
- ✅ Modification d'événements
- ✅ **Changement de statut direct** (En attente/Publié/Rejeté)
- ✅ Suppression d'événements
- ✅ Affichage avec badges de statut colorés
- ✅ Interface responsive
- ✅ Validation côté client
- ✅ Gestion d'erreurs complète

🚀 **Prêt pour les tests !**

---

## 💡 Avantages du changement de statut

### 🔄 Workflow flexible

**Avant** : Deux étapes séparées

1. Créer l'événement (statut "pending")
2. Aller dans "En attente" → Valider

**Maintenant** : Tout en un seul endroit

1. Créer/Modifier l'événement
2. Choisir directement le statut
3. Sauvegarder → Terminé !

### ⚡ Cas d'usage

- **Publier immédiatement** : Créer un événement déjà "Publié"
- **Correction rapide** : Repasser un événement publié en "En attente"
- **Archivage** : Marquer d'anciens événements comme "Rejeté"
- **Gestion centralisée** : Tout gérer depuis un seul onglet
