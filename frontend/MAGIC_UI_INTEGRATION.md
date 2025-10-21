# 🎨 Intégration de Magic UI dans HomePage

## ✅ Composants Magic UI Installés

### 1. **AnimatedCard** (`components/magicui/animated-card.jsx`)

Animation d'apparition fluide pour les cartes avec effet hover

**Usage :**

```jsx
import AnimatedCard from "../../components/magicui/animated-card";

<AnimatedCard delay={0.1} className="bg-white rounded-xl p-6">
  <h3>Contenu de la carte</h3>
</AnimatedCard>;
```

**Props :**

- `delay` : Délai avant animation (en secondes)
- `className` : Classes Tailwind CSS
- `children` : Contenu de la carte

---

### 2. **NumberTicker** (`components/magicui/number-ticker.jsx`)

Animation de compteur pour les statistiques

**Usage :**

```jsx
import NumberTicker from "../../components/magicui/number-ticker";

<div className="text-5xl font-bold text-purple-600">
  <NumberTicker value={stats.totalEvents} delay={0.2} />+
</div>;
```

**Props :**

- `value` : Nombre à animer
- `delay` : Délai avant animation
- `direction` : "up" (default) ou "down"
- `decimalPlaces` : Nombre de décimales (default: 0)
- `className` : Classes CSS

---

### 3. **Marquee** (`components/magicui/marquee.jsx`)

Défilement horizontal/vertical infini pour logos ou témoignages

**Usage :**

```jsx
import Marquee from "../../components/magicui/marquee";

<Marquee pauseOnHover className="[--duration:20s]">
  <div className="flex gap-4">
    {partners.map((partner) => (
      <div key={partner._id} className="w-40">
        <img src={partner.logo.url} alt={partner.name} />
      </div>
    ))}
  </div>
</Marquee>;
```

**Props :**

- `pauseOnHover` : Pause sur hover (boolean)
- `reverse` : Inverser direction (boolean)
- `vertical` : Défilement vertical (boolean)
- `repeat` : Nombre de répétitions (default: 4)
- `className` : Utiliser `[--duration:20s]` pour ajuster vitesse

---

### 4. **BentoGrid** (`components/magicui/bento-grid.jsx`)

Grille moderne pour présenter des features

**Usage :**

```jsx
import { BentoGrid, BentoCard } from "../../components/magicui/bento-grid";

<BentoGrid className="lg:grid-rows-3">
  <BentoCard
    name="Événements"
    className="col-span-3 lg:col-span-2"
    background={
      <img src="/event.jpg" className="absolute inset-0 object-cover" />
    }
    Icon={() => <span className="text-4xl">🎉</span>}
    description="Découvre tous les événements du campus"
    href="/events"
    cta="Voir les événements"
  />
</BentoGrid>;
```

---

## 🔧 Fichiers Utilitaires

### `lib/utils.js`

Fonction `cn()` pour fusionner les classes Tailwind :

```jsx
import { cn } from "../../lib/utils";

<div className={cn("base-class", condition && "conditional-class", className)}>
```

---

## 📝 Exemple d'intégration dans HomePage

### 1. **Remplacer les Stats avec NumberTicker**

**AVANT** (ligne 322) :

```jsx
<div className="text-5xl font-bold text-purple-600 mb-2">
  {stats.totalEvents}+
</div>
```

**APRÈS** :

```jsx
import NumberTicker from "../../components/magicui/number-ticker";

<div className="text-5xl font-bold text-purple-600 mb-2">
  <NumberTicker value={stats.totalEvents} delay={0.2} />+
</div>;
```

---

### 2. **Remplacer Quick Links avec AnimatedCard**

**AVANT** (ligne 204) :

```jsx
<Link
  to="/events"
  className="quick-link-card bg-white rounded-xl shadow-lg p-6"
>
```

**APRÈS** :

```jsx
import AnimatedCard from "../../components/magicui/animated-card";

<AnimatedCard delay={0.1}>
  <Link
    to="/events"
    className="bg-white rounded-xl shadow-lg p-6 block"
  >
```

