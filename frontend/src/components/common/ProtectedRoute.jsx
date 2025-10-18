import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const ProtectedRoute = ({ children, requireRole }) => {
  const { isAuthenticated, loading, user } = useAuth();

  console.log(
    "🛡️ ProtectedRoute - Loading:",
    loading,
    "Auth:",
    isAuthenticated,
    "User:",
    user,
    "RequireRole:",
    requireRole
  );

  if (loading) {
    console.log("⏳ En cours de chargement...");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("❌ Non authentifié, redirection vers /login");
    return <Navigate to="/login" replace />;
  }

  // Vérifier le rôle si requis
  if (requireRole && user?.role !== requireRole) {
    console.log(
      `❌ Rôle incorrect. Attendu: ${requireRole}, Reçu: ${user?.role}`
    );
    return <Navigate to="/" replace />;
  }

  console.log("✅ Accès autorisé");
  return children;
};
