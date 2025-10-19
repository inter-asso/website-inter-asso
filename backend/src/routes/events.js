import express from "express";
import {
  getEvents,
  getEventBySlug,
  getMyBDEEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { authMiddleware, optionalAuth } from "../middleware/authMiddleware.js";
import { isAdminBDE } from "../middleware/permissions.js";

const router = express.Router();

/**
 * @route   GET /api/events
 * @desc    Récupérer tous les événements PUBLISHED
 * @access  Public
 */
router.get("/", getEvents);

/**
 * @route   GET /api/events/my/events
 * @desc    Récupérer mes événements (Admin BDE)
 * @access  Private - Admin BDE
 */
router.get("/my/events", authMiddleware, isAdminBDE, getMyBDEEvents);

/**
 * @route   POST /api/events
 * @desc    Créer un nouvel événement
 * @access  Private - Admin BDE ou Admin Interasso
 */
router.post("/", authMiddleware, createEvent);

/**
 * @route   GET /api/events/:slug
 * @desc    Récupérer un événement par son slug
 * @access  Public (avec auth optionnelle pour événements non publiés)
 */
router.get("/:slug", optionalAuth, getEventBySlug);

/**
 * @route   PUT /api/events/:id
 * @desc    Modifier un événement
 * @access  Private - Admin BDE (PENDING) ou Admin Interasso (all)
 */
router.put("/:id", authMiddleware, updateEvent);

/**
 * @route   DELETE /api/events/:id
 * @desc    Supprimer un événement
 * @access  Private - Admin BDE (own) ou Admin Interasso (all)
 */
router.delete("/:id", authMiddleware, deleteEvent);

export default router;
