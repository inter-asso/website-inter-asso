# Guide des Composants Magic UI installés

Tous les composants Magic UI ont été installés avec succès dans votre projet ! 🎉

## 📦 Composants installés

1. **Bento Grid** - Grilles modernes avec animations
2. **Animated List** - Listes animées qui apparaissent progressivement
3. **Avatar Circles** - Avatars empilés en cercle
4. **Pointer** - Curseur personnalisé animé
5. **Border Beam** - Bordures animées avec effet de faisceau lumineux
6. **Marquee** - Défilement infini (déjà utilisé)

---

## 🎨 1. Bento Grid

**Fichier** : `src/components/ui/bento-grid.jsx`

**Description** : Grille moderne style "bento box" avec des cartes qui s'animent au survol.

### Import

```jsx
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
```

### Utilisation

```jsx
<BentoGrid className="max-w-6xl mx-auto">
  <BentoCard
    name="Événements"
    className="col-span-1"
    background={
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500" />
    }
    Icon={() => <span className="text-4xl">🎉</span>}
    description="Découvre tous les événements à venir"
    href="/events"
    cta="Voir les événements"
  />

  <BentoCard
    name="BDE"
    className="col-span-2"
    background={
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500" />
    }
    Icon={() => <span className="text-4xl">🎓</span>}
    description="Rencontre les équipes des BDE"
    href="/bdes"
    cta="Découvrir les BDE"
  />
</BentoGrid>
```

### Props BentoGrid

- `className` : Classes CSS personnalisées
- `children` : Les BentoCard

### Props BentoCard

- `name` : Titre de la carte
- `description` : Description
- `Icon` : Composant d'icône
- `background` : Contenu de fond (peut être une image, gradient, etc.)
- `href` : Lien vers la destination
- `cta` : Texte du bouton call-to-action
- `className` : Classes CSS (utilisez `col-span-1`, `col-span-2`, `col-span-3` pour la taille)

---

## 📝 2. Animated List

**Fichier** : `src/components/ui/animated-list.jsx`

**Description** : Liste qui s'anime progressivement, parfait pour afficher des notifications ou des événements en temps réel.

### Import

```jsx
import { AnimatedList, AnimatedListItem } from "@/components/ui/animated-list";
```

### Utilisation

```jsx
<AnimatedList delay={1000} className="max-w-lg">
  <div className="bg-white p-4 rounded-lg shadow-lg">
    <div className="font-bold">🎉 Nouvelle soirée</div>
    <div className="text-sm text-gray-600">Il y a 2 minutes</div>
  </div>

  <div className="bg-white p-4 rounded-lg shadow-lg">
    <div className="font-bold">🎓 Nouveau BDE</div>
    <div className="text-sm text-gray-600">Il y a 5 minutes</div>
  </div>

  <div className="bg-white p-4 rounded-lg shadow-lg">
    <div className="font-bold">🤝 Nouveau partenaire</div>
    <div className="text-sm text-gray-600">Il y a 10 minutes</div>
  </div>
</AnimatedList>
```

### Props

- `delay` : Délai entre chaque apparition en ms (défaut: 1000)
- `className` : Classes CSS personnalisées
- `children` : Les éléments à animer

### Exemple d'utilisation avec des événements

```jsx
<AnimatedList delay={800}>
  {upcomingEvents.map((event) => (
    <div key={event._id} className="bg-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{event.emoji}</span>
        <div>
          <div className="font-bold">{event.title}</div>
          <div className="text-sm text-gray-600">{formatDate(event.date)}</div>
        </div>
      </div>
    </div>
  ))}
</AnimatedList>
```

---

## 👥 3. Avatar Circles

**Fichier** : `src/components/ui/avatar-circles.jsx`

**Description** : Affiche des avatars empilés en cercle, parfait pour montrer les participants d'un événement.

### Import

```jsx
import { AvatarCircles } from "@/components/ui/avatar-circles";
```

### Utilisation

```jsx
<AvatarCircles
  numPeople={99}
  avatarUrls={[
    {
      imageUrl: "https://avatars.githubusercontent.com/u/16860528",
      profileUrl: "https://github.com/dillionverma",
    },
    {
      imageUrl: "https://avatars.githubusercontent.com/u/20110627",
      profileUrl: "https://github.com/tomonarifeehan",
    },
    {
      imageUrl: "https://avatars.githubusercontent.com/u/106103625",
      profileUrl: "https://github.com/BankkRoll",
    },
    {
      imageUrl: "https://avatars.githubusercontent.com/u/59228569",
      profileUrl: "https://github.com/safethecode",
    },
  ]}
/>
```

### Props

- `avatarUrls` : Array d'objets `{ imageUrl: string, profileUrl: string }`
- `numPeople` : Nombre additionnel de personnes (affiche "+X")
- `className` : Classes CSS personnalisées

### Exemple pour afficher les participants d'un événement

