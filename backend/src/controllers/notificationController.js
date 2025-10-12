import notificationService from '../services/notificationService.js';

/**
 * Récupérer les notifications de l'utilisateur connecté
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;
    const onlyUnread = req.query.unread === 'true';

    const notifications = await notificationService.getUserNotifications(userId, limit, onlyUnread);

    res.json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des notifications',
      details: error.message
    });
  }
};

/**
 * Compter les notifications non lues
 */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await notificationService.getUnreadCount(userId);

    res.json({
      success: true,
      unreadCount: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors du comptage des notifications',
      details: error.message
    });
  }
};

/**
 * Marquer une notification comme lue
 */
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const notification = await notificationService.markAsRead(notificationId, userId);

    res.json({
      success: true,
      message: 'Notification marquée comme lue',
      notification
    });
  } catch (error) {
    res.status(error.message.includes('non trouvée') ? 404 : 500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Marquer toutes les notifications comme lues
 */
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await notificationService.markAllAsRead(userId);

    res.json({
      success: true,
      message: 'Toutes les notifications ont été marquées comme lues',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors du marquage des notifications',
      details: error.message
    });
  }
};

/**
 * Supprimer une notification
 */
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    await notificationService.deleteNotification(notificationId, userId);

    res.json({
      success: true,
      message: 'Notification supprimée'
    });
  } catch (error) {
    res.status(error.message.includes('non trouvée') ? 404 : 500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Supprimer toutes les notifications lues
 */
export const deleteReadNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await notificationService.deleteReadNotifications(userId);

    res.json({
      success: true,
      message: 'Notifications lues supprimées',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression des notifications',
      details: error.message
    });
  }
};
