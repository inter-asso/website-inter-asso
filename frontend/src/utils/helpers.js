/**
 * Générer un slug à partir d'un texte
 * @param {string} text - Le texte à slugifier
 * @returns {string} Le slug généré
 */
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD") // Décomposer les caractères accentués
    .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
    .replace(/[^a-z0-9\s-]/g, "") // Supprimer les caractères spéciaux
    .trim()
    .replace(/\s+/g, "-") // Remplacer les espaces par des tirets
    .replace(/-+/g, "-"); // Supprimer les tirets multiples
};

/**
 * Tronquer un texte
 * @param {string} text - Le texte à tronquer
 * @param {number} maxLength - Longueur maximale
 * @returns {string} Texte tronqué
 */
export const truncate = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

/**
 * Capitaliser la première lettre
 * @param {string} str - La chaîne à capitaliser
 * @returns {string} Chaîne capitalisée
 */
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Formater un prix en euros
 * @param {number} price - Le prix à formater
 * @returns {string} Prix formaté
 */
export const formatPrice = (price) => {
  if (price === 0) return "Gratuit";
  return `${price.toFixed(2)} €`;
};

/**
 * Extraire les initiales d'un nom
 * @param {string} firstName - Prénom
 * @param {string} lastName - Nom
 * @returns {string} Initiales
 */
export const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ""}${
    lastName?.charAt(0) || ""
  }`.toUpperCase();
};
