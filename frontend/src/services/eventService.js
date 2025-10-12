import api from './api';

const eventService = {
  // Récupérer tous les événements publiés (public)
  getAllEvents: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/events?${params}`);
    return response.data.events || response.data;
  },

  // Récupérer un événement par slug
  getEventBySlug: async (slug) => {
    const response = await api.get(`/events/${slug}`);
    return response.data.event || response.data;
  },

  // Récupérer les événements de mon BDE (Admin BDE)
  getMyBDEEvents: async () => {
    const response = await api.get('/events/my/events');
    return response.data.events || response.data;
  },

  // Créer un événement (Admin BDE)
  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
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
