import mongoose from 'mongoose';

const { Schema } = mongoose;

const notificationSchema = new Schema({
  type: {
    type: String,
    enum: ['EVENT_SUBMITTED', 'EVENT_VALIDATED', 'EVENT_REJECTED'],
    required: [true, 'Le type de notification est requis']
  },
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Le message est requis']
  },
  // Destinataire
  recipientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le destinataire est requis']
  },
  recipientRole: {
    type: String,
    enum: ['admin_interasso', 'admin_bde'],
    required: true
  },
  // Référence à l'événement concerné
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  // BDE concerné
  bdeId: {
    type: Schema.Types.ObjectId,
    ref: 'BDE'
  },
  // Statut de lecture
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ recipientId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ eventId: 1 });
notificationSchema.index({ type: 1 });

// Method: Marquer comme lu
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Static method: Get unread count for a user
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ recipientId: userId, isRead: false });
};

// Static method: Get notifications for a user
notificationSchema.statics.getUserNotifications = function(userId, limit = 20) {
  return this.find({ recipientId: userId })
    .populate('eventId', 'title slug date')
    .populate('bdeId', 'name logo')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method: Mark all as read for a user
notificationSchema.statics.markAllAsRead = async function(userId) {
  return this.updateMany(
    { recipientId: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
