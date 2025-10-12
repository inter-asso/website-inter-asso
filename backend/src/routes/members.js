import express from 'express';
import {
  getMembers,
  getMemberById,
  getMyBureauMembers,
  createMember,
  updateMember,
  deleteMember
} from '../controllers/memberController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { isAdminBDE } from '../middleware/permissions.js';

const router = express.Router();

/**
 * @route   GET /api/members
 * @desc    Récupérer tous les membres (ou filtré par BDE)
 * @access  Public
 */
router.get('/', getMembers);

/**
 * @route   GET /api/members/my/bureau
 * @desc    Récupérer les membres de mon bureau (Admin BDE)
 * @access  Private - Admin BDE
 */
router.get('/my/bureau', authMiddleware, isAdminBDE, getMyBureauMembers);

/**
 * @route   POST /api/members
 * @desc    Créer un nouveau membre
 * @access  Private - Admin BDE
 */
router.post('/', authMiddleware, isAdminBDE, createMember);

/**
 * @route   GET /api/members/:id
 * @desc    Récupérer un membre par son ID
 * @access  Public
 */
router.get('/:id', getMemberById);

/**
 * @route   PUT /api/members/:id
 * @desc    Modifier un membre
 * @access  Private - Admin BDE (own bureau)
 */
router.put('/:id', authMiddleware, isAdminBDE, updateMember);

/**
 * @route   DELETE /api/members/:id
 * @desc    Supprimer un membre
 * @access  Private - Admin BDE (own bureau)
 */
router.delete('/:id', authMiddleware, isAdminBDE, deleteMember);

export default router;
