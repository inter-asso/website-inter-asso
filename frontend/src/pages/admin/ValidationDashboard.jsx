import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import validationService from "../../services/validationService";
import partnerService from "../../services/partnerService";
import bdeService from "../../services/bdeService";
import eventService from "../../services/eventService";
import { formatDate, formatTime } from "../../utils/dateUtils";
import { EVENT_STATUS } from "../../utils/constants";

export default function ValidationDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pendingEvents, setPendingEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [partners, setPartners] = useState([]);
  const [bdes, setBdes] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending"); // pending, all, stats, partners, bdes, events
  const [filters, setFilters] = useState({
    status: "",
    bdeId: "",
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [partnerForm, setPartnerForm] = useState({
    name: "",
    category: "restauration",
    logo: { url: "", publicId: "" },
    website: "",
    description: "",
    advantages: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
    },
    isActive: true,
    displayOrder: 0,
  });
  const [showBDEModal, setShowBDEModal] = useState(false);
  const [selectedBDE, setSelectedBDE] = useState(null);
  const [bdeForm, setBdeForm] = useState({
    name: "",
    fullName: "",
    description: "",
    logo: { url: "", publicId: "" },
    colors: {
      primary: "#6366f1",
      secondary: "#8b5cf6",
    },
    socialLinks: {
      instagram: "",
      facebook: "",
      twitter: "",
      email: "",
    },
    contactEmail: "",
    displayOrder: 0,
  });
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEventForEdit, setSelectedEventForEdit] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "soirée",
    status: "pending",
    price: 0,
    maxParticipants: 0,
    image: { url: "", publicId: "" },
    registrationDeadline: "",
    bdeId: "",
  });
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === "pending") {
        const data = await validationService.getPendingEvents();
        setPendingEvents(data);
      } else if (activeTab === "all") {
        const data = await validationService.getAllEvents(filters);
        setAllEvents(data);
      } else if (activeTab === "stats") {
        const data = await validationService.getValidationStats();
        console.log("📊 Stats reçues:", data);
        setStats(data);
      } else if (activeTab === "partners") {
        const data = await partnerService.getAllPartners();
        setPartners(data);
      } else if (activeTab === "bdes") {
        const data = await bdeService.getAllBDEs();
        setBdes(data);
      } else if (activeTab === "events") {
        const data = await eventService.getAllEvents();
        setEvents(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, filters]);

  const handleValidate = async (eventId) => {
    if (!confirm("Êtes-vous sûr de vouloir valider cet événement ?")) return;

    setActionLoading(true);
    try {
      await validationService.validateEvent(eventId);
      alert("✅ Événement validé avec succès !");
      loadData();
    } catch (error) {
      console.error("Erreur validation:", error);
      alert("❌ Erreur lors de la validation");
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectModal = (event) => {
    setSelectedEvent(event);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Veuillez indiquer une raison de rejet");
      return;
    }

    setActionLoading(true);
    try {
      await validationService.rejectEvent(selectedEvent._id, rejectionReason);
      alert("✅ Événement rejeté");
      setShowRejectModal(false);
      setSelectedEvent(null);
      setRejectionReason("");
      loadData();
    } catch (error) {
      console.error("Erreur rejet:", error);
      alert("❌ Erreur lors du rejet");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // === GESTION DES PARTENAIRES ===
  const openPartnerModal = (partner = null) => {
    if (partner) {
      setSelectedPartner(partner);
      setPartnerForm({
        name: partner.name || "",
        category: partner.category || "restauration",
        logo: partner.logo || { url: "", publicId: "" },
        website: partner.website || "",
        description: partner.description || "",
        advantages: partner.advantages || "",
        contactEmail: partner.contactEmail || "",
        contactPhone: partner.contactPhone || "",
        address: partner.address || "",
        socialLinks: partner.socialLinks || {
          facebook: "",
          instagram: "",
          twitter: "",
        },
        isActive: partner.isActive ?? true,
        displayOrder: partner.displayOrder || 0,
      });
    } else {
      setSelectedPartner(null);
      setPartnerForm({
        name: "",
        category: "restauration",
        logo: { url: "", publicId: "" },
        website: "",
        description: "",
        advantages: "",
        contactEmail: "",
        contactPhone: "",
        address: "",
        socialLinks: {
          facebook: "",
          instagram: "",
          twitter: "",
        },
        isActive: true,
        displayOrder: 0,
      });
    }
    setShowPartnerModal(true);
  };

  const handleSavePartner = async () => {
    if (!partnerForm.name.trim()) {
      alert("Le nom du partenaire est requis");
      return;
    }
    if (!partnerForm.logo.url) {
      alert("Le logo est requis");
      return;
    }

    // S'assurer que publicId n'est pas vide
    const dataToSend = {
      ...partnerForm,
      logo: {
        url: partnerForm.logo.url,
        publicId: partnerForm.logo.publicId || "manual-upload-" + Date.now(),
      },
    };

    console.log("📤 Envoi des données partenaire:", dataToSend);

    setActionLoading(true);
    try {
      if (selectedPartner) {
        await partnerService.updatePartner(selectedPartner._id, dataToSend);
        alert("✅ Partenaire modifié avec succès !");
      } else {
        await partnerService.createPartner(dataToSend);
        alert("✅ Partenaire créé avec succès !");
      }
      setShowPartnerModal(false);
      setSelectedPartner(null);
      loadData();
    } catch (error) {
      console.error("Erreur sauvegarde partenaire:", error);
      alert(
        `❌ Erreur lors de la sauvegarde: ${
          error.response?.data?.details || error.message
        }`
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePartner = async (partnerId, partnerName) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${partnerName}" ?`))
      return;

    setActionLoading(true);
    try {
      await partnerService.deletePartner(partnerId);
      alert("✅ Partenaire supprimé avec succès !");
      loadData();
    } catch (error) {
      console.error("Erreur suppression partenaire:", error);
      alert("❌ Erreur lors de la suppression");
    } finally {
      setActionLoading(false);
    }
  };

  // === GESTION DES BDE ===
  const openBDEModal = (bde = null) => {
    if (bde) {
      setSelectedBDE(bde);
      setBdeForm({
        name: bde.name || "",
        fullName: bde.fullName || "",
        description: bde.description || "",
        logo: bde.logo || { url: "", publicId: "" },
        colors: bde.colors || {
          primary: "#6366f1",
          secondary: "#8b5cf6",
        },
        socialLinks: bde.socialLinks || {
          instagram: "",
          facebook: "",
          twitter: "",
          email: "",
        },
        contactEmail: bde.contactEmail || "",
        displayOrder: bde.displayOrder || 0,
      });
    } else {
      setSelectedBDE(null);
      setBdeForm({
        name: "",
        fullName: "",
        description: "",
        logo: { url: "", publicId: "" },
        colors: {
          primary: "#6366f1",
          secondary: "#8b5cf6",
        },
        socialLinks: {
          instagram: "",
          facebook: "",
          twitter: "",
          email: "",
        },
        contactEmail: "",
        displayOrder: 0,
      });
    }
    setShowBDEModal(true);
  };

  const handleSaveBDE = async () => {
    if (!bdeForm.name.trim()) {
      alert("Le nom du BDE est requis");
      return;
    }
    if (!bdeForm.fullName.trim()) {
      alert("Le nom complet est requis");
      return;
    }
    if (!bdeForm.description.trim()) {
      alert("La description est requise");
      return;
    }
    if (!bdeForm.logo.url) {
      alert("Le logo est requis");
      return;
    }
    if (!bdeForm.contactEmail.trim()) {
      alert("L'email de contact est requis");
      return;
    }

    // S'assurer que publicId n'est pas vide
    const dataToSend = {
      ...bdeForm,
      logo: {
        url: bdeForm.logo.url,
        publicId: bdeForm.logo.publicId || "manual-upload-" + Date.now(),
      },
    };

    console.log("📤 Envoi des données BDE:", dataToSend);

    setActionLoading(true);
    try {
      if (selectedBDE) {
        await bdeService.updateBDE(selectedBDE._id, dataToSend);
        alert("✅ BDE modifié avec succès !");
      } else {
        await bdeService.createBDE(dataToSend);
        alert("✅ BDE créé avec succès !");
      }
      setShowBDEModal(false);
      setSelectedBDE(null);
      loadData();
    } catch (error) {
      console.error("Erreur sauvegarde BDE:", error);
      alert(
        `❌ Erreur lors de la sauvegarde: ${
          error.response?.data?.details || error.message
        }`
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBDE = async (bdeId, bdeName) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${bdeName}" ?`)) return;

    setActionLoading(true);
    try {
      await bdeService.deleteBDE(bdeId);
      alert("✅ BDE supprimé avec succès !");
      loadData();
    } catch (error) {
      console.error("Erreur suppression BDE:", error);
      alert(
        `❌ Erreur lors de la suppression: ${
          error.response?.data?.error || error.message
        }`
      );
    } finally {
      setActionLoading(false);
    }
  };

  // === GESTION DES ÉVÉNEMENTS ===
  const openEventModal = (event = null) => {
    if (event) {
      setSelectedEventForEdit(event);
      // Formater la date pour l'input datetime-local (YYYY-MM-DDTHH:mm)
      const eventDate = new Date(event.date);
      const formattedDate = eventDate.toISOString().slice(0, 16);
      const registrationDate = event.registrationDeadline
        ? new Date(event.registrationDeadline).toISOString().slice(0, 16)
        : "";

      setEventForm({
        title: event.title || "",
        description: event.description || "",
        date: formattedDate,
        location: event.location || "",
        category: event.category || "soirée",
        status: event.status || "pending",
        price: event.price || 0,
        maxParticipants: event.maxParticipants || 0,
        image: event.image || { url: "", publicId: "" },
        registrationDeadline: registrationDate,
        bdeId: event.bdeId?._id || event.bdeId || "",
      });
    } else {
      setSelectedEventForEdit(null);
      setEventForm({
        title: "",
        description: "",
        date: "",
        location: "",
        category: "soirée",
        status: "pending",
        price: 0,
        maxParticipants: 0,
        image: { url: "", publicId: "" },
        registrationDeadline: "",
        bdeId: "",
      });
    }
    setShowEventModal(true);
  };

  const handleSaveEvent = async () => {
    // Validation
    if (
      !eventForm.title.trim() ||
      !eventForm.description.trim() ||
      !eventForm.date ||
      !eventForm.location.trim() ||
      !eventForm.bdeId
    ) {
      alert("❌ Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Vérifier que l'URL de l'image a un publicId
    if (eventForm.image.url && !eventForm.image.publicId) {
      eventForm.image.publicId =
        eventForm.image.url.split("/").pop()?.split("?")[0] ||
        `event-${Date.now()}`;
    }

    setActionLoading(true);
    try {
      const payload = {
        ...eventForm,
        price: parseFloat(eventForm.price) || 0,
        maxParticipants: parseInt(eventForm.maxParticipants) || 0,
      };

      if (selectedEventForEdit) {
        await eventService.updateEvent(selectedEventForEdit._id, payload);
        alert("✅ Événement modifié avec succès !");
      } else {
        await eventService.createEvent(payload);
        alert("✅ Événement créé avec succès !");
      }

      setShowEventModal(false);
      setSelectedEventForEdit(null);
      loadData();
    } catch (error) {
      console.error("Erreur sauvegarde événement:", error);
      alert(
        `❌ Erreur lors de la sauvegarde: ${
          error.response?.data?.details || error.message
        }`
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId, eventTitle) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${eventTitle}" ?`))
      return;

    setActionLoading(true);
    try {
      await eventService.deleteEvent(eventId);
      alert("✅ Événement supprimé avec succès !");
      loadData();
    } catch (error) {
      console.error("Erreur suppression événement:", error);
      alert(
        `❌ Erreur lors de la suppression: ${
          error.response?.data?.error || error.message
        }`
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard Admin Interasso
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Bienvenue, {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                🏠 Accueil
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("pending")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "pending"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              ⏳ En attente
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "all"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              📋 Tous les événements
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "stats"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              📊 Statistiques
            </button>
            <button
              onClick={() => setActiveTab("partners")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "partners"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              🤝 Partenaires
            </button>
            <button
              onClick={() => setActiveTab("bdes")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "bdes"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              🎓 BDE
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "events"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              📅 Événements
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            {/* Pending Events Tab */}
            {activeTab === "pending" && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Événements en attente de validation ({pendingEvents.length})
                </h2>
                {pendingEvents.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500 text-lg">
                      ✅ Aucun événement en attente
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingEvents.map((event) => (
                      <div
                        key={event._id}
                        className="bg-white rounded-lg shadow p-6"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">
                                {event.title}
                              </h3>
                              <span
                                className="px-2 py-1 text-xs font-medium rounded-full"
                                style={{
                                  backgroundColor:
                                    event.bdeId?.colors?.primary + "20",
                                  color: event.bdeId?.colors?.primary,
                                }}
                              >
                                {event.bdeId?.name}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-4">
                              {event.shortDescription || event.description}
                            </p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">📅 Date:</span>
                                <span className="ml-2 font-medium">
                                  {formatDate(event.date)} à{" "}
                                  {formatTime(event.startDate)}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">📍 Lieu:</span>
                                <span className="ml-2 font-medium">
                                  {event.location}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">💰 Prix:</span>
                                <span className="ml-2 font-medium">
                                  {event.price === 0
                                    ? "Gratuit"
                                    : `${event.price} €`}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">
                                  👤 Créé par:
                                </span>
                                <span className="ml-2 font-medium">
                                  {event.createdBy?.firstName}{" "}
                                  {event.createdBy?.lastName}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2 ml-6">
                            <button
                              onClick={() => handleValidate(event._id)}
                              disabled={actionLoading}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                              ✅ Valider
                            </button>
                            <button
                              onClick={() => openRejectModal(event)}
                              disabled={actionLoading}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                              ❌ Rejeter
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* All Events Tab */}
            {activeTab === "all" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Tous les événements ({allEvents.length})
                  </h2>
                  <div className="flex space-x-4">
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        setFilters({ ...filters, status: e.target.value })
                      }
                      className="border border-gray-300 rounded-lg px-4 py-2"
                    >
                      <option value="">Tous les statuts</option>
                      <option value="PENDING">En attente</option>
                      <option value="PUBLISHED">Publiés</option>
                      <option value="REJECTED">Rejetés</option>
                    </select>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Événement
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          BDE
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allEvents.map((event) => (
                        <tr key={event._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">
                              {event.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {event.location}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {event.bdeId?.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {formatDate(event.date)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                event.status === "PUBLISHED"
                                  ? "bg-green-100 text-green-800"
                                  : event.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {EVENT_STATUS[event.status]?.label}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === "stats" && stats && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Statistiques de validation
                </h2>

                {/* Global Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-3xl mb-2">📊</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.totalEvents}
                    </div>
                    <div className="text-sm text-gray-600">
                      Total événements
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg shadow p-6">
                    <div className="text-3xl mb-2">✅</div>
                    <div className="text-2xl font-bold text-green-600">
                      {stats.publishedEvents}
                    </div>
                    <div className="text-sm text-gray-600">Publiés</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg shadow p-6">
                    <div className="text-3xl mb-2">⏳</div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {stats.pendingEvents}
                    </div>
                    <div className="text-sm text-gray-600">En attente</div>
                  </div>
                  <div className="bg-red-50 rounded-lg shadow p-6">
                    <div className="text-3xl mb-2">❌</div>
                    <div className="text-2xl font-bold text-red-600">
                      {stats.rejectedEvents}
                    </div>
                    <div className="text-sm text-gray-600">Rejetés</div>
                  </div>
                </div>

                {/* Stats by BDE */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Statistiques par BDE
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            BDE
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                            Total
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                            Publiés
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                            En attente
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                            Rejetés
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stats.byBDE?.map((bdeStats) => (
                          <tr
                            key={bdeStats.bdeId?._id}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 font-medium text-gray-900">
                              {bdeStats.bdeId?.name}
                            </td>
                            <td className="px-6 py-4 text-center text-gray-900">
                              {bdeStats.total}
                            </td>
                            <td className="px-6 py-4 text-center text-green-600 font-medium">
                              {bdeStats.published}
                            </td>
                            <td className="px-6 py-4 text-center text-yellow-600 font-medium">
                              {bdeStats.pending}
                            </td>
                            <td className="px-6 py-4 text-center text-red-600 font-medium">
                              {bdeStats.rejected}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Partners Tab */}
            {activeTab === "partners" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Gestion des partenaires ({partners.length})
                  </h2>
                  <button
                    onClick={() => openPartnerModal()}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                  >
                    <span>➕</span>
                    <span>Ajouter un partenaire</span>
                  </button>
                </div>

                {partners.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500 text-lg">
                      Aucun partenaire enregistré
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {partners.map((partner) => (
                      <div
                        key={partner._id}
                        className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow"
                      >
                        {/* Logo */}
                        {partner.logo?.url && (
                          <div className="h-40 bg-gray-100 flex items-center justify-center p-4">
                            <img
                              src={partner.logo.url}
                              alt={partner.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-bold text-gray-900">
                              {partner.name}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                partner.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {partner.isActive ? "Actif" : "Inactif"}
                            </span>
                          </div>

                          <div className="mb-3">
                            <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                              {partner.category}
                            </span>
                          </div>

                          {partner.description && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                              {partner.description}
                            </p>
                          )}

                          {partner.advantages && (
                            <div className="mb-4 p-3 bg-green-50 rounded-lg">
                              <p className="text-sm text-green-800 font-medium">
                                🎁 {partner.advantages}
                              </p>
                            </div>
                          )}

                          {/* Contact Info */}
                          <div className="space-y-2 mb-4 text-sm text-gray-600">
                            {partner.contactEmail && (
                              <div className="flex items-center">
                                <span className="mr-2">📧</span>
                                <span className="truncate">
                                  {partner.contactEmail}
                                </span>
                              </div>
                            )}
                            {partner.contactPhone && (
                              <div className="flex items-center">
                                <span className="mr-2">📞</span>
                                <span>{partner.contactPhone}</span>
                              </div>
                            )}
                            {partner.address && (
                              <div className="flex items-center">
                                <span className="mr-2">📍</span>
                                <span className="truncate">
                                  {partner.address}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex space-x-2 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => openPartnerModal(partner)}
                              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm"
                            >
                              ✏️ Modifier
                            </button>
                            <button
                              onClick={() =>
                                handleDeletePartner(partner._id, partner.name)
                              }
                              disabled={actionLoading}
                              className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 text-sm disabled:opacity-50"
                            >
                              🗑️ Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* BDE Tab */}
            {activeTab === "bdes" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Gestion des BDE ({bdes.length})
                  </h2>
                  <button
                    onClick={() => openBDEModal()}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                  >
                    <span>+</span>
                    <span>Ajouter un BDE</span>
                  </button>
                </div>

                {bdes.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500 text-lg">
                      Aucun BDE enregistré
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bdes.map((bde) => (
                      <div
                        key={bde._id}
                        className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow"
                      >
                        {/* Logo */}
                        {bde.logo?.url && (
                          <div
                            className="h-40 flex items-center justify-center p-6"
                            style={{
                              background: `linear-gradient(135deg, ${
                                bde.colors?.primary || "#6366f1"
                              } 0%, ${
                                bde.colors?.secondary || "#8b5cf6"
                              } 100%)`,
                            }}
                          >
                            <img
                              src={bde.logo.url}
                              alt={bde.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {bde.name}
                          </h3>

                          <p className="text-sm text-gray-600 mb-3 font-medium">
                            {bde.fullName}
                          </p>

                          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                            {bde.description}
                          </p>

                          {/* Contact Info */}
                          <div className="space-y-2 mb-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <span className="mr-2">📧</span>
                              <span className="truncate">
                                {bde.contactEmail}
                              </span>
                            </div>
                            {(bde.socialLinks?.instagram ||
                              bde.socialLinks?.facebook) && (
                              <div className="flex items-center space-x-2">
                                <span className="mr-2">🔗</span>
                                {bde.socialLinks.instagram && (
                                  <a
                                    href={bde.socialLinks.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-pink-600 hover:text-pink-700"
                                  >
                                    Instagram
                                  </a>
                                )}
                                {bde.socialLinks.facebook && (
                                  <a
                                    href={bde.socialLinks.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-700"
                                  >
                                    Facebook
                                  </a>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Colors */}
                          <div className="flex items-center space-x-2 mb-4">
                            <span className="text-xs text-gray-500">
                              Couleurs :
                            </span>
                            <div
                              className="w-6 h-6 rounded-full border-2 border-gray-200"
                              style={{
                                backgroundColor: bde.colors?.primary,
                              }}
                              title={bde.colors?.primary}
                            ></div>
                            <div
                              className="w-6 h-6 rounded-full border-2 border-gray-200"
                              style={{
                                backgroundColor: bde.colors?.secondary,
                              }}
                              title={bde.colors?.secondary}
                            ></div>
                          </div>

                          {/* Actions */}
                          <div className="flex space-x-2 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => openBDEModal(bde)}
                              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm"
                            >
                              ✏️ Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteBDE(bde._id, bde.name)}
                              disabled={actionLoading}
                              className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 text-sm disabled:opacity-50"
                            >
                              🗑️ Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Events Tab */}
            {activeTab === "events" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Gestion des événements ({events.length})
                  </h2>
                  <button
                    onClick={() => openEventModal()}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    ➕ Ajouter un événement
                  </button>
                </div>

                {events.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-gray-500">Aucun événement trouvé.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                      <div
                        key={event._id}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                      >
                        {/* Image */}
                        {event.image?.url && (
                          <div className="h-48 overflow-hidden bg-gray-200">
                            <img
                              src={event.image.url}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div className="p-4">
                          {/* Status Badge */}
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                event.status === "PUBLISHED"
                                  ? "bg-green-100 text-green-800"
                                  : event.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {event.status === "PUBLISHED"
                                ? "✅ Publié"
                                : event.status === "PENDING"
                                ? "⏳ En attente"
                                : "❌ Rejeté"}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {event.category}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {event.title}
                          </h3>

                          {/* Description */}
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {event.description}
                          </p>

                          {/* BDE */}
                          {event.bdeId && (
                            <p className="text-xs text-gray-500 mb-2">
                              🎓 {event.bdeId.name || event.bdeId.fullName}
                            </p>
                          )}

                          {/* Date & Location */}
                          <div className="space-y-1 text-sm text-gray-600 mb-3">
                            <p className="flex items-center">
                              📅 {formatDate(event.date)} à{" "}
                              {formatTime(event.date)}
                            </p>
                            <p className="flex items-center">
                              📍 {event.location}
                            </p>
                            {event.price > 0 && (
                              <p className="flex items-center font-semibold text-purple-600">
                                💰 {event.price}€
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex space-x-2 pt-3 border-t border-gray-200">
                            <button
                              onClick={() => openEventModal(event)}
                              disabled={actionLoading}
                              className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                              ✏️ Modifier
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteEvent(event._id, event.title)
                              }
                              disabled={actionLoading}
                              className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                              🗑️ Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Rejeter l'événement
              </h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600 mb-4">
                Événement : <strong>{selectedEvent?.title}</strong>
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raison du rejet *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Expliquez pourquoi cet événement est rejeté..."
              />
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedEvent(null);
                  setRejectionReason("");
                }}
                disabled={actionLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading || !rejectionReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? "Rejet en cours..." : "Confirmer le rejet"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Partner Modal */}
      {showPartnerModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedPartner
                  ? "Modifier le partenaire"
                  : "Ajouter un partenaire"}
              </h3>
            </div>
            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du partenaire *
                  </label>
                  <input
                    type="text"
                    value={partnerForm.name}
                    onChange={(e) =>
                      setPartnerForm({ ...partnerForm, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ex: Restaurant Le Gourmet"
                  />
                </div>

                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    value={partnerForm.category}
                    onChange={(e) =>
                      setPartnerForm({
                        ...partnerForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="restauration">Restauration</option>
                    <option value="culture">Culture</option>
                    <option value="sport">Sport</option>
                    <option value="commerce">Commerce</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                {/* Logo URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL du logo *
                  </label>
                  <input
                    type="url"
                    value={partnerForm.logo.url}
                    onChange={(e) => {
                      const url = e.target.value;
                      // Générer un publicId à partir de l'URL ou utiliser un identifiant unique
                      const publicId =
                        url.split("/").pop()?.split("?")[0] ||
                        `logo-${Date.now()}`;
                      setPartnerForm({
                        ...partnerForm,
                        logo: {
                          url: url,
                          publicId: publicId,
                        },
                      });
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://example.com/logo.png"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Entrez l'URL complète du logo (https://...)
                  </p>
                </div>

                {/* Site web */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site web
                  </label>
                  <input
                    type="url"
                    value={partnerForm.website}
                    onChange={(e) =>
                      setPartnerForm({
                        ...partnerForm,
                        website: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://example.com"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={partnerForm.description}
                    onChange={(e) =>
                      setPartnerForm({
                        ...partnerForm,
                        description: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Présentation du partenaire..."
                  />
                </div>

                {/* Avantages */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avantages offerts
                  </label>
                  <textarea
                    value={partnerForm.advantages}
                    onChange={(e) =>
                      setPartnerForm({
                        ...partnerForm,
                        advantages: e.target.value,
                      })
                    }
                    rows="2"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ex: -10% sur présentation de la carte étudiante"
                  />
                </div>

                {/* Contact */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={partnerForm.contactEmail}
                      onChange={(e) =>
                        setPartnerForm({
                          ...partnerForm,
                          contactEmail: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="contact@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={partnerForm.contactPhone}
                      onChange={(e) =>
                        setPartnerForm({
                          ...partnerForm,
                          contactPhone: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="01 23 45 67 89"
                    />
                  </div>
                </div>

                {/* Adresse */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={partnerForm.address}
                    onChange={(e) =>
                      setPartnerForm({
                        ...partnerForm,
                        address: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="12 rue de la République, 22300 Lannion"
                  />
                </div>

                {/* Réseaux sociaux */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Réseaux sociaux
                  </label>
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={partnerForm.socialLinks.facebook}
                      onChange={(e) =>
                        setPartnerForm({
                          ...partnerForm,
                          socialLinks: {
                            ...partnerForm.socialLinks,
                            facebook: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Facebook URL"
                    />
                    <input
                      type="url"
                      value={partnerForm.socialLinks.instagram}
                      onChange={(e) =>
                        setPartnerForm({
                          ...partnerForm,
                          socialLinks: {
                            ...partnerForm.socialLinks,
                            instagram: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Instagram URL"
                    />
                    <input
                      type="url"
                      value={partnerForm.socialLinks.twitter}
                      onChange={(e) =>
                        setPartnerForm({
                          ...partnerForm,
                          socialLinks: {
                            ...partnerForm.socialLinks,
                            twitter: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Twitter/X URL"
                    />
                  </div>
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={partnerForm.isActive}
                        onChange={(e) =>
                          setPartnerForm({
                            ...partnerForm,
                            isActive: e.target.checked,
                          })
                        }
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        Partenaire actif
                      </span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ordre d'affichage
                    </label>
                    <input
                      type="number"
                      value={partnerForm.displayOrder}
                      onChange={(e) =>
                        setPartnerForm({
                          ...partnerForm,
                          displayOrder: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowPartnerModal(false);
                  setSelectedPartner(null);
                }}
                disabled={actionLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSavePartner}
                disabled={
                  actionLoading ||
                  !partnerForm.name.trim() ||
                  !partnerForm.logo.url
                }
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading
                  ? "Sauvegarde..."
                  : selectedPartner
                  ? "Modifier"
                  : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BDE Modal */}
      {showBDEModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedBDE ? "Modifier le BDE" : "Ajouter un BDE"}
              </h3>
            </div>
            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                {/* Nom */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du BDE *
                    </label>
                    <input
                      type="text"
                      value={bdeForm.name}
                      onChange={(e) =>
                        setBdeForm({ ...bdeForm, name: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Ex: BDE MMI"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      value={bdeForm.fullName}
                      onChange={(e) =>
                        setBdeForm({ ...bdeForm, fullName: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Bureau Des Étudiants MMI"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description * (max 500 caractères)
                  </label>
                  <textarea
                    value={bdeForm.description}
                    onChange={(e) =>
                      setBdeForm({
                        ...bdeForm,
                        description: e.target.value,
                      })
                    }
                    rows="3"
                    maxLength="500"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Présentation du BDE..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {bdeForm.description.length}/500 caractères
                  </p>
                </div>

                {/* Logo URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL du logo *
                  </label>
                  <input
                    type="url"
                    value={bdeForm.logo.url}
                    onChange={(e) => {
                      const url = e.target.value;
                      const publicId =
                        url.split("/").pop()?.split("?")[0] ||
                        `logo-${Date.now()}`;
                      setBdeForm({
                        ...bdeForm,
                        logo: {
                          url: url,
                          publicId: publicId,
                        },
                      });
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                {/* Couleurs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Couleurs * (format hexadécimal)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Couleur primaire
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={bdeForm.colors.primary}
                          onChange={(e) =>
                            setBdeForm({
                              ...bdeForm,
                              colors: {
                                ...bdeForm.colors,
                                primary: e.target.value,
                              },
                            })
                          }
                          className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={bdeForm.colors.primary}
                          onChange={(e) =>
                            setBdeForm({
                              ...bdeForm,
                              colors: {
                                ...bdeForm.colors,
                                primary: e.target.value,
                              },
                            })
                          }
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="#6366f1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Couleur secondaire
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={bdeForm.colors.secondary}
                          onChange={(e) =>
                            setBdeForm({
                              ...bdeForm,
                              colors: {
                                ...bdeForm.colors,
                                secondary: e.target.value,
                              },
                            })
                          }
                          className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={bdeForm.colors.secondary}
                          onChange={(e) =>
                            setBdeForm({
                              ...bdeForm,
                              colors: {
                                ...bdeForm.colors,
                                secondary: e.target.value,
                              },
                            })
                          }
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="#8b5cf6"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email de contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de contact *
                  </label>
                  <input
                    type="email"
                    value={bdeForm.contactEmail}
                    onChange={(e) =>
                      setBdeForm({
                        ...bdeForm,
                        contactEmail: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="contact@bdemmi.fr"
                  />
                </div>

                {/* Réseaux sociaux */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Réseaux sociaux
                  </label>
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={bdeForm.socialLinks.instagram}
                      onChange={(e) =>
                        setBdeForm({
                          ...bdeForm,
                          socialLinks: {
                            ...bdeForm.socialLinks,
                            instagram: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Instagram URL"
                    />
                    <input
                      type="url"
                      value={bdeForm.socialLinks.facebook}
                      onChange={(e) =>
                        setBdeForm({
                          ...bdeForm,
                          socialLinks: {
                            ...bdeForm.socialLinks,
                            facebook: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Facebook URL"
                    />
                    <input
                      type="url"
                      value={bdeForm.socialLinks.twitter}
                      onChange={(e) =>
                        setBdeForm({
                          ...bdeForm,
                          socialLinks: {
                            ...bdeForm.socialLinks,
                            twitter: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Twitter/X URL"
                    />
                    <input
                      type="email"
                      value={bdeForm.socialLinks.email}
                      onChange={(e) =>
                        setBdeForm({
                          ...bdeForm,
                          socialLinks: {
                            ...bdeForm.socialLinks,
                            email: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Email public"
                    />
                  </div>
                </div>

                {/* Ordre d'affichage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordre d'affichage
                  </label>
                  <input
                    type="number"
                    value={bdeForm.displayOrder}
                    onChange={(e) =>
                      setBdeForm({
                        ...bdeForm,
                        displayOrder: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowBDEModal(false);
                  setSelectedBDE(null);
                }}
                disabled={actionLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveBDE}
                disabled={
                  actionLoading ||
                  !bdeForm.name.trim() ||
                  !bdeForm.fullName.trim() ||
                  !bdeForm.description.trim() ||
                  !bdeForm.logo.url ||
                  !bdeForm.contactEmail.trim()
                }
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading
                  ? "Sauvegarde..."
                  : selectedBDE
                  ? "Modifier"
                  : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedEventForEdit
                  ? "Modifier l'événement"
                  : "Ajouter un événement"}
              </h3>
            </div>
            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                {/* Titre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de l'événement *
                  </label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, title: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Soirée de rentrée 2024"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description * (max 1000 caractères)
                  </label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        description: e.target.value,
                      })
                    }
                    rows="4"
                    maxLength="1000"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Description de l'événement..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {eventForm.description.length}/1000 caractères
                  </p>
                </div>

                {/* Date et Lieu */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date et heure *
                    </label>
                    <input
                      type="datetime-local"
                      value={eventForm.date}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, date: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lieu *
                    </label>
                    <input
                      type="text"
                      value={eventForm.location}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, location: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Campus universitaire"
                    />
                  </div>
                </div>

                {/* Catégorie, BDE et Statut */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie *
                    </label>
                    <select
                      value={eventForm.category}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, category: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="soirée">Soirée</option>
                      <option value="sport">Sport</option>
                      <option value="culturel">Culturel</option>
                      <option value="associatif">Associatif</option>
                      <option value="conférence">Conférence</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      BDE organisateur *
                    </label>
                    <select
                      value={eventForm.bdeId}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, bdeId: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Sélectionnez un BDE</option>
                      {bdes.map((bde) => (
                        <option key={bde._id} value={bde._id}>
                          {bde.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut *
                    </label>
                    <select
                      value={eventForm.status}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, status: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="pending">⏳ En attente</option>
                      <option value="published">✅ Publié</option>
                      <option value="rejected">❌ Rejeté</option>
                    </select>
                  </div>
                </div>

                {/* Prix et Participants max */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix (€)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={eventForm.price}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre maximum de participants
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={eventForm.maxParticipants}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          maxParticipants: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="0 = illimité"
                    />
                  </div>
                </div>

                {/* Date limite d'inscription */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date limite d'inscription
                  </label>
                  <input
                    type="datetime-local"
                    value={eventForm.registrationDeadline}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        registrationDeadline: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de l'image
                  </label>
                  <input
                    type="url"
                    value={eventForm.image.url}
                    onChange={(e) => {
                      const url = e.target.value;
                      const publicId =
                        url.split("/").pop()?.split("?")[0] ||
                        `event-${Date.now()}`;
                      setEventForm({
                        ...eventForm,
                        image: {
                          url: url,
                          publicId: publicId,
                        },
                      });
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setSelectedEventForEdit(null);
                }}
                disabled={actionLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveEvent}
                disabled={
                  actionLoading ||
                  !eventForm.title.trim() ||
                  !eventForm.description.trim() ||
                  !eventForm.date ||
                  !eventForm.location.trim() ||
                  !eventForm.bdeId
                }
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading
                  ? "Sauvegarde..."
                  : selectedEventForEdit
                  ? "Modifier"
                  : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
