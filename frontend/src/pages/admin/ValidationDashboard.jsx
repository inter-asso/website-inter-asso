import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import validationService from '../../services/validationService';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { EVENT_STATUS } from '../../utils/constants';

export default function ValidationDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pendingEvents, setPendingEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // pending, all, stats
  const [filters, setFilters] = useState({
    status: '',
    bdeId: '',
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'pending') {
        const data = await validationService.getPendingEvents();
        setPendingEvents(data);
      } else if (activeTab === 'all') {
        const data = await validationService.getAllEvents(filters);
        setAllEvents(data);
      } else if (activeTab === 'stats') {
        const data = await validationService.getValidationStats();
        setStats(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, filters]);

  const handleValidate = async (eventId) => {
    if (!confirm('Êtes-vous sûr de vouloir valider cet événement ?')) return;

    setActionLoading(true);
    try {
      await validationService.validateEvent(eventId);
      alert('✅ Événement validé avec succès !');
      loadData();
    } catch (error) {
      console.error('Erreur validation:', error);
      alert('❌ Erreur lors de la validation');
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectModal = (event) => {
    setSelectedEvent(event);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Veuillez indiquer une raison de rejet');
      return;
    }

    setActionLoading(true);
    try {
      await validationService.rejectEvent(selectedEvent._id, rejectionReason);
      alert('✅ Événement rejeté');
      setShowRejectModal(false);
      setSelectedEvent(null);
      setRejectionReason('');
      loadData();
    } catch (error) {
      console.error('Erreur rejet:', error);
      alert('❌ Erreur lors du rejet');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin Interasso</h1>
              <p className="text-sm text-gray-600 mt-1">
                Bienvenue, {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
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
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ⏳ En attente
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📋 Tous les événements
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'stats'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 Statistiques
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
            {activeTab === 'pending' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Événements en attente de validation ({pendingEvents.length})
                </h2>
                {pendingEvents.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500 text-lg">✅ Aucun événement en attente</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingEvents.map((event) => (
                      <div key={event._id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                              <span
                                className="px-2 py-1 text-xs font-medium rounded-full"
                                style={{
                                  backgroundColor: event.bdeId?.colors?.primary + '20',
                                  color: event.bdeId?.colors?.primary,
                                }}
                              >
                                {event.bdeId?.name}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-4">{event.shortDescription || event.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">📅 Date:</span>
                                <span className="ml-2 font-medium">
                                  {formatDate(event.date)} à {formatTime(event.startDate)}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">📍 Lieu:</span>
                                <span className="ml-2 font-medium">{event.location}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">💰 Prix:</span>
                                <span className="ml-2 font-medium">
                                  {event.price === 0 ? 'Gratuit' : `${event.price} €`}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">👤 Créé par:</span>
                                <span className="ml-2 font-medium">
                                  {event.createdBy?.firstName} {event.createdBy?.lastName}
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
            {activeTab === 'all' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Tous les événements ({allEvents.length})
                  </h2>
                  <div className="flex space-x-4">
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
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
                            <div className="font-medium text-gray-900">{event.title}</div>
                            <div className="text-sm text-gray-500">{event.location}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{event.bdeId?.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {formatDate(event.date)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                event.status === 'PUBLISHED'
                                  ? 'bg-green-100 text-green-800'
                                  : event.status === 'PENDING'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
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
            {activeTab === 'stats' && stats && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Statistiques de validation</h2>
                
                {/* Global Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-3xl mb-2">📊</div>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalEvents}</div>
                    <div className="text-sm text-gray-600">Total événements</div>
                  </div>
                  <div className="bg-green-50 rounded-lg shadow p-6">
                    <div className="text-3xl mb-2">✅</div>
                    <div className="text-2xl font-bold text-green-600">{stats.publishedEvents}</div>
                    <div className="text-sm text-gray-600">Publiés</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg shadow p-6">
                    <div className="text-3xl mb-2">⏳</div>
                    <div className="text-2xl font-bold text-yellow-600">{stats.pendingEvents}</div>
                    <div className="text-sm text-gray-600">En attente</div>
                  </div>
                  <div className="bg-red-50 rounded-lg shadow p-6">
                    <div className="text-3xl mb-2">❌</div>
                    <div className="text-2xl font-bold text-red-600">{stats.rejectedEvents}</div>
                    <div className="text-sm text-gray-600">Rejetés</div>
                  </div>
                </div>

                {/* Stats by BDE */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Statistiques par BDE</h3>
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
                          <tr key={bdeStats.bdeId?._id} className="hover:bg-gray-50">
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
          </>
        )}
      </main>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Rejeter l'événement</h3>
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
                  setRejectionReason('');
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
                {actionLoading ? 'Rejet en cours...' : 'Confirmer le rejet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
