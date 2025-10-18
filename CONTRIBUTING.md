# 🤝 Guide de Contribution - BDE Emmi Wave

Merci de contribuer au site du BDE Emmi Wave ! Ce guide vous aidera à ajouter ou modifier du contenu facilement.

## 📋 Table des matières

- [Ajouter un événement](#ajouter-un-événement)
- [Ajouter un partenaire](#ajouter-un-partenaire)
- [Modifier les membres du bureau](#modifier-les-membres-du-bureau)
- [Contribuer au code](#contribuer-au-code)
- [Code de conduite](#code-de-conduite)

---

## 🎉 Ajouter un événement

### Via l'interface Admin

1. Connectez-vous à l'interface admin : `https://bde-emmi-wave.fr/admin`
2. Allez dans la section **"Événements"**
3. Cliquez sur **"Ajouter un événement"**
4. Remplissez le formulaire :
   - **Titre** : Nom de l'événement (ex: "Soirée Halloween 2025")
   - **Date et heure** : Sélectionnez la date
   - **Lieu** : Adresse ou nom du lieu
   - **Description** : Décrivez l'événement (markdown supporté)
   - **Catégorie** : Soirée / Sport / Culture / Autre
   - **Photos** : Drag & drop vos images (max 5MB chacune)
   - **Prix** : Prix d'entrée (0 si gratuit)
   - **Nombre max de participants** : Optionnel
5. Cliquez sur **"Publier"**

### Bonnes pratiques

- ✅ Utilisez des images de qualité (min 1200x800px)
- ✅ Format recommandé : JPG ou PNG
- ✅ Ajoutez l'événement au moins 1 semaine à l'avance
- ✅ Vérifiez l'orthographe avant de publier

---

## 🤝 Ajouter un partenaire

### Via l'interface Admin

1. Connectez-vous à l'interface admin
2. Allez dans la section **"Partenaires"**
3. Cliquez sur **"Ajouter un partenaire"**
4. Remplissez le formulaire :
   - **Nom** : Nom du commerce/partenaire
   - **Catégorie** : Restauration / Culture / Sport / Commerce / Autre
   - **Logo** : Format PNG transparent recommandé
   - **Site web** : URL complète (https://...)
   - **Description** : Présentation du partenaire
   - **Avantages** : Réductions ou avantages pour les adhérents
   - **Contact** : Email et téléphone (optionnel)
5. Cliquez sur **"Ajouter"**

### Format du logo

- ✅ Format : PNG transparent
- ✅ Dimensions : 500x500px minimum
- ✅ Taille : Max 2MB
- ✅ Fond transparent pour meilleur rendu

---

## 👥 Modifier les membres du bureau

### Via l'interface Admin

1. Connectez-vous à l'interface admin
2. Allez dans la section **"Membres du bureau"**
3. Pour **modifier** : Cliquez sur l'icône ✏️ du membre
4. Pour **ajouter** : Cliquez sur **"Ajouter un membre"**
5. Remplissez :
   - **Photo** : Portrait professionnel (format carré recommandé)
   - **Prénom & Nom**
   - **Rôle** : Président, Trésorier, etc.
   - **Promotion** : Année et formation
   - **Bio** : Courte description (optionnel)
   - **Réseaux sociaux** : LinkedIn, Instagram (optionnel)
6. Cliquez sur **"Sauvegarder"**

---

## 💻 Contribuer au code

### Prérequis

- Node.js 18.x ou supérieur
- Git
- Compte GitHub

### Workflow

1. **Fork** le repository
2. **Clone** votre fork :

   ```bash
   git clone https://github.com/votre-username/bde-emmi-wave.git
   cd bde-emmi-wave
   ```

3. **Créez une branche** :

   ```bash
   git checkout -b feature/ma-fonctionnalite
   ```

4. **Installez les dépendances** :

   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

5. **Faites vos modifications**

6. **Testez** :

   ```bash
   npm run lint
   npm test
   ```

7. **Commit** avec un message clair :

   ```bash
   git add .
   git commit -m "feat: ajout du système de notification"
   ```

8. **Push** :

   ```bash
   git push origin feature/ma-fonctionnalite
   ```

9. **Créez une Pull Request** sur GitHub

### Convention de commits

Utilisez les préfixes suivants :

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage (ne change pas le code)
- `refactor:` Refactoring
- `test:` Ajout de tests
- `chore:` Maintenance

**Exemples :**

```bash
feat: ajout du système de notification par email
fix: correction bug upload image sur mobile
docs: mise à jour README installation
style: formatage des fichiers avec Prettier
```

---

## 📝 Code de conduite

### Bonnes pratiques

1. **Code propre et lisible**

   - Commentez les parties complexes
   - Utilisez des noms de variables explicites
   - Respectez l'indentation

2. **Avant de commit**

   - Testez localement
   - Vérifiez qu'il n'y a pas d'erreurs ESLint
   - Formatez avec Prettier

3. **Sécurité**

   - ❌ Ne **JAMAIS** commit de secrets (API keys, passwords)
   - ✅ Utilisez les fichiers `.env`
   - ✅ Ajoutez `.env` au `.gitignore`

4. **Respect de la structure**
   - Suivez l'arborescence du projet
   - Placez les fichiers aux bons endroits
   - Utilisez les composants existants

### Communication

- Soyez respectueux et constructif
- Expliquez clairement vos Pull Requests
- Répondez aux commentaires de review
- Demandez de l'aide si besoin !

---

## 🆘 Besoin d'aide ?

### Problèmes courants

**Erreur d'installation npm**

```bash
# Supprimez node_modules et réinstallez
rm -rf node_modules package-lock.json
npm install
```

**Erreur de connexion MongoDB**

- Vérifiez votre `.env`
- Vérifiez votre IP dans MongoDB Atlas whitelist

**Erreur Cloudinary**

- Vérifiez vos credentials dans `.env`
- Vérifiez que le cloud_name est correct

### Contact

- **Issues GitHub** : Pour les bugs et suggestions
- **Email** : ethan.collin2304@gmail.com
- **Discord** : [Lien du serveur Discord du BDE]

---

## 🎉 Merci de contribuer !

Chaque contribution, petite ou grande, aide à améliorer l'expérience de tous les étudiants. Merci de faire partie de l'aventure Emmi Wave ! 🌊

---

**Dernière mise à jour** : Octobre 2025
