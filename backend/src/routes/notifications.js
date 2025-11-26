import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
} from "../controllers/notificationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Toutes les routes nécessitent une authentification
 */
router.use(authMiddleware);

/**
 * @route   GET /api/notifications
 * @desc    Récupérer les notifications de l'utilisateur
 * @query   ?limit=20&unread=false
 * @access  Private (authentifié)
 */
router.get("/", getNotifications);

/**
 * @route   GET /api/notifications/unread-count
 * @desc    Compter les notifications non lues (badge)
 * @access  Private (authentifié)
 */
router.get("/unread-count", getUnreadCount);

/**
 * @route   PUT /api/notifications/mark-all-read
 * @desc    Marquer toutes les notifications comme lues
 * @access  Private (authentifié)
 */
router.put("/mark-all-read", markAllAsRead);

/**
 * @route   DELETE /api/notifications/read
 * @desc    Supprimer toutes les notifications lues
 * @access  Private (authentifié)
 */
router.delete("/read", deleteReadNotifications);

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Marquer une notification comme lue
 * @access  Private (authentifié)
 */
router.put("/:id/read", markAsRead);

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Supprimer une notification
 * @access  Private (authentifié)
 */
router.delete("/:id", deleteNotification);

export default router;
