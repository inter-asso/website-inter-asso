import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware d'authentification JWT
 * Vérifie le token et attache l'utilisateur à req.user
 */
export const authMiddleware = async (req, res, next) => {
  try {
    // Récupérer le token depuis le header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Token d'authentification manquant",
      });
    }

    const token = authHeader.split(" ")[1];

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer l'utilisateur depuis la base de données
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Utilisateur non trouvé",
      });
    }

    // Attacher l'utilisateur à la requête
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      bdeId: user.bdeId,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Token invalide",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token expiré",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Erreur d'authentification",
      details: error.message,
    });
  }
};

/**
 * Middleware optionnel pour récupérer l'utilisateur si token présent
 * Ne bloque pas la requête si pas de token
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(); // Pas de token, on continue quand même
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (user) {
      req.user = {
        id: user._id,
        email: user.email,
        role: user.role,
        bdeId: user.bdeId,
      };
    }

    next();
  } catch (error) {
    // Erreur de token mais on continue quand même (mode optionnel)
    next();
  }
};
