import Member from "../models/Member.js";
import BDE from "../models/BDE.js";
import { logAdminAction } from "../middleware/permissions.js";

/**
 * @route   GET /api/members
 * @desc    Récupérer tous les membres (ou filtré par BDE)
 * @access  Public
 */
export const getMembers = async (req, res) => {
  try {
    const { bdeId } = req.query;
    const filter = {};

    if (bdeId) filter.bdeId = bdeId;

    const members = await Member.find(filter)
      .populate("bdeId", "name slug logo colors")
      .sort({ displayOrder: 1 });

    res.json({
      success: true,
      count: members.length,
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
 * @route   GET /api/members/:id
 * @desc    Récupérer un membre par son ID
 * @access  Public
 */
export const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await Member.findById(id).populate(
      "bdeId",
      "name slug logo colors"
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        error: "Membre non trouvé",
      });
    }

    res.json({
      success: true,
      member,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération du membre",
      details: error.message,
    });
  }
};

/**
 * @route   GET /api/members/my/bureau
 * @desc    Récupérer les membres de mon bureau (Admin BDE)
 * @access  Private - Admin BDE
 */
export const getMyBureauMembers = async (req, res) => {
  try {
    if (req.user.role !== "admin_bde") {
      return res.status(403).json({
        success: false,
        error: "Accès refusé - Réservé aux administrateurs BDE",
      });
    }

    const members = await Member.find({ bdeId: req.user.bdeId })
      .populate("bdeId", "name slug logo colors")
      .sort({ displayOrder: 1 });

    res.json({
      success: true,
      count: members.length,
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
 * @route   POST /api/members
 * @desc    Créer un nouveau membre de bureau
 * @access  Private - Admin BDE
 */
export const createMember = async (req, res) => {
  try {
    if (req.user.role !== "admin_bde") {
      return res.status(403).json({
        success: false,
        error:
          "Accès refusé - Seuls les administrateurs BDE peuvent créer des membres",
      });
    }

    // Forcer le bdeId à celui de l'utilisateur
    const memberData = {
      ...req.body,
      bdeId: req.user.bdeId,
    };

    const member = await Member.create(memberData);

    await member.populate("bdeId", "name slug logo colors");

    console.log(
      `✨ Nouveau membre créé: ${member.firstName} ${member.lastName} (${member.bdeId.name})`
    );

    res.status(201).json({
      success: true,
      message: "Membre créé avec succès",
      member,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la création du membre",
      details: error.message,
    });
  }
};

/**
 * @route   PUT /api/members/:id
 * @desc    Modifier un membre de bureau
 * @access  Private - Admin BDE (own bureau only)
 */
export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin_bde") {
      return res.status(403).json({
        success: false,
        error:
          "Accès refusé - Seuls les administrateurs BDE peuvent modifier des membres",
      });
    }

    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        error: "Membre non trouvé",
      });
    }

    // Vérifier que le membre appartient au BDE de l'admin
    if (member.bdeId.toString() !== req.user.bdeId.toString()) {
      return res.status(403).json({
        success: false,
        error:
          "Accès refusé - Vous ne pouvez modifier que les membres de votre bureau",
      });
    }

    // Champs modifiables
    const allowedFields = [
      "firstName",
      "lastName",
      "role",
      "photo",
      "bio",
      "email",
      "promotion",
      "socialLinks",
      "displayOrder",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    Object.assign(member, updates);
    await member.save();

    logAdminAction("UPDATE_MEMBER")({ user: req.user, memberId: id });

    console.log(
      `✏️ Membre modifié: ${member.firstName} ${member.lastName} par ${req.user.email}`
    );

    res.json({
      success: true,
      message: "Membre modifié avec succès",
      member: await Member.findById(id).populate(
        "bdeId",
        "name slug logo colors"
      ),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la modification du membre",
      details: error.message,
    });
  }
};

/**
 * @route   DELETE /api/members/:id
 * @desc    Supprimer un membre de bureau
 * @access  Private - Admin BDE (own bureau only)
 */
export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin_bde") {
      return res.status(403).json({
        success: false,
        error:
          "Accès refusé - Seuls les administrateurs BDE peuvent supprimer des membres",
      });
    }

    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        error: "Membre non trouvé",
      });
    }

    // Vérifier que le membre appartient au BDE de l'admin
    if (member.bdeId.toString() !== req.user.bdeId.toString()) {
      return res.status(403).json({
        success: false,
        error:
          "Accès refusé - Vous ne pouvez supprimer que les membres de votre bureau",
      });
    }

    await member.deleteOne();

    logAdminAction("DELETE_MEMBER")({ user: req.user, memberId: id });

    console.log(
      `🗑️ Membre supprimé: ${member.firstName} ${member.lastName} par ${req.user.email}`
    );

    res.json({
      success: true,
      message: "Membre supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la suppression du membre",
      details: error.message,
    });
  }
};
