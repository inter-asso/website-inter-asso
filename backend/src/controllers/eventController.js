import Event from "../models/Event.js";
import BDE from "../models/BDE.js";
import notificationService from "../services/notificationService.js";

/**
 * @route   GET /api/events
 * @desc    Récupérer tous les événements PUBLISHED (public)
 * @access  Public
 */
export const getEvents = async (req, res) => {
  try {
    const { bdeId, category, upcoming } = req.query;

    console.log("📥 Filtres reçus:", {
      bdeId,
      category,
      upcoming,
      type: typeof upcoming,
    });

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
 * @desc    Créer un nouvel événement
 * @access  Private - Admin BDE ou Admin Interasso
 */
export const createEvent = async (req, res) => {
  try {
    // Vérifier que l'utilisateur est soit Admin BDE soit Admin Interasso
    if (req.user.role !== "admin_bde" && req.user.role !== "admin_interasso") {
      return res.status(403).json({
        success: false,
        error:
          "Accès refusé - Seuls les administrateurs BDE et Interasso peuvent créer des événements",
      });
    }

    let eventData = { ...req.body };

    // Admin BDE : forcer le bdeId à celui de l'utilisateur
    if (req.user.role === "admin_bde") {
      eventData.bdeId = req.user.bdeId;
      eventData.status = "PENDING"; // Toujours PENDING pour Admin BDE
    }

    // Admin Interasso : peut choisir le BDE et le statut
    if (req.user.role === "admin_interasso") {
      // Vérifier que le bdeId est fourni
      if (!eventData.bdeId) {
        return res.status(400).json({
          success: false,
          error: "Le BDE organisateur est requis",
        });
      }
      // Convertir le statut en majuscules si fourni
      if (eventData.status) {
        eventData.status = eventData.status.toUpperCase();
      } else {
        eventData.status = "PENDING"; // Par défaut
      }
    }

    // Gérer l'image qui peut venir comme objet {url, publicId}
    if (eventData.image && typeof eventData.image === "object") {
      if (eventData.image.url) {
        eventData.coverImage = {
          url: eventData.image.url,
          publicId: eventData.image.publicId || "default",
        };
      }
      delete eventData.image;
    }

    eventData.createdBy = req.user.id;

    const event = await Event.create(eventData);

    // Populate les infos
    await event.populate("bdeId");

    // Envoyer notification à Admin Interasso uniquement si créé par Admin BDE
    if (req.user.role === "admin_bde") {
      await notificationService.notifyEventSubmitted(event, event.bdeId);
    }

    console.log(
      `✨ Nouvel événement créé: "${event.title}" (${event.bdeId.name}) - Statut: ${event.status} par ${req.user.email} (${req.user.role})`
    );

    res.status(201).json({
      success: true,
      message:
        req.user.role === "admin_bde"
          ? "Événement créé et soumis pour validation"
          : "Événement créé avec succès",
      event: await Event.findById(event._id)
        .populate("bdeId", "name slug logo colors")
        .populate("createdBy", "firstName lastName"),
    });
  } catch (error) {
    console.error("❌ Erreur création événement:", error);
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
      "date",
      "endDate",
      "location",
      "price",
      "maxParticipants",
      "registrationRequired",
      "category",
      "images",
      "coverImage",
    ];

    // Admin Interasso peut aussi modifier le statut et le bdeId
    if (req.user.role === "admin_interasso") {
      allowedFields.push("status", "bdeId");
    }

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Gérer l'image qui peut venir comme objet {url, publicId}
    if (req.body.image && typeof req.body.image === "object") {
      if (req.body.image.url) {
        updates.coverImage = {
          url: req.body.image.url,
          publicId: req.body.image.publicId || "default",
        };
      }
      delete updates.image;
    }

    // Convertir le statut en majuscules si présent
    if (updates.status) {
      updates.status = updates.status.toUpperCase();
    }

    Object.assign(event, updates);
    await event.save();

    console.log(
      `✏️ Événement modifié: "${event.title}" par ${req.user.email} (${req.user.role})`
    );

    res.json({
      success: true,
      message: "Événement modifié avec succès",
      event: await Event.findById(id)
        .populate("bdeId", "name slug logo colors")
        .populate("createdBy", "firstName lastName"),
    });
  } catch (error) {
    console.error("❌ Erreur modification événement:", error);
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

    console.log(
      `🗑️ Événement supprimé: "${event.title}" par ${req.user.email} (${req.user.role})`
    );

    res.json({
      success: true,
      message: "Événement supprimé avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur suppression événement:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la suppression de l'événement",
      details: error.message,
    });
  }
};
