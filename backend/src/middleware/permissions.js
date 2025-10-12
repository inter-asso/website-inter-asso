// Middleware de permissions (RBAC - Role-Based Access Control)
// Contrôle les accès selon les rôles : admin_interasso, admin_bde

import Event from '../models/Event.js';
import Member from '../models/Member.js';
import BDE from '../models/BDE.js';

/**
 * Vérifier si l'utilisateur est Admin Interasso
 */
export const isAdminInterasso = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentification requise' 
    });
  }

  if (req.user.role !== 'admin_interasso') {
    return res.status(403).json({ 
      error: 'Accès refusé: Admin Interasso requis' 
    });
  }

  next();
};

/**
 * Vérifier si l'utilisateur est Admin BDE
 */
export const isAdminBDE = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentification requise' 
    });
  }

  if (req.user.role !== 'admin_bde') {
    return res.status(403).json({ 
      error: 'Accès refusé: Admin BDE requis' 
    });
  }

  if (!req.user.bdeId) {
    return res.status(403).json({ 
      error: 'Aucun BDE associé à ce compte' 
    });
  }

  next();
};

/**
 * Vérifier si l'utilisateur est un Admin (Interasso OU BDE)
 */
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentification requise' 
    });
  }

  const validRoles = ['admin_interasso', 'admin_bde'];
  if (!validRoles.includes(req.user.role)) {
    return res.status(403).json({ 
      error: 'Accès refusé: Administrateur requis' 
    });
  }

  next();
};

/**
 * Vérifier si l'utilisateur peut modifier un événement
 * - Admin Interasso : peut modifier tout (même PUBLISHED/REJECTED)
 * - Admin BDE : peut modifier uniquement ses événements PENDING
 */
export const canEditEvent = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentification requise' 
      });
    }

    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ 
        error: 'Événement non trouvé' 
      });
    }

    // Admin Interasso peut tout modifier
    if (req.user.role === 'admin_interasso') {
      req.event = event; // Passer l'événement au controller
      return next();
    }

    // Admin BDE : vérifications spécifiques
    if (req.user.role === 'admin_bde') {
      // Doit appartenir au même BDE
      if (event.bdeId.toString() !== req.user.bdeId.toString()) {
        return res.status(403).json({ 
          error: 'Vous ne pouvez modifier que les événements de votre BDE' 
        });
      }

      // Peut modifier uniquement si PENDING
      if (event.status !== 'PENDING') {
        return res.status(403).json({ 
          error: 'Vous ne pouvez modifier que les événements en attente de validation',
          currentStatus: event.status
        });
      }

      req.event = event;
      return next();
    }

    // Rôle invalide
    return res.status(403).json({ 
      error: 'Accès refusé' 
    });

  } catch (error) {
    return res.status(500).json({ 
      error: 'Erreur lors de la vérification des permissions',
      details: error.message 
    });
  }
};

/**
 * Vérifier si l'utilisateur peut supprimer un événement
 * - Admin Interasso : peut supprimer tout
 * - Admin BDE : peut supprimer uniquement ses événements (tous status)
 */
export const canDeleteEvent = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentification requise' 
      });
    }

    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ 
        error: 'Événement non trouvé' 
      });
    }

    // Admin Interasso peut tout supprimer
    if (req.user.role === 'admin_interasso') {
      req.event = event;
      return next();
    }

    // Admin BDE : doit appartenir à son BDE
    if (req.user.role === 'admin_bde') {
      if (event.bdeId.toString() !== req.user.bdeId.toString()) {
        return res.status(403).json({ 
          error: 'Vous ne pouvez supprimer que les événements de votre BDE' 
        });
      }

      req.event = event;
      return next();
    }

    return res.status(403).json({ 
      error: 'Accès refusé' 
    });

  } catch (error) {
    return res.status(500).json({ 
      error: 'Erreur lors de la vérification des permissions',
      details: error.message 
    });
  }
};

/**
 * Vérifier si l'utilisateur peut modifier un membre du bureau
 * - Admin Interasso : NON (ne gère pas les membres)
 * - Admin BDE : peut modifier uniquement les membres de son BDE
 */
export const canEditMember = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentification requise' 
      });
    }

    // Admin Interasso ne peut pas gérer les membres
    if (req.user.role === 'admin_interasso') {
      return res.status(403).json({ 
        error: 'Seuls les Admin BDE peuvent gérer les membres de leur bureau' 
      });
    }

    // Pour modification/suppression : vérifier que le membre existe et appartient au BDE
    if (req.params.id) {
      const member = await Member.findById(req.params.id);
      
      if (!member) {
        return res.status(404).json({ 
          error: 'Membre non trouvé' 
        });
      }

      // Vérifier que le membre appartient au BDE de l'admin
      if (member.bdeId.toString() !== req.user.bdeId.toString()) {
        return res.status(403).json({ 
          error: 'Vous ne pouvez modifier que les membres de votre BDE' 
        });
      }

      req.member = member;
    }

    next();

  } catch (error) {
    return res.status(500).json({ 
      error: 'Erreur lors de la vérification des permissions',
      details: error.message 
    });
  }
};

/**
 * Vérifier si l'utilisateur peut modifier un BDE
 * - Admin Interasso : peut modifier tous les BDE
 * - Admin BDE : NON
 */
export const canEditBDE = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentification requise' 
    });
  }

  if (req.user.role !== 'admin_interasso') {
    return res.status(403).json({ 
      error: 'Seul l\'Admin Interasso peut modifier les informations des BDE' 
    });
  }

  next();
};

/**
 * Vérifier si une ressource appartient au BDE de l'utilisateur
 * Utile pour les créations (événements, membres)
 */
export const belongsToBDE = (bdeIdField = 'bdeId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentification requise' 
      });
    }

    // Admin Interasso peut tout faire
    if (req.user.role === 'admin_interasso') {
      return next();
    }

    // Admin BDE : vérifier le BDE
    if (req.user.role === 'admin_bde') {
      const requestedBdeId = req.body[bdeIdField];

      // Si bdeId fourni dans le body, vérifier qu'il correspond
      if (requestedBdeId && requestedBdeId !== req.user.bdeId.toString()) {
        return res.status(403).json({ 
          error: 'Vous ne pouvez créer des ressources que pour votre BDE' 
        });
      }

      // Forcer le bdeId à celui de l'user
      req.body[bdeIdField] = req.user.bdeId;
      
      return next();
    }

    return res.status(403).json({ 
      error: 'Accès refusé' 
    });
  };
};

/**
 * Logger les actions admin (optionnel, pour audit)
 */
export const logAdminAction = (action) => {
  return (req, res, next) => {
    console.log(`[ADMIN ACTION] ${action} by ${req.user?.username || 'unknown'} (${req.user?.role})`);
    next();
  };
};
