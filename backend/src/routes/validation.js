import express from "express";
import {
  getPendingEvents,
  getAllEvents,
  validateEvent,
  rejectEvent,
  getValidationStats,
} from "../controllers/validationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdminInterasso } from "../middleware/permissions.js";

const router = express.Router();

/**
 * Toutes les routes nécessitent une authentification
 * et un rôle Admin Interasso
 */
router.use(authMiddleware);
router.use(isAdminInterasso);

/**
 * @route   GET /api/validation/pending-events
 * @desc    Récupérer les événements en attente
 * @access  Private - Admin Interasso
 */
router.get("/pending-events", getPendingEvents);

/**
 * @route   GET /api/validation/all-events
 * @desc    Récupérer tous les événements (filtrable par statut/BDE)
 * @access  Private - Admin Interasso
 */
router.get("/all-events", getAllEvents);

/**
 * @route   GET /api/validation/stats
 * @desc    Statistiques de validation
 * @access  Private - Admin Interasso
 */
router.get("/stats", getValidationStats);

/**
 * @route   PUT /api/validation/validate/:eventId
 * @desc    Valider un événement
 * @access  Private - Admin Interasso
 */
router.put("/validate/:eventId", validateEvent);

/**
 * @route   PUT /api/validation/reject/:eventId
 * @desc    Rejeter un événement
 * @access  Private - Admin Interasso
 */
router.put("/reject/:eventId", rejectEvent);

export default router;
