import { createContext, useState, useEffect } from "react";
import authService from "../services/authService";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Charger l'utilisateur au montage du composant
  useEffect(() => {
    const initAuth = async () => {
      console.log("🔍 Initialisation de l'authentification...");
      const storedUser = authService.getStoredUser();
      const hasToken = authService.isAuthenticated();

      console.log("📦 Utilisateur stocké:", storedUser);
      console.log("🔑 Token présent:", hasToken);

      if (storedUser && hasToken) {
        try {
          // Vérifier que le token est toujours valide
          console.log("✅ Vérification du token...");
          const currentUser = await authService.getCurrentUser();
          console.log("✅ Token valide, utilisateur:", currentUser);
          setUser(currentUser);
          setIsAuthenticated(true);
        } catch (error) {
          // Token invalide, nettoyer le localStorage
          console.error("❌ Token invalide:", error);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        console.log("⚠️ Pas de token ou d'utilisateur stocké");
      }
      setLoading(false);
      console.log("✅ Initialisation terminée");
    };

    initAuth();
  }, []);

  // Connexion
  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true, user: data.user };
    } catch (error) {
      console.error("Erreur de connexion:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Erreur de connexion",
      };
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Rafraîchir les données utilisateur
  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      localStorage.setItem("user", JSON.stringify(currentUser));
    } catch (error) {
      console.error("Erreur lors du rafraîchissement:", error);
    }
  };

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Vérifier si l'utilisateur est Admin Interasso
  const isAdminInterasso = () => {
    return user?.role === "admin_interasso";
  };

  // Vérifier si l'utilisateur est Admin BDE
  const isAdminBDE = () => {
    return user?.role === "admin_bde";
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
    hasRole,
    isAdminInterasso,
    isAdminBDE,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
