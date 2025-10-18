import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Générer un JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // Token valide 7 jours
  );
};

/**
 * Générer un refresh token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "30d" } // Refresh token valide 30 jours
  );
};

/**
 * @route   POST /api/auth/login
 * @desc    Connexion admin (Interasso ou BDE)
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email et mot de passe requis",
      });
    }

    // Chercher l'utilisateur
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Identifiants invalides",
      });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Identifiants invalides",
      });
    }

    // Générer les tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Mettre à jour la dernière connexion
    user.lastLogin = new Date();
    await user.save();

    // Réponse avec les tokens et les infos utilisateur
    res.json({
      success: true,
      message: "Connexion réussie",
      token,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        bdeId: user.bdeId,
      },
    });

    console.log(`✅ Connexion réussie: ${user.email} (${user.role})`);
  } catch (error) {
    console.error("❌ Erreur login:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la connexion",
      details: error.message,
    });
  }
};

/**
 * @route   POST /api/auth/refresh
 * @desc    Rafraîchir le token d'accès
 */
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: "Refresh token manquant",
      });
    }

    // Vérifier le refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Générer un nouveau token d'accès
    const newToken = generateToken(decoded.id);

    res.json({
      success: true,
      token: newToken,
    });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        error: "Refresh token invalide ou expiré",
      });
    }

    res.status(500).json({
      success: false,
      error: "Erreur lors du rafraîchissement du token",
      details: error.message,
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Récupérer l'utilisateur connecté
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "bdeId",
      "name slug logo colors"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Utilisateur non trouvé",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        bde: user.bdeId,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération du profil",
      details: error.message,
    });
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Déconnexion (côté client surtout)
 */
export const logout = async (req, res) => {
  try {
    // Dans un système JWT, la déconnexion se fait côté client
    // On peut logger l'événement pour l'audit
    console.log(`🚪 Déconnexion: ${req.user.email}`);

    res.json({
      success: true,
      message: "Déconnexion réussie",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la déconnexion",
      details: error.message,
    });
  }
};

/**
 * @route   PUT /api/auth/update-password
 * @desc    Modifier le mot de passe
 */
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Mot de passe actuel et nouveau mot de passe requis",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Le nouveau mot de passe doit contenir au moins 6 caractères",
      });
    }

    // Récupérer l'utilisateur avec le mot de passe
    const user = await User.findById(req.user.id).select("+password");

    // Vérifier le mot de passe actuel
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Mot de passe actuel incorrect",
      });
    }

    // Modifier le mot de passe
    user.password = newPassword;
    await user.save(); // Le pre-save hook va hasher le nouveau mot de passe

    console.log(`🔑 Mot de passe modifié: ${user.email}`);

    res.json({
      success: true,
      message: "Mot de passe modifié avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la modification du mot de passe",
      details: error.message,
    });
  }
};