```jsx
<div className="flex items-center gap-4">
  <AvatarCircles
    numPeople={event.participantsCount - 4}
    avatarUrls={event.participants.slice(0, 4).map((p) => ({
      imageUrl: p.avatar || "/default-avatar.png",
      profileUrl: `/profile/${p.id}`,
    }))}
  />
  <span className="text-gray-600">
    {event.participantsCount} participants inscrits
  </span>
</div>
```

---

## 🖱️ 4. Pointer

**Fichier** : `src/components/ui/pointer.jsx`

**Description** : Curseur personnalisé animé qui remplace le curseur par défaut sur un élément.

### Import

```jsx
import { Pointer } from "@/components/ui/pointer";
```

### Utilisation

```jsx
<div className="relative">
  <Pointer />

  <div className="p-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
    <h2 className="text-white text-2xl">
      Survolez-moi pour voir le curseur personnalisé !
    </h2>
  </div>
</div>
```

### Utilisation avec un curseur personnalisé

```jsx
<div className="relative">
  <Pointer className="text-purple-600">
    <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
      👆 Clique !
    </div>
  </Pointer>

  <button className="px-6 py-3 bg-purple-600 text-white rounded-lg">
    Bouton interactif
  </button>
</div>
```

### Props

- `className` : Classes CSS pour le curseur
- `style` : Styles inline
- `children` : Contenu personnalisé du curseur (par défaut: icône de flèche)

---

## ✨ 5. Border Beam

**Fichier** : `src/components/ui/border-beam.jsx`

**Description** : Effet de bordure animée avec un faisceau lumineux qui tourne autour de l'élément.

### Import

```jsx
import { BorderBeam } from "@/components/ui/border-beam";
```

### Utilisation

```jsx
<div className="relative rounded-xl border border-gray-200 p-8">
  <BorderBeam />

  <h3 className="text-2xl font-bold mb-4">Carte avec bordure animée</h3>
  <p className="text-gray-600">
    Cette carte a une bordure lumineuse qui tourne autour !
  </p>
</div>
```

### Utilisation avec des couleurs personnalisées

```jsx
<div className="relative rounded-xl border border-purple-200 p-8 bg-gradient-to-br from-purple-50 to-pink-50">
  <BorderBeam
    size={200}
    duration={10}
    delay={3}
    colorFrom="#8B3FBF"
    colorTo="#D946EF"
    borderWidth={2}
  />

  <h3 className="text-2xl font-bold mb-4">Événement Spécial 🎉</h3>
  <p className="text-gray-700">Une soirée inoubliable vous attend !</p>
</div>
```

### Props

- `size` : Taille du faisceau en pixels (défaut: 50)
- `duration` : Durée d'un tour complet en secondes (défaut: 6)
- `delay` : Délai avant le démarrage en secondes (défaut: 0)
- `colorFrom` : Couleur de début du gradient (défaut: "#ffaa40")
- `colorTo` : Couleur de fin du gradient (défaut: "#9c40ff")
- `borderWidth` : Épaisseur de la bordure en pixels (défaut: 1)
- `reverse` : Inverser la direction (défaut: false)
- `initialOffset` : Position initiale en pourcentage (défaut: 0)
- `className` : Classes CSS personnalisées
- `style` : Styles inline

---

## 💡 Exemples d'intégration dans HomePage

### 1. Remplacer la section Features par Bento Grid

```jsx
{
  /* Remplacer la section Features actuelle par : */
}
<BentoGrid className="mt-16 max-w-6xl mx-auto">
  <BentoCard
    name="Événements toute l'année"
    className="col-span-2"
    background={
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 opacity-80" />
    }
    Icon={() => <span className="text-4xl">🎊</span>}
    description="Soirées, concerts, afterworks... Il y a toujours quelque chose à faire !"
    href="/events"
    cta="Voir les événements"
  />

  <BentoCard
    name="Rencontre des étudiants"
    className="col-span-1"
    background={
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 opacity-80" />
    }
    Icon={() => <span className="text-4xl">🤝</span>}
    description="Fais de nouvelles rencontres et crée des liens"
    href="/bdes"
    cta="Découvrir"
  />

  <BentoCard
    name="Réductions exclusives"
    className="col-span-1"
    background={
      <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-400 opacity-80" />
    }
    Icon={() => <span className="text-4xl">💰</span>}
    description="Profite de réductions chez nos partenaires"
    href="/partners"
    cta="Voir les offres"
  />

  <BentoCard
    name="Toujours informé"
    className="col-span-2"
    background={
      <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-400 opacity-80" />
    }
    Icon={() => <span className="text-4xl">📱</span>}
    description="Toutes les infos en temps réel"
    href="/events"
    cta="Rester connecté"
  />
</BentoGrid>;
```

### 2. Ajouter Border Beam aux cartes d'événements

