import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-raspberry_rose to-chocolate_cosmos text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-2xl font-bold mb-4">
              Inter<span className="text-salmon_pink">ASSO</span>
            </h3>
            <p className="text-salmon_pink-900 text-sm">
              Plateforme de gestion des BDE de l'IUT de Lannion
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-salmon_pink-900 hover:text-white transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  to="/bdes"
                  className="text-salmon_pink-900 hover:text-white transition-colors"
                >
                  Les BDE
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="text-salmon_pink-900 hover:text-white transition-colors"
                >
                  Événements
                </Link>
              </li>
              <li>
                <Link
                  to="/partners"
                  className="text-salmon_pink-900 hover:text-white transition-colors"
                >
                  Partenaires
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Espace Admin</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/login"
                  className="text-salmon_pink-900 hover:text-white transition-colors"
                >
                  Connexion
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/validation"
                  className="text-salmon_pink-900 hover:text-white transition-colors"
                >
                  Validation (Interasso)
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/events"
                  className="text-salmon_pink-900 hover:text-white transition-colors"
                >
                  Gestion (BDE)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact</h4>
            <ul className="space-y-2 text-sm text-salmon_pink-900">
              <li>IUT de Lannion</li>
              <li>Rue Édouard Branly</li>
              <li>22300 Lannion</li>
              <li className="mt-3">
                <a
                  href="mailto:contact@interasso-lannion.fr"
                  className="hover:text-white transition-colors"
                >
                  contact@interasso-lannion.fr
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-salmon_pink-800/40 mt-8 pt-8 text-center text-sm text-salmon_pink-900">
          <p>
            © {new Date().getFullYear()} InterASSO Lannion. Tous droits
            réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
