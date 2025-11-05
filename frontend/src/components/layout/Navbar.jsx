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
              <span className="text-2xl font-bold text-chocolate_cosmos">
                Inter<span className="text-raspberry_rose">ASSO</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              to="/bdes"
              className="text-chocolate_cosmos hover:text-raspberry_rose px-3 py-2 text-sm font-medium transition-colors"
            >
              Les BDE
            </Link>
            <Link
              to="/events"
              className="text-chocolate_cosmos hover:text-raspberry_rose px-3 py-2 text-sm font-medium transition-colors"
            >
              Événements
            </Link>
            <Link
              to="/partners"
              className="text-chocolate_cosmos hover:text-raspberry_rose px-3 py-2 text-sm font-medium transition-colors"
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
                  className="text-raspberry_rose hover:text-raspberry_rose-600 px-3 py-2 text-sm font-medium"
                >
                  📊 Dashboard
                </Link>
                <div className="border-l border-chocolate_cosmos-300 h-6"></div>
                <div className="text-sm text-chocolate_cosmos-400">
                  {user?.firstName} {user?.lastName}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-raspberry_rose-600 hover:text-raspberry_rose-700 px-3 py-2 text-sm font-medium"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-raspberry_rose text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-raspberry_rose-600 transition-colors"
              >
                Connexion
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-chocolate_cosmos hover:text-raspberry_rose focus:outline-none"
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
  <div className="md:hidden border-t border-light_orange-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/bdes"
              className="block px-3 py-2 text-base font-medium text-chocolate_cosmos hover:text-raspberry_rose hover:bg-light_orange-900 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Les BDE
            </Link>
            <Link
              to="/events"
              className="block px-3 py-2 text-base font-medium text-chocolate_cosmos hover:text-raspberry_rose hover:bg-light_orange-900 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Événements
            </Link>
            <Link
              to="/partners"
              className="block px-3 py-2 text-base font-medium text-chocolate_cosmos hover:text-raspberry_rose hover:bg-light_orange-900 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Partenaires
            </Link>

            {isAuthenticated ? (
              <>
                <div className="border-t border-chocolate_cosmos-200 my-2"></div>
                <Link
                  to={
                    user?.role === "admin_interasso"
                      ? "/admin/validation"
                      : "/admin/events"
                  }
                  className="block px-3 py-2 text-base font-medium text-raspberry_rose hover:bg-light_orange-900 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  📊 Dashboard
                </Link>
                <div className="px-3 py-2 text-sm text-chocolate_cosmos-400">
                  {user?.firstName} {user?.lastName}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-raspberry_rose-600 hover:bg-light_orange-100 rounded-md"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-chocolate_cosmos-200 my-2"></div>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-raspberry_rose hover:bg-light_orange-900 rounded-md"
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
