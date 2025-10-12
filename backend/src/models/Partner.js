import mongoose from 'mongoose';
import slugify from '../utils/slugify.js';

const { Schema } = mongoose;

const partnerSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Le nom du partenaire est requis'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    enum: ['restauration', 'culture', 'sport', 'commerce', 'autre']
  },
  logo: {
    url: {
      type: String,
      required: [true, 'Le logo est requis']
    },
    publicId: {
      type: String,
      required: true
    }
  },
  website: {
    type: String,
    match: [/^https?:\/\/.+/, 'URL invalide']
  },
  description: {
    type: String
  },
  advantages: {
    type: String
  },
  contactEmail: {
    type: String,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  contactPhone: {
    type: String
  },
  address: {
    type: String
  },
  socialLinks: {
    facebook: String,
    instagram: String,
    twitter: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
partnerSchema.index({ category: 1 });
partnerSchema.index({ displayOrder: 1 });

const Partner = mongoose.model('Partner', partnerSchema);

export default Partner;
