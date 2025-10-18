import BDE from "../models/BDE.js";
import Event from "../models/Event.js";
import Member from "../models/Member.js";

/**
 * @route   GET /api/bdes
 * @desc    Récupérer tous les BDE
 * @access  Public
 */
export const getBDEs = async (req, res) => {
  try {
    const bdes = await BDE.find().select("-__v").sort({ displayOrder: 1 });

    res.json({
      success: true,
      count: bdes.length,
      bdes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des BDE",
      details: error.message,
    });
  }
};

/**
 * @route   GET /api/bdes/:slug
 * @desc    Récupérer un BDE par son slug
 * @access  Public
 */
export const getBDEBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const bde = await BDE.findOne({ slug }).select("-__v");

    if (!bde) {
      return res.status(404).json({
        success: false,
        error: "BDE non trouvé",
      });
    }

    res.json({
      success: true,
      bde,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération du BDE",
      details: error.message,
    });
  }
};

/**
 * @route   GET /api/bdes/:slug/events
 * @desc    Récupérer les événements d'un BDE (PUBLISHED uniquement pour public)
 * @access  Public
 */
export const getBDEEvents = async (req, res) => {
  try {
    const { slug } = req.params;
    const { status, limit = 20 } = req.query;

    // Trouver le BDE
    const bde = await BDE.findOne({ slug });

    if (!bde) {
      return res.status(404).json({
        success: false,
        error: "BDE non trouvé",
      });
    }

    // Filtrer par statut (PUBLISHED par défaut pour le public)
    const filter = { bdeId: bde._id };

    // Si l'utilisateur est admin de ce BDE, il peut voir tous les statuts
    if (
      req.user &&
      req.user.role === "admin_bde" &&
      req.user.bdeId?.toString() === bde._id.toString()
    ) {
      if (status) filter.status = status;
    } else if (req.user && req.user.role === "admin_interasso") {
      // Admin Interasso peut voir tous les statuts
      if (status) filter.status = status;
    } else {
      // Public : uniquement PUBLISHED
      filter.status = "PUBLISHED";
    }

    const events = await Event.find(filter)
      .populate("createdBy", "firstName lastName")
      .sort({ startDate: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: events.length,
      bde: {
        name: bde.name,
        slug: bde.slug,
        logo: bde.logo,
        colors: bde.colors,
      },
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
 * @route   GET /api/bdes/:slug/members
 * @desc    Récupérer les membres du bureau d'un BDE
 * @access  Public
 */
export const getBDEMembers = async (req, res) => {
  try {
    const { slug } = req.params;

    // Trouver le BDE
    const bde = await BDE.findOne({ slug });

    if (!bde) {
      return res.status(404).json({
        success: false,
        error: "BDE non trouvé",
      });
    }

    const members = await Member.find({ bdeId: bde._id })
      .select("-__v")
      .sort({ displayOrder: 1 });

    res.json({
      success: true,
      count: members.length,
      bde: {
        name: bde.name,
        slug: bde.slug,
        logo: bde.logo,
        colors: bde.colors,
      },
      members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des membres",
      details: error.message,
    });
  }
};

/**
 * @route   PUT /api/bdes/:id
 * @desc    Modifier un BDE
 * @access  Private - Admin Interasso uniquement
 */
export const updateBDE = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Seul Admin Interasso peut modifier les BDE
    if (req.user.role !== "admin_interasso") {
      return res.status(403).json({
        success: false,
        error: "Accès refusé - Réservé aux administrateurs Interasso",
      });
    }

    // Champs modifiables
    const allowedFields = [
      "name",
      "fullName",
      "description",
      "logo",
      "colors",
      "socialLinks",
      "contactEmail",
      "displayOrder",
    ];

    const filteredUpdates = {};
    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    });

    const bde = await BDE.findByIdAndUpdate(id, filteredUpdates, {
      new: true,
      runValidators: true,
    });

    if (!bde) {
      return res.status(404).json({
        success: false,
        error: "BDE non trouvé",
      });
    }

    console.log(`✏️ BDE modifié: ${bde.name} par ${req.user.email}`);

    res.json({
      success: true,
      message: "BDE modifié avec succès",
      bde,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la modification du BDE",
      details: error.message,
    });
  }
};

/**
 * @route   POST /api/bdes
 * @desc    Créer un nouveau BDE
 * @access  Private - Admin Interasso uniquement
 */
export const createBDE = async (req, res) => {
  try {
    // Seul Admin Interasso peut créer des BDE
    if (req.user.role !== "admin_interasso") {
      return res.status(403).json({
        success: false,
        error: "Accès refusé - Réservé aux administrateurs Interasso",
      });
    }

    const bde = await BDE.create(req.body);

    console.log(`✨ Nouveau BDE créé: ${bde.name}`);

    res.status(201).json({
      success: true,
      message: "BDE créé avec succès",
      bde,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Un BDE avec ce nom ou slug existe déjà",
      });
    }

    res.status(500).json({
      success: false,
      error: "Erreur lors de la création du BDE",
      details: error.message,
    });
  }
};

/**
 * @route   GET /api/bdes/:slug/stats
 * @desc    Statistiques d'un BDE (événements, membres)
 * @access  Public
 */
export const getBDEStats = async (req, res) => {
  try {
    const { slug } = req.params;

    const bde = await BDE.findOne({ slug });

    if (!bde) {
      return res.status(404).json({
        success: false,
        error: "BDE non trouvé",
      });
    }

    const [
      totalEvents,
      publishedEvents,
      pendingEvents,
      rejectedEvents,
      totalMembers,
    ] = await Promise.all([
      Event.countDocuments({ bdeId: bde._id }),
      Event.countDocuments({ bdeId: bde._id, status: "PUBLISHED" }),
      Event.countDocuments({ bdeId: bde._id, status: "PENDING" }),
      Event.countDocuments({ bdeId: bde._id, status: "REJECTED" }),
      Member.countDocuments({ bdeId: bde._id }),
    ]);

    res.json({
      success: true,
      bde: {
        name: bde.name,
        slug: bde.slug,
      },
      stats: {
        events: {
          total: totalEvents,
          published: publishedEvents,
          pending: pendingEvents,
          rejected: rejectedEvents,
        },
        members: totalMembers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des statistiques",
      details: error.message,
    });
  }
};
