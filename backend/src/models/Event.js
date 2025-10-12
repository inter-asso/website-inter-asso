import mongoose from 'mongoose';
import slugify from '../utils/slugify.js';

const { Schema } = mongoose;

const eventSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true
  },
  slug: {
    type: String,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  },
  date: {
    type: Date,
    required: [true, 'La date est requise']
  },
  endDate: {
    type: Date
  },
  location: {
    type: String,
    required: [true, 'Le lieu est requis']
  },
  category: {
    type: String,
    enum: ['soirée', 'sport', 'culture', 'autre'],
    default: 'autre'
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    alt: String
  }],
  coverImage: {
    url: String,
    publicId: String
  },
  maxParticipants: {
    type: Number
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  // NOUVEAU: Système de validation
  status: {
    type: String,
    enum: ['PENDING', 'PUBLISHED', 'REJECTED'],
    default: 'PENDING'
  },
  // Référence au BDE organisateur
  bdeId: {
    type: Schema.Types.ObjectId,
    ref: 'BDE',
    required: [true, 'Le BDE organisateur est requis']
  },
  // Si PUBLISHED
  publishedAt: {
    type: Date
  },
  publishedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  // Si REJECTED
  rejectionReason: {
    type: String
  },
  rejectedAt: {
    type: Date
  },
  rejectedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  // Anciens champs (optionnels)
  registrationRequired: {
    type: Boolean,
    default: false
  },
  registrations: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    email: String,
    registeredAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Generate slug before saving
eventSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title);
  }
  next();
});

// Par défaut: status PENDING pour nouveaux événements
eventSchema.pre('save', function(next) {
  if (this.isNew && !this.status) {
    this.status = 'PENDING';
  }
  next();
});

// Indexes for better query performance
eventSchema.index({ status: 1 });
eventSchema.index({ bdeId: 1 });
eventSchema.index({ date: -1 });
eventSchema.index({ slug: 1 }, { unique: true });
eventSchema.index({ category: 1 });
eventSchema.index({ createdBy: 1 });

const Event = mongoose.model('Event', eventSchema);

export default Event;
