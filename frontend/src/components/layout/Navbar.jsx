import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold">
                Inter<span className="text-purple-600">ASSO</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              to="/bdes"
              className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Les BDE
            </Link>
            <Link
              to="/events"
              className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Événements
            </Link>
            <Link
              to="/partners"
              className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Partenaires
            </Link>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={
                    user?.role === "admin_interasso"
                      ? "/admin/validation"
                      : "/admin/events"
                  }
                  className="text-purple-600 hover:text-purple-700 px-3 py-2 text-sm font-medium"
                >
                  📊 Dashboard
                </Link>
                <div className="border-l border-gray-300 h-6"></div>
                <div className="text-sm text-gray-700">
                  {user?.firstName} {user?.lastName}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 px-3 py-2 text-sm font-medium"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                Connexion
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/bdes"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Les BDE
            </Link>
            <Link
              to="/events"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Événements
            </Link>
            <Link
              to="/partners"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Partenaires
            </Link>

            {isAuthenticated ? (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <Link
                  to={
                    user?.role === "admin_interasso"
                      ? "/admin/validation"
                      : "/admin/events"
                  }
                  className="block px-3 py-2 text-base font-medium text-purple-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  📊 Dashboard
                </Link>
                <div className="px-3 py-2 text-sm text-gray-600">
                  {user?.firstName} {user?.lastName}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-50 rounded-md"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-purple-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Connexion
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
