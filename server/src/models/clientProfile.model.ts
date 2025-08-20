import { Schema, model, Document, Types } from "mongoose";

export interface IClientProfile extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  companyName?: string;
  companyWebsite?: string;
  businessType: "individual" | "startup" | "small_business" | "enterprise";
  industryType: string;
  description: string;
  projectsPosted: number;
  totalSpent: number;
  activeGigs: number;
  completedProjects: number;
  clientRating: number;
  totalReviews: number;
  verifiedPayment: boolean;
  preferredBudgetRange: {
    min: number;
    max: number;
    currency: string;
  };
  communicationPreferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    projectUpdates: boolean;
    promotionalEmails: boolean;
  };
  isProfileComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ClientProfileSchema = new Schema<IClientProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    companyWebsite: {
      type: String,
      trim: true,
    },
    businessType: {
      type: String,
      enum: ["individual", "startup", "small_business", "enterprise"],
    },
    industryType: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    projectsPosted: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
    activeGigs: {
      type: Number,
      default: 0,
    },
    completedProjects: {
      type: Number,
      default: 0,
    },
    clientRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    verifiedPayment: {
      type: Boolean,
      default: false,
    },
    communicationPreferences: {
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      projectUpdates: { type: Boolean, default: true },
      promotionalEmails: { type: Boolean, default: false },
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ClientProfileSchema.index({ businessType: 1 });
ClientProfileSchema.index({ industryType: 1 });
ClientProfileSchema.index({ clientRating: -1 });

export const ClientProfile = model<IClientProfile>(
  "ClientProfile",
  ClientProfileSchema
);
