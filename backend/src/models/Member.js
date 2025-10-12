import mongoose from 'mongoose';

const { Schema } = mongoose;

const memberSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Le rôle est requis'],
    enum: [
      'Président',
      'Vice-Président',
      'Trésorier',
      'Vice-Trésorier',
      'Secrétaire',
      'Responsable Communication',
      'Responsable Événements',
      'Responsable Partenariats',
      'Responsable Clubs',
      'Membre'
    ]
  },
  photo: {
    url: {
      type: String,
      required: [true, 'La photo est requise']
    },
    publicId: {
      type: String,
      required: true
    }
  },
  bio: {
    type: String,
    maxlength: [500, 'La bio ne peut pas dépasser 500 caractères']
  },
  email: {
    type: String,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  promotion: {
    type: String
  },
  // NOUVEAU: Référence au BDE
  bdeId: {
    type: Schema.Types.ObjectId,
    ref: 'BDE',
    required: [true, 'Le BDE est requis']
  },
  socialLinks: {
    linkedin: String,
    instagram: String,
    twitter: String
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for full name
memberSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON
memberSchema.set('toJSON', { virtuals: true });
memberSchema.set('toObject', { virtuals: true });

// Indexes
memberSchema.index({ bdeId: 1 });
memberSchema.index({ displayOrder: 1 });
memberSchema.index({ isActive: 1 });

const Member = mongoose.model('Member', memberSchema);

export default Member;
