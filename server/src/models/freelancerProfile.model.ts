import { Schema, model, Document, Types } from "mongoose";

export interface IFreelancerProfile extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  bio: string;
  skills: string[];
  hourlyRate: number;
  availability: "available" | "busy" | "not_available";
  portfolio: {
    title: string;
    description: string;
    images: string[];
    projectUrl?: string;
    technologies?: string[];
    completionDate: Date;
  }[];
  experience: {
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    description: string;
    isCurrentJob: boolean;
  }[];
  education: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: Date;
    endDate?: Date;
    isCurrentlyStudying: boolean;
  }[];
  certifications: {
    name: string;
    issuer: string;
    dateIssued: Date;
    expiryDate?: Date;
    credentialUrl?: string;
  }[];
  languages: {
    language: string;
    proficiency: "basic" | "intermediate" | "advanced" | "native";
  }[];
  rating: number;
  totalReviews: number;
  completedGigs: number;
  totalEarnings: number;
  successRate: number;
  responseTime: number; // in hours
  profileViews: number;
  isTopRated: boolean;
  specializationAreas: string[];
  workPreferences: {
    remoteOnly: boolean;
    willingToTravel: boolean;
    maxTravelDistance: number; // in km
    preferredProjectDuration: string[];
    minimumBudget: number;
  };
  socialLinks: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    behance?: string;
    dribbble?: string;
  };
  isProfileComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FreelancerProfileSchema = new Schema<IFreelancerProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    bio: {
      type: String,
      maxlength: 1000,
    },
    skills: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    hourlyRate: {
      type: Number,
      min: 0,
    },
    availability: {
      type: String,
      enum: ["available", "busy", "not_available"],
      default: "available",
    },
    portfolio: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        images: [{ type: String }],
        projectUrl: { type: String },
        technologies: [{ type: String }],
        completionDate: { type: Date, required: true },
      },
    ],
    experience: [
      {
        company: { type: String, required: true },
        position: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        description: { type: String, required: true },
        isCurrentJob: { type: Boolean, default: false },
      },
    ],
    education: [
      {
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        fieldOfStudy: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        isCurrentlyStudying: { type: Boolean, default: false },
      },
    ],
    certifications: [
      {
        name: { type: String, required: true },
        issuer: { type: String, required: true },
        dateIssued: { type: Date, required: true },
        expiryDate: { type: Date },
        credentialUrl: { type: String },
      },
    ],
    languages: [
      {
        language: { type: String, required: true },
        proficiency: {
          type: String,
          enum: ["basic", "intermediate", "advanced", "native"],
          required: true,
        },
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    completedGigs: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },
    successRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    responseTime: {
      type: Number,
      default: 24,
    },
    profileViews: {
      type: Number,
      default: 0,
    },
    isTopRated: {
      type: Boolean,
      default: false,
    },
    specializationAreas: [
      {
        type: String,
        trim: true,
      },
    ],
    workPreferences: {
      remoteOnly: { type: Boolean, default: false },
      willingToTravel: { type: Boolean, default: false },
      maxTravelDistance: { type: Number, default: 0 },
      preferredProjectDuration: [{ type: String }],
      minimumBudget: { type: Number, default: 0 },
    },
    socialLinks: {
      linkedin: { type: String },
      github: { type: String },
      portfolio: { type: String },
      behance: { type: String },
      dribbble: { type: String },
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

// FreelancerProfileSchema.index({ userId: 1 });
FreelancerProfileSchema.index({ skills: 1 });
FreelancerProfileSchema.index({ rating: -1 });
FreelancerProfileSchema.index({ hourlyRate: 1 });
FreelancerProfileSchema.index({ availability: 1 });
FreelancerProfileSchema.index({ specializationAreas: 1 });
FreelancerProfileSchema.index({ isTopRated: -1 });

export const FreelancerProfile = model<IFreelancerProfile>(
  "FreelancerProfile",
  FreelancerProfileSchema
);
