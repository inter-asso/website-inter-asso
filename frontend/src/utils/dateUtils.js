/**
 * Formater une date en français
 * @param {Date|string} date - La date à formater
 * @param {Object} options - Options de formatage Intl.DateTimeFormat
 * @returns {string} Date formatée
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };

  return new Date(date).toLocaleDateString("fr-FR", defaultOptions);
};

/**
 * Formater une date avec l'heure
 * @param {Date|string} date - La date à formater
 * @returns {string} Date et heure formatées
 */
export const formatDateTime = (date) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Formater uniquement l'heure
 * @param {Date|string} date - La date dont extraire l'heure
 * @returns {string} Heure formatée
 */
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Obtenir une date relative (il y a X jours, etc.)
 * @param {Date|string} date - La date à comparer
 * @returns {string} Date relative
 */
export const getRelativeTime = (date) => {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now - then) / 1000);

  if (diffInSeconds < 60) return "À l'instant";
  if (diffInSeconds < 3600)
    return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400)
    return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
  if (diffInSeconds < 604800)
    return `Il y a ${Math.floor(diffInSeconds / 86400)} j`;

  return formatDate(date);
};

/**
 * Vérifier si une date est passée
 * @param {Date|string} date - La date à vérifier
 * @returns {boolean} true si la date est passée
 */
export const isPastDate = (date) => {
  return new Date(date) < new Date();
};

/**
 * Vérifier si un événement est à venir
 * @param {Date|string} date - La date de l'événement
 * @returns {boolean} true si l'événement est à venir
 */
export const isUpcoming = (date) => {
  return new Date(date) > new Date();
};
