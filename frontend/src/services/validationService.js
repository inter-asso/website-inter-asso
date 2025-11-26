import api from "./api";

const validationService = {
  // Récupérer les événements en attente (Admin Interasso)
  getPendingEvents: async () => {
    const response = await api.get("/validation/pending-events");
    return response.data.events || response.data;
  },

  // Récupérer tous les événements avec filtres (Admin Interasso)
  getAllEvents: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/validation/all-events?${params}`);
    return response.data.events || response.data;
  },

  // Valider un événement (Admin Interasso)
  validateEvent: async (eventId) => {
    const response = await api.put(`/validation/validate/${eventId}`);
    return response.data;
  },

  // Rejeter un événement (Admin Interasso)
  rejectEvent: async (eventId, rejectionReason) => {
    const response = await api.put(`/validation/reject/${eventId}`, {
      rejectionReason,
    });
    return response.data;
  },

  // Récupérer les statistiques de validation (Admin Interasso)
  getValidationStats: async () => {
    const response = await api.get("/validation/stats");
    return response.data;
  },
};

export default validationService;
