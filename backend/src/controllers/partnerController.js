import Partner from '../models/Partner.js';
import { logAdminAction } from '../middleware/permissions.js';

/**
 * @route   GET /api/partners
 * @desc    Récupérer tous les partenaires
 * @access  Public
 */
export const getPartners = async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;

    const partners = await Partner.find(filter)
      .sort({ displayOrder: 1 });

    res.json({
      success: true,
      count: partners.length,
      partners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des partenaires',
      details: error.message
    });
  }
};

/**
 * @route   GET /api/partners/:id
 * @desc    Récupérer un partenaire par son ID
 * @access  Public
 */
export const getPartnerById = async (req, res) => {
  try {
    const { id } = req.params;

    const partner = await Partner.findById(id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        error: 'Partenaire non trouvé'
      });
    }

    res.json({
      success: true,
      partner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du partenaire',
      details: error.message
    });
  }
};

/**
 * @route   POST /api/partners
 * @desc    Créer un nouveau partenaire
 * @access  Private - Admin Interasso uniquement
 */
export const createPartner = async (req, res) => {
  try {
    if (req.user.role !== 'admin_interasso') {
      return res.status(403).json({
        success: false,
        error: 'Accès refusé - Seuls les administrateurs Interasso peuvent créer des partenaires'
      });
    }

    const partner = await Partner.create(req.body);

    console.log(`✨ Nouveau partenaire créé: ${partner.name}`);

    res.status(201).json({
      success: true,
      message: 'Partenaire créé avec succès',
      partner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création du partenaire',
      details: error.message
    });
  }
};

/**
 * @route   PUT /api/partners/:id
 * @desc    Modifier un partenaire
 * @access  Private - Admin Interasso uniquement
 */
export const updatePartner = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin_interasso') {
      return res.status(403).json({
        success: false,
        error: 'Accès refusé - Seuls les administrateurs Interasso peuvent modifier des partenaires'
      });
    }

    const partner = await Partner.findById(id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        error: 'Partenaire non trouvé'
      });
    }

    // Champs modifiables
    const allowedFields = [
      'name',
      'description',
      'logo',
      'website',
      'category',
      'benefits',
      'featured',
      'displayOrder'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    Object.assign(partner, updates);
    await partner.save();

    logAdminAction('UPDATE_PARTNER')({ user: req.user, partnerId: id });

    console.log(`✏️ Partenaire modifié: ${partner.name} par ${req.user.email}`);

    res.json({
      success: true,
      message: 'Partenaire modifié avec succès',
      partner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la modification du partenaire',
      details: error.message
    });
  }
};

/**
 * @route   DELETE /api/partners/:id
 * @desc    Supprimer un partenaire
 * @access  Private - Admin Interasso uniquement
 */
export const deletePartner = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin_interasso') {
      return res.status(403).json({
        success: false,
        error: 'Accès refusé - Seuls les administrateurs Interasso peuvent supprimer des partenaires'
      });
    }

    const partner = await Partner.findById(id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        error: 'Partenaire non trouvé'
      });
    }

    await partner.deleteOne();

    logAdminAction('DELETE_PARTNER')({ user: req.user, partnerId: id });

    console.log(`🗑️ Partenaire supprimé: ${partner.name} par ${req.user.email}`);

    res.json({
      success: true,
      message: 'Partenaire supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression du partenaire',
      details: error.message
    });
  }
};
