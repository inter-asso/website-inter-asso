import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import eventService from "../../services/eventService";
import { formatDate, formatTime, isUpcoming } from "../../utils/dateUtils";
import { EVENT_CATEGORIES } from "../../utils/constants";
import { formatPrice } from "../../utils/helpers";
import PublicLayout from "../../components/layout/PublicLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function EventListPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    bdeId: "",
    category: "",
    upcoming: true,
  });

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getAllEvents(filters);
      setEvents(data);
    } catch (error) {
      console.error("Erreur chargement événements:", error);
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
            <h1 className="text-3xl font-bold text-gray-900">Événements</h1>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap gap-4">
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Toutes les catégories</option>
                {Object.entries(EVENT_CATEGORIES).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.upcoming}
                  onChange={(e) =>
                    setFilters({ ...filters, upcoming: e.target.checked })
                  }
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  Événements à venir uniquement
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 text-lg">Aucun événement trouvé</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Link
                  key={event._id}
                  to={`/events/${event.slug}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1"
                >
                  {/* Event Image */}
                  {event.image?.url && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={event.image.url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* BDE Badge */}
                    {event.bdeId && (
                      <span
                        className="inline-block px-3 py-1 text-xs font-medium rounded-full mb-3"
                        style={{
                          backgroundColor: event.bdeId.colors?.primary + "20",
                          color: event.bdeId.colors?.primary,
                        }}
                      >
                        {event.bdeId.name}
                      </span>
                    )}

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {event.title}
                    </h2>

                    {/* Short Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {event.shortDescription || event.description}
                    </p>

                    {/* Date & Location */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-700">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {formatDate(event.date)} à {formatTime(event.startDate)}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {event.location}
                      </div>
                    </div>

                    {/* Price & Category */}
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-purple-600">
                        {formatPrice(event.price)}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                        {EVENT_CATEGORIES[event.category]?.label}
                      </span>
                    </div>

                    {/* Upcoming Badge */}
                    {isUpcoming(event.date) && (
                      <div className="mt-3 text-xs text-green-600 font-medium">
                        🟢 À venir
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </PublicLayout>
  );
}
