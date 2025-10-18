import Event from "../models/Event.js";
import BDE from "../models/BDE.js";
import notificationService from "../services/notificationService.js";
import { logAdminAction } from "../middleware/permissions.js";

/**
 * @route   GET /api/events
 * @desc    Récupérer tous les événements PUBLISHED (public)
 * @access  Public
 */
export const getEvents = async (req, res) => {
  try {
    const { bdeId, category, upcoming } = req.query;
    
    console.log("📥 Filtres reçus:", { bdeId, category, upcoming, type: typeof upcoming });

    const filter = { status: "PUBLISHED" };

    if (bdeId) filter.bdeId = bdeId;
    if (category) filter.category = category;

    // Si upcoming=true, ne montrer que les événements futurs
    if (upcoming === "true") {
      filter.date = { $gte: new Date() };
      console.log("🔍 Filtre date appliqué: événements >= ", new Date());
    }
    
    console.log("🔎 Filtre MongoDB final:", filter);

    const events = await Event.find(filter)
      .populate("bdeId", "name slug logo colors")
      .populate("createdBy", "firstName lastName")
      .sort({ date: 1 }) // Tri ascendant : événements les plus proches en premier
      .limit(100);

    console.log(`✅ ${events.length} événements trouvés`);

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
 * @route   GET /api/events/:slug
 * @desc    Récupérer un événement par son slug
 * @access  Public
 */
export const getEventBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const event = await Event.findOne({ slug })
      .populate("bdeId", "name slug logo colors")
      .populate("createdBy", "firstName lastName")
      .populate("publishedBy", "firstName lastName")
      .populate("rejectedBy", "firstName lastName");

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Événement non trouvé",
      });
    }

    // Si l'événement n'est pas publié, seuls les admins peuvent le voir
    if (event.status !== "PUBLISHED") {
      if (!req.user) {
        return res.status(403).json({
          success: false,
          error: "Accès refusé - Événement non publié",
        });
      }

      // Admin Interasso peut voir tous les événements
      if (req.user.role !== "admin_interasso") {
        // Admin BDE peut voir uniquement ses événements
        if (
          req.user.role !== "admin_bde" ||
          req.user.bdeId?.toString() !== event.bdeId._id.toString()
        ) {
          return res.status(403).json({
            success: false,
            error: "Accès refusé - Événement non publié",
          });
        }
      }
    }

    res.json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération de l'événement",
      details: error.message,
    });
  }
};

/**
 * @route   GET /api/events/my/events
 * @desc    Récupérer les événements de mon BDE (Admin BDE)
 * @access  Private - Admin BDE
 */
export const getMyBDEEvents = async (req, res) => {
  try {
    if (req.user.role !== "admin_bde") {
      return res.status(403).json({
        success: false,
        error: "Accès refusé - Réservé aux administrateurs BDE",
      });
    }

    const { status } = req.query;
    const filter = { bdeId: req.user.bdeId };

    if (status) filter.status = status;

    const events = await Event.find(filter)
      .populate("bdeId", "name slug logo colors")
      .populate("createdBy", "firstName lastName")
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
 * @route   POST /api/events
 * @desc    Créer un nouvel événement (status PENDING)
 * @access  Private - Admin BDE
 */
export const createEvent = async (req, res) => {
  try {
    if (req.user.role !== "admin_bde") {
      return res.status(403).json({
        success: false,
        error:
          "Accès refusé - Seuls les administrateurs BDE peuvent créer des événements",
      });
    }

    // Forcer le bdeId à celui de l'utilisateur
    const eventData = {
      ...req.body,
      bdeId: req.user.bdeId,
      createdBy: req.user.id,
      status: "PENDING", // Toujours PENDING à la création
    };

    const event = await Event.create(eventData);

    // Populate les infos
    await event.populate("bdeId");

    // Envoyer notification à Admin Interasso
    await notificationService.notifyEventSubmitted(event, event.bdeId);

    console.log(
      `✨ Nouvel événement créé: "${event.title}" (${event.bdeId.name}) - Statut: PENDING`
    );

    res.status(201).json({
      success: true,
      message: "Événement créé et soumis pour validation",
      event: await Event.findById(event._id)
        .populate("bdeId", "name slug logo colors")
        .populate("createdBy", "firstName lastName"),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Un événement avec ce titre existe déjà pour ce BDE",
      });
    }

    res.status(500).json({
      success: false,
      error: "Erreur lors de la création de l'événement",
      details: error.message,
    });
  }
};

/**
 * @route   PUT /api/events/:id
 * @desc    Modifier un événement
 * @access  Private - Admin BDE (PENDING only) ou Admin Interasso (all)
 */
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Événement non trouvé",
      });
    }

    // Vérifier les permissions
    if (req.user.role === "admin_bde") {
      // Admin BDE peut modifier uniquement ses événements PENDING
      if (event.bdeId.toString() !== req.user.bdeId.toString()) {
        return res.status(403).json({
          success: false,
          error:
            "Accès refusé - Vous ne pouvez modifier que vos propres événements",
        });
      }

      if (event.status !== "PENDING") {
        return res.status(403).json({
          success: false,
          error:
            "Accès refusé - Vous ne pouvez modifier que les événements en attente",
        });
      }
    } else if (req.user.role !== "admin_interasso") {
      return res.status(403).json({
        success: false,
        error: "Accès refusé",
      });
    }

    // Champs modifiables
    const allowedFields = [
      "title",
      "description",
      "shortDescription",
      "startDate",
      "endDate",
      "location",
      "address",
      "price",
      "maxParticipants",
      "registrationRequired",
      "registrationDeadline",
      "category",
      "image",
      "tags",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    Object.assign(event, updates);
    await event.save();

    logAdminAction("UPDATE_EVENT")({ user: req.user, eventId: id });

    console.log(`✏️ Événement modifié: "${event.title}" par ${req.user.email}`);

    res.json({
      success: true,
      message: "Événement modifié avec succès",
      event: await Event.findById(id)
        .populate("bdeId", "name slug logo colors")
        .populate("createdBy", "firstName lastName"),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la modification de l'événement",
      details: error.message,
    });
  }
};

/**
 * @route   DELETE /api/events/:id
 * @desc    Supprimer un événement
 * @access  Private - Admin BDE (own) ou Admin Interasso (all)
 */
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Événement non trouvé",
      });
    }

    // Vérifier les permissions
    if (req.user.role === "admin_bde") {
      // Admin BDE peut supprimer uniquement ses propres événements
      if (event.bdeId.toString() !== req.user.bdeId.toString()) {
        return res.status(403).json({
          success: false,
          error:
            "Accès refusé - Vous ne pouvez supprimer que vos propres événements",
        });
      }
    } else if (req.user.role !== "admin_interasso") {
      return res.status(403).json({
        success: false,
        error: "Accès refusé",
      });
    }

    await event.deleteOne();

    logAdminAction("DELETE_EVENT")({ user: req.user, eventId: id });

    console.log(
      `🗑️ Événement supprimé: "${event.title}" par ${req.user.email}`
    );

    res.json({
      success: true,
      message: "Événement supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la suppression de l'événement",
      details: error.message,
    });
  }
};
