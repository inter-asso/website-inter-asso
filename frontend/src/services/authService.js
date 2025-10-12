import api from './api';

const authService = {
  // Connexion
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, refreshToken, user } = response.data;
    
    // Stocker les tokens et les infos utilisateur
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    console.log('✅ Token sauvegardé:', token.substring(0, 20) + '...');
    
    return response.data;
  },

  // Déconnexion
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  // Récupérer l'utilisateur actuel
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Mettre à jour le mot de passe
  updatePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/update-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  // Récupérer l'utilisateur depuis le localStorage
  getStoredUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

export default authService;
