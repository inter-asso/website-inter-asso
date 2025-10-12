import express from 'express';
import {
  getPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner
} from '../controllers/partnerController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { isAdminInterasso } from '../middleware/permissions.js';

const router = express.Router();

/**
 * @route   GET /api/partners
 * @desc    Récupérer tous les partenaires
 * @access  Public
 */
router.get('/', getPartners);

/**
 * @route   GET /api/partners/:id
 * @desc    Récupérer un partenaire par son ID
 * @access  Public
 */
router.get('/:id', getPartnerById);

/**
 * @route   POST /api/partners
 * @desc    Créer un nouveau partenaire
 * @access  Private - Admin Interasso
 */
router.post('/', authMiddleware, isAdminInterasso, createPartner);

/**
 * @route   PUT /api/partners/:id
 * @desc    Modifier un partenaire
 * @access  Private - Admin Interasso
 */
router.put('/:id', authMiddleware, isAdminInterasso, updatePartner);

/**
 * @route   DELETE /api/partners/:id
 * @desc    Supprimer un partenaire
 * @access  Private - Admin Interasso
 */
router.delete('/:id', authMiddleware, isAdminInterasso, deletePartner);

export default router;
