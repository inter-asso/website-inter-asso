import api from "./api";

const partnerService = {
  // Récupérer tous les partenaires
  getAllPartners: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/partners?${params}`);
    return response.data.partners || response.data;
  },

  // Récupérer un partenaire par ID
  getPartnerById: async (id) => {
    const response = await api.get(`/partners/${id}`);
    return response.data.partner || response.data;
  },

  // Créer un partenaire (Admin Interasso)
  createPartner: async (partnerData) => {
    const response = await api.post("/partners", partnerData);
    return response.data;
  },

  // Mettre à jour un partenaire (Admin Interasso)
  updatePartner: async (id, partnerData) => {
    const response = await api.put(`/partners/${id}`, partnerData);
    return response.data;
  },

  // Supprimer un partenaire (Admin Interasso)
  deletePartner: async (id) => {
    const response = await api.delete(`/partners/${id}`);
    return response.data;
  },
};

export default partnerService;