```jsx
{
  upcomingEvents.map((event, index) => (
    <AnimatedCard key={event._id} delay={0.1 * (index + 1)}>
      <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
        <BorderBeam
          size={100}
          duration={8}
          colorFrom="#8B3FBF"
          colorTo="#D946EF"
        />

        {/* Reste du contenu de la carte événement */}
      </div>
    </AnimatedCard>
  ));
}
```

### 3. Afficher les participants avec Avatar Circles

```jsx
{
  /* Dans une carte d'événement */
}
<div className="p-6">
  <h3 className="text-xl font-bold mb-4">{event.title}</h3>

  <div className="flex items-center justify-between mb-4">
    <AvatarCircles
      numPeople={event.participantsCount - 3}
      avatarUrls={[
        { imageUrl: "/avatar1.jpg", profileUrl: "#" },
        { imageUrl: "/avatar2.jpg", profileUrl: "#" },
        { imageUrl: "/avatar3.jpg", profileUrl: "#" },
      ]}
    />
    <span className="text-sm text-gray-600">
      {event.participantsCount} inscrits
    </span>
  </div>

  <Link to={`/events/${event._id}`} className="btn">
    S'inscrire
  </Link>
</div>;
```

### 4. Section "Dernières activités" avec Animated List

```jsx
{
  /* Nouvelle section après les événements */
}
<section className="py-16 bg-gray-50">
  <div className="max-w-4xl mx-auto px-4">
    <h2 className="text-4xl font-bold text-center mb-12">
      📢 Dernières Activités
    </h2>

    <AnimatedList delay={1000}>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-4">
          <span className="text-4xl">🎉</span>
          <div>
            <div className="font-bold text-lg">Nouvelle soirée ajoutée</div>
            <div className="text-gray-600">Soirée Halloween - 31 octobre</div>
            <div className="text-sm text-gray-400">Il y a 2 minutes</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-4">
          <span className="text-4xl">🎓</span>
          <div>
            <div className="font-bold text-lg">BDE INFO recrute !</div>
            <div className="text-gray-600">Rejoins l'équipe du BDE INFO</div>
            <div className="text-sm text-gray-400">Il y a 15 minutes</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-4">
          <span className="text-4xl">🤝</span>
          <div>
            <div className="font-bold text-lg">Nouveau partenaire</div>
            <div className="text-gray-600">-20% chez Pizza Palace</div>
            <div className="text-sm text-gray-400">Il y a 1 heure</div>
          </div>
        </div>
      </div>
    </AnimatedList>
  </div>
</section>;
```

### 5. Curseur personnalisé sur la section Hero

```jsx
<div className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
  <Pointer className="text-purple-600">
    <div className="bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg">
      ✨ Clique !
    </div>
  </Pointer>

  <div className="container mx-auto px-4 py-16">{/* Contenu du Hero */}</div>
</div>
```

---

## 🎯 Recommandations d'utilisation

### Pour la HomePage :

1. **Bento Grid** → Remplacer la section "Features" pour un look plus moderne
2. **Border Beam** → Ajouter aux cartes d'événements "premium" ou "featured"
3. **Avatar Circles** → Afficher les participants aux événements
4. **Animated List** → Créer une section "Fil d'actualité" ou "Dernières activités"
5. **Pointer** → Ajouter sur la section Hero pour un effet WOW

### Pour les pages Events :

1. **Border Beam** → Mettre en avant les événements à venir
2. **Avatar Circles** → Afficher les participants inscrits
3. **Animated List** → Afficher les derniers commentaires ou inscriptions

### Pour les pages BDE :

1. **Bento Grid** → Afficher les différents BDE en grille moderne
2. **Avatar Circles** → Afficher les membres du bureau
3. **Border Beam** → Mettre en avant les BDE les plus actifs

---

## 📚 Documentation officielle

Pour plus d'exemples et d'options :

- [Bento Grid](https://magicui.design/docs/components/bento-grid)
- [Animated List](https://magicui.design/docs/components/animated-list)
- [Avatar Circles](https://magicui.design/docs/components/avatar-circles)
- [Pointer](https://magicui.design/docs/components/pointer)
- [Border Beam](https://magicui.design/docs/components/border-beam)

---

## 🚀 Installation de composants supplémentaires

Pour installer d'autres composants Magic UI :

```bash
npx shadcn@latest add "https://magicui.design/r/[component-name]"
```

Composants populaires disponibles :

- **shimmer-button** : Boutons avec effet de brillance
- **particles** : Effet de particules en arrière-plan
- **text-reveal** : Animation de révélation de texte
- **animated-grid-pattern** : Motifs de grille animés
- **meteors** : Effet de météores
- **magic-card** : Cartes 3D interactives

---

## ✅ Prochaines étapes

1. Choisir quels composants intégrer dans votre HomePage
2. Tester chaque composant individuellement
3. Ajuster les couleurs pour matcher votre thème (purple/pink)
4. Optimiser les animations pour de bonnes performances

Tous les composants sont prêts à être utilisés ! 🎉
