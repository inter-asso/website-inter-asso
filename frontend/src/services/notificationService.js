import api from './api';

const notificationService = {
  // Récupérer toutes les notifications
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  // Récupérer le nombre de notifications non lues
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  // Marquer une notification comme lue
  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  // Marquer toutes les notifications comme lues
  markAllAsRead: async () => {
    const response = await api.put('/notifications/mark-all-read');
    return response.data;
  },

  // Supprimer une notification
  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  // Supprimer toutes les notifications lues
  deleteReadNotifications: async () => {
    const response = await api.delete('/notifications/read');
    return response.data;
  },
};

export default notificationService;
