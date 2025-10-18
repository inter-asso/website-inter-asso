import { useState, useEffect } from "react";
import partnerService from "../../services/partnerService";
import { PARTNER_CATEGORIES } from "../../utils/constants";
import PublicLayout from "../../components/layout/PublicLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function PartnersPage() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    loadPartners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const loadPartners = async () => {
    setLoading(true);
    try {
      const filters = selectedCategory ? { category: selectedCategory } : {};
      const data = await partnerService.getAllPartners(filters);
      setPartners(data);
    } catch (error) {
      console.error("Erreur chargement partenaires:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Nos Partenaires
              </h1>
              <p className="text-gray-600 mt-2">
                Profitez des avantages exclusifs avec votre carte BDE
              </p>
            </div>
          </div>
        </header>

        {/* Category Filters */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === ""
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tous
              </button>
              {Object.entries(PARTNER_CATEGORIES).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === key
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {value.icon} {value.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : partners.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 text-lg">
                Aucun partenaire trouvé dans cette catégorie
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((partner) => (
                <div
                  key={partner._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                  {/* Partner Logo/Header */}
                  <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-8 flex items-center justify-center h-40">
                    {partner.logo?.url ? (
                      <img
                        src={partner.logo.url}
                        alt={partner.name}
                        className="max-h-24 max-w-full object-contain"
                      />
                    ) : (
                      <div className="text-6xl">
                        {PARTNER_CATEGORIES[partner.category]?.icon || "🏢"}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Category Badge */}
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 mb-3">
                      {PARTNER_CATEGORIES[partner.category]?.label}
                    </span>

                    {/* Name */}
                    <h2 className="text-xl font-bold text-gray-900 mb-3">
                      {partner.name}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {partner.description}
                    </p>

                    {/* Benefits */}
                    {partner.benefits && partner.benefits.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">
                          Avantages :
                        </h3>
                        <ul className="space-y-1">
                          {partner.benefits
                            .slice(0, 3)
                            .map((benefit, index) => (
                              <li
                                key={index}
                                className="text-sm text-gray-700 flex items-start"
                              >
                                <svg
                                  className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span>{benefit}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}

                    {/* Website Link */}
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm"
                      >
                        Visiter le site
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                      </a>
                    )}

                    {/* Featured Badge */}
                    {partner.featured && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <span className="inline-flex items-center text-xs font-medium text-yellow-700">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Partenaire vedette
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </PublicLayout>
  );
}
