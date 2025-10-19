import Event from "../models/Event.js";
import BDE from "../models/BDE.js";
import User from "../models/User.js";
import notificationService from "../services/notificationService.js";

/**
 * @route   GET /api/validation/pending-events
 * @desc    Récupérer tous les événements en attente de validation
 * @access  Private - Admin Interasso uniquement
 */
export const getPendingEvents = async (req, res) => {
  try {
    // Seul Admin Interasso peut voir les événements en attente
    if (req.user.role !== "admin_interasso") {
      return res.status(403).json({
        success: false,
        error: "Accès refusé - Réservé aux administrateurs Interasso",
      });
    }

    const events = await Event.find({ status: "PENDING" })
      .populate("bdeId", "name slug logo colors")
      .populate("createdBy", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des événements en attente",
      details: error.message,
    });
  }
};

/**
 * @route   GET /api/validation/all-events
 * @desc    Récupérer tous les événements (tous statuts) pour admin Interasso
 * @access  Private - Admin Interasso uniquement
 */
export const getAllEvents = async (req, res) => {
  try {
    if (req.user.role !== "admin_interasso") {
      return res.status(403).json({
        success: false,
        error: "Accès refusé - Réservé aux administrateurs Interasso",
      });
    }

    const { status, bdeId } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (bdeId) filter.bdeId = bdeId;

    const events = await Event.find(filter)
      .populate("bdeId", "name slug logo colors")
      .populate("createdBy", "firstName lastName email")
      .populate("publishedBy", "firstName lastName")
      .populate("rejectedBy", "firstName lastName")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des événements",
      details: error.message,
    });
  }
};

/**
 * @route   PUT /api/validation/validate/:eventId
 * @desc    Valider un événement (passe en PUBLISHED)
 * @access  Private - Admin Interasso uniquement
 */
export const validateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Vérifier que c'est Admin Interasso
    if (req.user.role !== "admin_interasso") {
      return res.status(403).json({
        success: false,
        error:
          "Accès refusé - Seul un administrateur Interasso peut valider des événements",
      });
    }

    // Récupérer l'événement
    const event = await Event.findById(eventId)
      .populate("bdeId")
      .populate("createdBy");

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Événement non trouvé",
      });
    }

    // Vérifier que l'événement est en attente
    if (event.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        error: `Impossible de valider - Statut actuel: ${event.status}`,
      });
    }

    // Mettre à jour le statut
    event.status = "PUBLISHED";
    event.publishedAt = new Date();
    event.publishedBy = req.user.id;
    event.rejectionReason = undefined;
    event.rejectedAt = undefined;
    event.rejectedBy = undefined;

    await event.save();

    // Envoyer notification à l'Admin BDE créateur
    await notificationService.notifyEventValidated(
      event,
      event.bdeId,
      event.createdBy
    );

    // Log l'action
    console.log(
      `[ADMIN ACTION] VALIDATE_EVENT by ${req.user.email} (${req.user.role})`
    );

    console.log(`✅ Événement validé: "${event.title}" (${event.bdeId.name})`);

    res.json({
      success: true,
      message: "Événement validé et publié",
      event: await Event.findById(eventId)
        .populate("bdeId", "name slug logo colors")
        .populate("createdBy", "firstName lastName email")
        .populate("publishedBy", "firstName lastName"),
    });
  } catch (error) {
    console.error("❌ Erreur validation événement:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la validation de l'événement",
      details: error.message,
    });
  }
};

/**
 * @route   PUT /api/validation/reject/:eventId
 * @desc    Rejeter un événement (passe en REJECTED)
 * @access  Private - Admin Interasso uniquement
 */
export const rejectEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { reason } = req.body;

    // Vérifier que c'est Admin Interasso
    if (req.user.role !== "admin_interasso") {
      return res.status(403).json({
        success: false,
        error:
          "Accès refusé - Seul un administrateur Interasso peut rejeter des événements",
      });
    }

    // Validation de la raison
    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Une raison de rejet est requise",
      });
    }

    // Récupérer l'événement
    const event = await Event.findById(eventId)
      .populate("bdeId")
      .populate("createdBy");

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Événement non trouvé",
      });
    }

    // Vérifier que l'événement est en attente
    if (event.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        error: `Impossible de rejeter - Statut actuel: ${event.status}`,
      });
    }

    // Mettre à jour le statut
    event.status = "REJECTED";
    event.rejectionReason = reason.trim();
    event.rejectedAt = new Date();
    event.rejectedBy = req.user.id;
    event.publishedAt = undefined;
    event.publishedBy = undefined;

    await event.save();

    // Envoyer notification à l'Admin BDE créateur
    await notificationService.notifyEventRejected(
      event,
      event.bdeId,
      event.createdBy,
      reason
    );

    // Log l'action
    console.log(
      `[ADMIN ACTION] REJECT_EVENT by ${req.user.email} (${req.user.role}) - Reason: ${reason}`
    );

    console.log(`❌ Événement rejeté: "${event.title}" (${event.bdeId.name})`);

    res.json({
      success: true,
      message: "Événement rejeté",
      event: await Event.findById(eventId)
        .populate("bdeId", "name slug logo colors")
        .populate("createdBy", "firstName lastName email")
        .populate("rejectedBy", "firstName lastName"),
    });
  } catch (error) {
    console.error("❌ Erreur rejet événement:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors du rejet de l'événement",
      details: error.message,
    });
  }
};

/**
 * @route   GET /api/validation/stats
 * @desc    Statistiques de validation pour Admin Interasso
 * @access  Private - Admin Interasso uniquement
 */
export const getValidationStats = async (req, res) => {
  try {
    if (req.user.role !== "admin_interasso") {
      return res.status(403).json({
        success: false,
        error: "Accès refusé - Réservé aux administrateurs Interasso",
      });
    }

    const [pending, published, rejected, byBDE] = await Promise.all([
      Event.countDocuments({ status: "PENDING" }),
      Event.countDocuments({ status: "PUBLISHED" }),
      Event.countDocuments({ status: "REJECTED" }),
      Event.aggregate([
        {
          $group: {
            _id: "$bdeId",
            total: { $sum: 1 },
            pending: {
              $sum: { $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0] },
            },
            published: {
              $sum: { $cond: [{ $eq: ["$status", "PUBLISHED"] }, 1, 0] },
            },
            rejected: {
              $sum: { $cond: [{ $eq: ["$status", "REJECTED"] }, 1, 0] },
            },
          },
        },
      ]),
    ]);

    // Populate BDE info
    const bdeStats = await BDE.populate(byBDE, {
      path: "_id",
      select: "name slug logo",
    });

    // Reformater pour correspondre au format attendu par le frontend
    const formattedBdeStats = bdeStats.map((stat) => ({
      bdeId: stat._id,
      total: stat.total,
      pending: stat.pending,
      published: stat.published,
      rejected: stat.rejected,
    }));

    res.json({
      success: true,
      totalEvents: pending + published + rejected,
      pendingEvents: pending,
      publishedEvents: published,
      rejectedEvents: rejected,
      byBDE: formattedBdeStats,
    });
  } catch (error) {
    console.error("❌ Erreur récupération stats:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des statistiques",
      details: error.message,
    });
  }
};
