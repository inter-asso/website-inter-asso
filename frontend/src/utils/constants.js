/**
 * Mapper les catégories d'événements avec leurs labels français
 */
export const EVENT_CATEGORIES = {
  soirée: { label: "Soirée", color: "purple" },
  sport: { label: "Sport", color: "green" },
  culture: { label: "Culture", color: "blue" },
  atelier: { label: "Atelier", color: "orange" },
  sortie: { label: "Sortie", color: "pink" },
  autre: { label: "Autre", color: "gray" },
};

/**
 * Mapper les statuts d'événements
 */
export const EVENT_STATUS = {
  PENDING: { label: "En attente", color: "yellow", icon: "⏳" },
  PUBLISHED: { label: "Publié", color: "green", icon: "✅" },
  REJECTED: { label: "Rejeté", color: "red", icon: "❌" },
};

/**
 * Mapper les catégories de partenaires
 */
export const PARTNER_CATEGORIES = {
  restauration: { label: "Restauration", icon: "🍕" },
  culture: { label: "Culture", icon: "🎨" },
  sport: { label: "Sport", icon: "⚽" },
  commerce: { label: "Commerce", icon: "🛍️" },
  autre: { label: "Autre", icon: "📌" },
};

/**
 * Rôles utilisateurs
 */
export const USER_ROLES = {
  admin_interasso: { label: "Admin Interasso", color: "purple" },
  admin_bde: { label: "Admin BDE", color: "blue" },
};
