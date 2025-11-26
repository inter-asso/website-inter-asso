import express from "express";
import {
  login,
  refresh,
  getMe,
  logout,
  updatePassword,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Connexion admin
 * @access  Public
 */
router.post("/login", login);

/**
 * @route   POST /api/auth/refresh
 * @desc    Rafraîchir le token
 * @access  Public
 */
router.post("/refresh", refresh);

/**
 * @route   GET /api/auth/me
 * @desc    Récupérer l'utilisateur connecté
 * @access  Private
 */
router.get("/me", authMiddleware, getMe);

/**
 * @route   POST /api/auth/logout
 * @desc    Déconnexion
 * @access  Private
 */
router.post("/logout", authMiddleware, logout);

/**
 * @route   PUT /api/auth/update-password
 * @desc    Modifier le mot de passe
 * @access  Private
 */
router.put("/update-password", authMiddleware, updatePassword);

export default router;
