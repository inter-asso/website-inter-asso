import mongoose from "mongoose";
import slugify from "../utils/slugify.js";

const { Schema } = mongoose;

const bdeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom du BDE est requis"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: [true, "Le nom complet est requis"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "La description est requise"],
      maxlength: [500, "La description ne peut pas dépasser 500 caractères"],
    },
    logo: {
      url: {
        type: String,
        required: [true, "Le logo est requis"],
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    colors: {
      primary: {
        type: String,
        required: [true, "La couleur primaire est requise"],
        match: [
          /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
          "Format de couleur invalide (hex requis)",
        ],
      },
      secondary: {
        type: String,
        required: [true, "La couleur secondaire est requise"],
        match: [
          /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
          "Format de couleur invalide (hex requis)",
        ],
      },
    },
    socialLinks: {
      instagram: {
        type: String,
        trim: true,
      },
      facebook: {
        type: String,
        trim: true,
      },
      twitter: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
    },
    contactEmail: {
      type: String,
      required: [true, "L'email de contact est requis"],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email invalide"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from name
bdeSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name);
  }
  next();
});

// Indexes
bdeSchema.index({ slug: 1 }, { unique: true });
bdeSchema.index({ displayOrder: 1 });

// Virtual: Get events count
bdeSchema.virtual("eventsCount", {
  ref: "Event",
  localField: "_id",
  foreignField: "bdeId",
  count: true,
});

// Virtual: Get members count
bdeSchema.virtual("membersCount", {
  ref: "Member",
  localField: "_id",
  foreignField: "bdeId",
  count: true,
});

const BDE = mongoose.model("BDE", bdeSchema);

export default BDE;
