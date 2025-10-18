import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useAuth } from "../../hooks/useAuth";
import PublicLayout from "../../components/layout/PublicLayout";

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const heroRef = useRef(null);

  useEffect(() => {
    // Hero animation
    const ctx = gsap.context(() => {
      gsap.from("h1", {
        duration: 1,
        y: -50,
        opacity: 0,
        ease: "power3.out",
      });

      gsap.from("h1 + p", {
        duration: 1,
        y: -30,
        opacity: 0,
        delay: 0.2,
        ease: "power3.out",
      });

      gsap.from(".hero-buttons > *", {
        duration: 0.8,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        delay: 0.4,
        ease: "power3.out",
      });

      // Quick links cards
      gsap.from(".quick-link-card", {
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.15,
        delay: 0.6,
        ease: "power3.out",
      });

      // Features
      gsap.from(".feature-card", {
        duration: 0.8,
        scale: 0.9,
        opacity: 0,
        stagger: 0.1,
        delay: 1,
        ease: "back.out(1.7)",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div
        ref={heroRef}
        className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"
      >
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Inter<span className="text-purple-600">ASSO</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Plateforme de gestion des BDE de l'IUT de Lannion
            </p>

            {isAuthenticated ? (
              <div className="space-x-4 hero-buttons">
                <Link
                  to={
                    user?.role === "admin_interasso"
                      ? "/admin/validation"
                      : "/admin/events"
                  }
                  className="inline-block px-8 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Accéder à mon espace
                </Link>
                <Link
                  to="/events"
                  className="inline-block px-8 py-3 bg-white text-purple-600 font-medium rounded-lg border-2 border-purple-600 hover:bg-purple-50 transition-colors"
                >
                  Voir les événements
                </Link>
              </div>
            ) : (
              <div className="space-x-4 hero-buttons">
                <Link
                  to="/login"
                  className="inline-block px-8 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Connexion Admin
                </Link>
                <Link
                  to="/events"
                  className="inline-block px-8 py-3 bg-white text-purple-600 font-medium rounded-lg border-2 border-purple-600 hover:bg-purple-50 transition-colors"
                >
                  Découvrir les événements
                </Link>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Link
              to="/bdes"
              className="quick-link-card bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Les BDE</h3>
              <p className="text-gray-600">
                Découvrez tous les Bureaux Des Étudiants de l'IUT
              </p>
            </Link>

            <Link
              to="/events"
              className="quick-link-card bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Événements
              </h3>
              <p className="text-gray-600">
                Consultez tous les événements à venir
              </p>
            </Link>

            <Link
              to="/partners"
              className="quick-link-card bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Partenaires
              </h3>
              <p className="text-gray-600">
                Profitez des avantages de nos partenaires
              </p>
            </Link>
          </div>

          {/* Features */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Une plateforme centralisée
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="feature-card bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white text-2xl">
                      ✅
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Validation centralisée
                    </h3>
                    <p className="mt-2 text-gray-600">
                      L'Admin Interasso valide tous les événements des BDE avant
                      publication
                    </p>
                  </div>
                </div>
              </div>

              <div className="feature-card bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white text-2xl">
                      🔔
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Notifications en temps réel
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Recevez des notifications pour chaque validation ou rejet
                      d'événement
                    </p>
                  </div>
                </div>
              </div>

              <div className="feature-card bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white text-2xl">
                      📊
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Statistiques détaillées
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Consultez les statistiques de validation et d'activité de
                      chaque BDE
                    </p>
                  </div>
                </div>
              </div>

              <div className="feature-card bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-pink-500 text-white text-2xl">
                      🎨
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Interface moderne
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Une interface intuitive et responsive pour tous les
                      utilisateurs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