---

### 3. **Ajouter Marquee pour les Partenaires**

**AVANT** (ligne 622) :

```jsx
<div className="grid grid-cols-2 md:grid-cols-3 gap-6">
  {partners.map((partner) => (...))}
</div>
```

**APRÈS** :

```jsx
import Marquee from "../../components/magicui/marquee";

<Marquee pauseOnHover className="[--duration:30s]">
  {partners.map((partner) => (
    <div
      key={partner._id}
      className="bg-white rounded-xl p-6 shadow-lg flex flex-col items-center justify-center w-40 mx-3"
    >
      {partner.logo?.url ? (
        <img
          src={partner.logo.url}
          alt={partner.name}
          className="h-20 object-contain mb-3"
        />
      ) : (
        <div className="text-4xl mb-3">🏢</div>
      )}
      <h3 className="font-semibold text-gray-900 text-center text-sm">
        {partner.name}
      </h3>
    </div>
  ))}
</Marquee>;
```

---

### 4. **Créer une Bento Grid pour les Features**

**Remplacer la section Features** (lignes 240-304) par :

```jsx
import { BentoGrid, BentoCard } from "../../components/magicui/bento-grid";

<div className="mt-16 max-w-6xl mx-auto">
  <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
    Pourquoi rejoindre la communauté ? 🚀
  </h2>
  <BentoGrid className="auto-rows-[18rem] md:grid-cols-3">
    <BentoCard
      name="Des événements toute l'année"
      className="col-span-3 md:col-span-2"
      background={
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-10" />
      }
      Icon={() => <span className="text-5xl">🎊</span>}
      description="Soirées, concerts, afterworks, intégrations... Il y a toujours quelque chose à faire sur le campus !"
      href="/events"
      cta="Voir les événements"
    />
    <BentoCard
      name="Rencontre des étudiants"
      className="col-span-3 md:col-span-1"
      background={
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-10" />
      }
      Icon={() => <span className="text-5xl">🤝</span>}
      description="Fais de nouvelles rencontres et intègre-toi facilement"
      href="/bdes"
      cta="Découvrir les BDE"
    />
    <BentoCard
      name="Réductions exclusives"
      className="col-span-3 md:col-span-1"
      background={
        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-blue-500 opacity-10" />
      }
      Icon={() => <span className="text-5xl">💰</span>}
      description="Profite de réductions chez nos partenaires locaux"
      href="/partners"
      cta="Voir les partenaires"
    />
    <BentoCard
      name="Toujours informé"
      className="col-span-3 md:col-span-2"
      background={
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 opacity-10" />
      }
      Icon={() => <span className="text-5xl">📱</span>}
      description="Toutes les infos en temps réel : événements, actualités, bons plans..."
      href="/events"
      cta="Rester informé"
    />
  </BentoGrid>
</div>;
```

---

## 🎨 Animations Tailwind Ajoutées

Dans `tailwind.config.js`, j'ai ajouté :

```js
animation: {
  marquee: "marquee var(--duration) linear infinite",
  "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
  "fade-in": "fade-in 0.5s ease-out",
  "slide-up": "slide-up 0.5s ease-out",
}
```

Tu peux utiliser ces animations directement :

```jsx
<div className="animate-fade-in">Apparaît en fondu</div>
<div className="animate-slide-up">Monte en glissant</div>
```

---

## 🚀 Prochaines Étapes

1. **Retirer GSAP** : Les composants Magic UI utilisent Framer Motion qui est plus moderne et léger
2. **Utiliser AnimatedCard** partout au lieu de `gsap.from()`
3. **Ajouter Marquee** pour la section Partenaires (effet wow!)
4. **Utiliser NumberTicker** pour les stats (super effet compteur)
5. **Optionnel : BentoGrid** pour une présentation moderne des features

**Avantage** : Plus de problèmes de flash/disparition car Framer Motion gère mieux l'état initial des animations !

---

## 📚 Documentation

- [Magic UI Docs](https://magicui.design/docs/components)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind Merge](https://github.com/dcastil/tailwind-merge)
