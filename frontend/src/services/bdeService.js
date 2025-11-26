import api from "./api";

const bdeService = {
  // Récupérer tous les BDE
  getAllBDEs: async () => {
    const response = await api.get("/bdes");
    return response.data.bdes || response.data;
  },

  // Récupérer un BDE par slug
  getBDEBySlug: async (slug) => {
    const response = await api.get(`/bdes/${slug}`);
    return response.data.bde || response.data;
  },

  // Récupérer les événements d'un BDE
  getBDEEvents: async (slug, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/bdes/${slug}/events?${params}`);
    return response.data;
  },

  // Récupérer les membres d'un BDE
  getBDEMembers: async (slug) => {
    const response = await api.get(`/bdes/${slug}/members`);
    return response.data;
  },

  // Récupérer les statistiques d'un BDE
  getBDEStats: async (slug) => {
    const response = await api.get(`/bdes/${slug}/stats`);
    return response.data;
  },

  // Créer un BDE (Admin Interasso uniquement)
  createBDE: async (bdeData) => {
    const response = await api.post("/bdes", bdeData);
    return response.data;
  },

  // Mettre à jour un BDE (Admin Interasso uniquement)
  updateBDE: async (id, bdeData) => {
    const response = await api.put(`/bdes/${id}`, bdeData);
    return response.data;
  },

  // Supprimer un BDE (Admin Interasso uniquement)
  deleteBDE: async (id) => {
    const response = await api.delete(`/bdes/${id}`);
    return response.data;
  },
};

export default bdeService;
