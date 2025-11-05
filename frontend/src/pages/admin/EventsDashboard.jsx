import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import eventService from "../../services/eventService";
import { formatDate, formatTime } from "../../utils/dateUtils";
import { EVENT_STATUS, EVENT_CATEGORIES } from "../../utils/constants";

export default function EventsDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortDescription: "",
    date: "",
    startDate: "",
    endDate: "",
    location: "",
    address: "",
    price: 0,
    category: "soirée",
    maxParticipants: "",
    registrationRequired: false,
    registrationDeadline: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getMyBDEEvents();
      setEvents(data);
    } catch (error) {
      console.error("Erreur chargement événements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const openCreateForm = () => {
    setEditingEvent(null);
    setFormData({
      title: "",
      description: "",
      shortDescription: "",
      date: "",
      startDate: "",
      endDate: "",
      location: "",
      address: "",
      price: 0,
      category: "soirée",
      maxParticipants: "",
      registrationRequired: false,
      registrationDeadline: "",
    });
    setShowEventForm(true);
  };

  const openEditForm = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      shortDescription: event.shortDescription || "",
      date: event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
      startDate: event.startDate
        ? new Date(event.startDate).toISOString().slice(0, 16)
        : "",
      endDate: event.endDate
        ? new Date(event.endDate).toISOString().slice(0, 16)
        : "",
      location: event.location,
      address: event.address || "",
      price: event.price,
      category: event.category,
      maxParticipants: event.maxParticipants || "",
      registrationRequired: event.registrationRequired || false,
      registrationDeadline: event.registrationDeadline
        ? new Date(event.registrationDeadline).toISOString().slice(0, 10)
        : "",
    });
    setShowEventForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const eventData = {
        ...formData,
        price: parseFloat(formData.price),
        maxParticipants: formData.maxParticipants
          ? parseInt(formData.maxParticipants)
          : undefined,
      };

      if (editingEvent) {
        await eventService.updateEvent(editingEvent._id, eventData);
        alert("✅ Événement modifié avec succès !");
      } else {
        await eventService.createEvent(eventData);
        alert("✅ Événement créé et soumis pour validation !");
      }

      setShowEventForm(false);
      loadEvents();
    } catch (error) {
      console.error("Erreur soumission:", error);
      alert("❌ Erreur lors de la soumission");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) return;

    try {
      await eventService.deleteEvent(eventId);
      alert("✅ Événement supprimé");
      loadEvents();
    } catch (error) {
      console.error("Erreur suppression:", error);
      alert("❌ Erreur lors de la suppression");
    }
  };

  return (
  <div className="min-h-screen bg-light_orange-900">
      {/* Header */}
  <header className="bg-white shadow-sm border-b border-chocolate_cosmos-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-chocolate_cosmos">
                Dashboard {user?.bdeId?.name}
              </h1>
              <p className="text-sm text-chocolate_cosmos-400 mt-1">
                Bienvenue, {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="text-chocolate_cosmos-600 hover:text-chocolate_cosmos-900 px-4 py-2 rounded-lg hover:bg-light_orange-100"
              >
                🏠 Accueil
              </button>
              <button
                onClick={handleLogout}
                className="bg-raspberry_rose-600 text-white px-4 py-2 rounded-lg hover:bg-raspberry_rose-700"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-chocolate_cosmos-900">
            Mes événements ({events.length})
          </h2>
          <button
            onClick={openCreateForm}
            className="bg-raspberry_rose text-white px-6 py-2 rounded-lg hover:bg-raspberry_rose-600 font-medium"
          >
            ➕ Nouvel événement
          </button>
        </div>

        {/* Events List */}
        {loading ? (
            <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-raspberry_rose"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-chocolate_cosmos-400 text-lg mb-4">Aucun événement créé</p>
            <button
              onClick={openCreateForm}
              className="bg-raspberry_rose text-white px-6 py-2 rounded-lg hover:bg-raspberry_rose-600"
            >
              Créer mon premier événement
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-chocolate_cosmos">
                        {event.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          event.status === "PUBLISHED"
                            ? "bg-salmon_pink-900 text-salmon_pink"
                            : event.status === "PENDING"
                            ? "bg-light_orange-900 text-chocolate_cosmos"
                            : "bg-chocolate_cosmos-900 text-chocolate_cosmos"
                        }`}
                      >
                        {EVENT_STATUS[event.status]?.label}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-raspberry_rose-900 text-raspberry_rose">
                        {EVENT_CATEGORIES[event.category]?.label}
                      </span>
                    </div>
                    <p className="text-chocolate_cosmos-400 mb-4">
                      {event.shortDescription || event.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-chocolate_cosmos-400">📅 Date:</span>
                        <span className="ml-2 font-medium">
                          {formatDate(event.date)} à{" "}
                          {formatTime(event.startDate)}
                        </span>
                      </div>
                      <div>
                        <span className="text-chocolate_cosmos-400">📍 Lieu:</span>
                        <span className="ml-2 font-medium">
                          {event.location}
                        </span>
                      </div>
                      <div>
                        <span className="text-chocolate_cosmos-400">💰 Prix:</span>
                        <span className="ml-2 font-medium">
                          {event.price === 0 ? "Gratuit" : `${event.price} €`}
                        </span>
                      </div>
                      {event.status === "REJECTED" && event.rejectionReason && (
                        <div className="col-span-2">
                          <span className="text-chocolate_cosmos-700">
                            ❌ Raison du rejet:
                          </span>
                          <span className="ml-2 text-chocolate_cosmos font-medium">
                            {event.rejectionReason}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-6">
                    {event.status === "PENDING" && (
                      <button
                        onClick={() => openEditForm(event)}
                        className="bg-raspberry_rose text-white px-4 py-2 rounded-lg hover:bg-raspberry_rose-600 whitespace-nowrap"
                      >
                        ✏️ Modifier
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="bg-raspberry_rose-600 text-white px-4 py-2 rounded-lg hover:bg-raspberry_rose-700 whitespace-nowrap"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Event Form Modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8">
            <div className="px-6 py-4 border-b border-chocolate_cosmos-200">
              <h3 className="text-lg font-semibold text-chocolate_cosmos-900">
                {editingEvent ? "Modifier l'événement" : "Nouvel événement"}
              </h3>
            </div>
            <form
              onSubmit={handleSubmit}
              className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto"
            >
              <div>
                <label className="block text-sm font-medium text-chocolate_cosmos-700 mb-1">
                  Titre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full border border-chocolate_cosmos-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blush-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-chocolate_cosmos-700 mb-1">
                  Description courte
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shortDescription: e.target.value,
                    })
                  }
                  className="w-full border border-chocolate_cosmos-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blush-500"
                  placeholder="Résumé en une ligne"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-chocolate_cosmos-700 mb-1">
                  Description complète *
                </label>
                <textarea
                  required
                  rows="4"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border border-chocolate_cosmos-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blush-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-chocolate_cosmos-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date: e.target.value,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full border border-chocolate_cosmos-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blush-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-chocolate_cosmos-700 mb-1">
                    Fin
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full border border-chocolate_cosmos-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blush-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-chocolate_cosmos-700 mb-1">
                    Lieu *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full border border-chocolate_cosmos-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blush-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-chocolate_cosmos-700 mb-1">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full border border-chocolate_cosmos-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blush-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-chocolate_cosmos-700 mb-1">
                    Prix (€) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full border border-chocolate_cosmos-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blush-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-chocolate_cosmos-700 mb-1">
                    Catégorie *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full border border-chocolate_cosmos-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blush-500"
                  >
                    {Object.entries(EVENT_CATEGORIES).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="registration"
                  checked={formData.registrationRequired}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registrationRequired: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blush-600 focus:ring-blush-500 border-chocolate_cosmos-300 rounded"
                />
                <label
                  htmlFor="registration"
                  className="ml-2 block text-sm text-chocolate_cosmos-900"
                >
                  Inscription requise
                </label>
              </div>

              {formData.registrationRequired && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-chocolate_cosmos-700 mb-1">
                      Places max
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxParticipants}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxParticipants: e.target.value,
                        })
                      }
                      className="w-full border border-chocolate_cosmos-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blush-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-chocolate_cosmos-700 mb-1">
                      Date limite inscription
                    </label>
                    <input
                      type="date"
                      value={formData.registrationDeadline}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          registrationDeadline: e.target.value,
                        })
                      }
                      className="w-full border border-chocolate_cosmos-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blush-500"
                    />
                  </div>
                </div>
              )}
            </form>
            <div className="px-6 py-4 bg-light_orange-50 flex justify-end space-x-3 border-t border-chocolate_cosmos-200">
              <button
                type="button"
                onClick={() => setShowEventForm(false)}
                disabled={submitLoading}
                className="px-4 py-2 border border-chocolate_cosmos-300 rounded-lg text-chocolate_cosmos-700 hover:bg-light_orange-100 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitLoading}
                className="px-4 py-2 bg-raspberry_rose text-white rounded-lg hover:bg-raspberry_rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading
                  ? "Enregistrement..."
                  : editingEvent
                  ? "Modifier"
                  : "Créer et soumettre"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
