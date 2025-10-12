import Notification from '../models/Notification.js';
import User from '../models/User.js';
import emailService from './emailService.js';

class NotificationService {
  /**
   * Créer une notification pour un événement soumis
   * Envoyé à l'Admin Interasso quand un Admin BDE crée un événement
   */
  async notifyEventSubmitted(event, bde) {
    try {
      // Trouver l'Admin Interasso
      const adminInterasso = await User.findOne({ role: 'admin_interasso', isActive: true });
      
      if (!adminInterasso) {
        console.error('⚠️  Aucun Admin Interasso trouvé');
        return null;
      }

      // Créer notification in-app
      const notification = await Notification.create({
        type: 'EVENT_SUBMITTED',
        title: '🆕 Nouvel événement à valider',
        message: `L'événement "${event.title}" a été soumis par le ${bde.name} et attend votre validation.`,
        recipientId: adminInterasso._id,
        recipientRole: 'admin_interasso',
        eventId: event._id,
        bdeId: event.bdeId,
        isRead: false
      });

      // Envoyer email (si configuré)
      if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
        await emailService.sendEventSubmittedEmail(event, bde, adminInterasso.email);
      }

      console.log(`✅ Notification EVENT_SUBMITTED créée pour Admin Interasso`);
      return notification;
    } catch (error) {
      console.error('❌ Erreur lors de la création de la notification EVENT_SUBMITTED:', error);
      throw error;
    }
  }

  /**
   * Créer une notification pour un événement validé
   * Envoyé à l'Admin BDE quand son événement est accepté
   */
  async notifyEventValidated(event, bde, adminBDE) {
    try {
      // Créer notification in-app
      const notification = await Notification.create({
        type: 'EVENT_VALIDATED',
        title: '✅ Événement validé',
        message: `Félicitations ! Votre événement "${event.title}" a été validé et est maintenant visible sur le site.`,
        recipientId: adminBDE._id,
        recipientRole: 'admin_bde',
        eventId: event._id,
        bdeId: event.bdeId,
        isRead: false
      });

      // Envoyer email (si configuré)
      if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
        await emailService.sendEventValidatedEmail(event, bde, adminBDE.email);
      }

      console.log(`✅ Notification EVENT_VALIDATED créée pour ${bde.name}`);
      return notification;
    } catch (error) {
      console.error('❌ Erreur lors de la création de la notification EVENT_VALIDATED:', error);
      throw error;
    }
  }

  /**
   * Créer une notification pour un événement refusé
   * Envoyé à l'Admin BDE quand son événement est rejeté
   */
  async notifyEventRejected(event, bde, adminBDE, rejectionReason) {
    try {
      // Créer notification in-app
      const notification = await Notification.create({
        type: 'EVENT_REJECTED',
        title: '❌ Événement refusé',
        message: `Votre événement "${event.title}" a été refusé. Raison : ${rejectionReason}`,
        recipientId: adminBDE._id,
        recipientRole: 'admin_bde',
        eventId: event._id,
        bdeId: event.bdeId,
        isRead: false
      });

      // Envoyer email (si configuré)
      if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
        await emailService.sendEventRejectedEmail(event, bde, adminBDE.email, rejectionReason);
      }

      console.log(`✅ Notification EVENT_REJECTED créée pour ${bde.name}`);
      return notification;
    } catch (error) {
      console.error('❌ Erreur lors de la création de la notification EVENT_REJECTED:', error);
      throw error;
    }
  }

  /**
   * Récupérer les notifications d'un utilisateur
   */
  async getUserNotifications(userId, limit = 20, onlyUnread = false) {
    try {
      const query = { recipientId: userId };
      if (onlyUnread) {
        query.isRead = false;
      }

      const notifications = await Notification.find(query)
        .populate('eventId', 'title slug date')
        .populate('bdeId', 'name logo')
        .sort({ createdAt: -1 })
        .limit(limit);

      return notifications;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des notifications:', error);
      throw error;
    }
  }

  /**
   * Compter les notifications non lues d'un utilisateur
   */
  async getUnreadCount(userId) {
    try {
      const count = await Notification.countDocuments({ 
        recipientId: userId, 
        isRead: false 
      });
      return count;
    } catch (error) {
      console.error('❌ Erreur lors du comptage des notifications non lues:', error);
      throw error;
    }
  }

  /**
   * Marquer une notification comme lue
   */
  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOne({
        _id: notificationId,
        recipientId: userId
      });

      if (!notification) {
        throw new Error('Notification non trouvée ou accès refusé');
      }

      notification.isRead = true;
      notification.readAt = new Date();
      await notification.save();

      return notification;
    } catch (error) {
      console.error('❌ Erreur lors du marquage de la notification:', error);
      throw error;
    }
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  async markAllAsRead(userId) {
    try {
      const result = await Notification.updateMany(
        { recipientId: userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );

      return result;
    } catch (error) {
      console.error('❌ Erreur lors du marquage de toutes les notifications:', error);
      throw error;
    }
  }

  /**
   * Supprimer une notification
   */
  async deleteNotification(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        recipientId: userId
      });

      if (!notification) {
        throw new Error('Notification non trouvée ou accès refusé');
      }

      return notification;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de la notification:', error);
      throw error;
    }
  }

  /**
   * Supprimer toutes les notifications lues d'un utilisateur
   */
  async deleteReadNotifications(userId) {
    try {
      const result = await Notification.deleteMany({
        recipientId: userId,
        isRead: true
      });

      return result;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression des notifications lues:', error);
      throw error;
    }
  }
}

export default new NotificationService();
