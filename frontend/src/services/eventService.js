import api from "./api";

const eventService = {
  // Récupérer tous les événements publiés (public)
  getAllEvents: async (filters = {}) => {
    // Nettoyer les filtres vides
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    console.log("📤 Envoi des filtres:", cleanFilters);
    const params = new URLSearchParams(cleanFilters);
    console.log("🔗 URL params:", params.toString());
    const response = await api.get(`/events?${params}`);
    console.log("📥 Événements reçus:", response.data.events?.length || 0);
    return response.data.events || response.data;
  },

  // Récupérer un événement par slug
  getEventBySlug: async (slug) => {
    const response = await api.get(`/events/${slug}`);
    return response.data.event || response.data;
  },

  // Récupérer les événements de mon BDE (Admin BDE)
  getMyBDEEvents: async () => {
    const response = await api.get("/events/my/events");
    return response.data.events || response.data;
  },

  // Créer un événement (Admin BDE)
  createEvent: async (eventData) => {
    const response = await api.post("/events", eventData);
    return response.data;
  },

  // Mettre à jour un événement
  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  // Supprimer un événement
  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};

export default eventService;
