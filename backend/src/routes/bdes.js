import express from 'express';
import {
  getBDEs,
  getBDEBySlug,
  getBDEEvents,
  getBDEMembers,
  updateBDE,
  createBDE,
  getBDEStats
} from '../controllers/bdeController.js';
import { authMiddleware, optionalAuth } from '../middleware/authMiddleware.js';
import { isAdminInterasso } from '../middleware/permissions.js';

const router = express.Router();

/**
 * @route   GET /api/bdes
 * @desc    Récupérer tous les BDE
 * @access  Public
 */
router.get('/', getBDEs);

/**
 * @route   POST /api/bdes
 * @desc    Créer un nouveau BDE
 * @access  Private - Admin Interasso
 */
router.post('/', authMiddleware, isAdminInterasso, createBDE);

/**
 * @route   GET /api/bdes/:slug
 * @desc    Récupérer un BDE par son slug
 * @access  Public
 */
router.get('/:slug', getBDEBySlug);

/**
 * @route   GET /api/bdes/:slug/events
 * @desc    Récupérer les événements d'un BDE
 * @access  Public (avec auth optionnelle pour les admins)
 */
router.get('/:slug/events', optionalAuth, getBDEEvents);

/**
 * @route   GET /api/bdes/:slug/members
 * @desc    Récupérer les membres du bureau d'un BDE
 * @access  Public
 */
router.get('/:slug/members', getBDEMembers);

/**
 * @route   GET /api/bdes/:slug/stats
 * @desc    Statistiques d'un BDE
 * @access  Public
 */
router.get('/:slug/stats', getBDEStats);

/**
 * @route   PUT /api/bdes/:id
 * @desc    Modifier un BDE
 * @access  Private - Admin Interasso
 */
router.put('/:id', authMiddleware, isAdminInterasso, updateBDE);

export default router;
