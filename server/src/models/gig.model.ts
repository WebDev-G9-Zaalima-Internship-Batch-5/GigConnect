import { Document, model, Schema, Types } from "mongoose";

export enum GigStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface IGig extends Document {
  _id: Types.ObjectId;
  clientId: Types.ObjectId; // Must be a CLIENT role user
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  skillsRequired: string[];
  experienceLevel: "entry" | "intermediate" | "expert";
  budget: {
    type: "fixed" | "hourly";
    amount: number;
    currency: string;
  };
  duration: string;
  expectedStartDate?: Date;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    isRemote: boolean;
  };
  status: GigStatus;
  deadline?: Date;
  attachments: string[];
  requirements: string[];
  deliverables: string[];
  applicationsCount: number;
  viewsCount: number;
  isUrgent: boolean;
  isFeatured: boolean;
  preferredFreelancerLocation?: string;
  communicationStyle?: string;
  projectComplexity: "simple" | "moderate" | "complex";
  createdAt: Date;
  updatedAt: Date;
}

const GigSchema = new Schema<IGig>(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subCategory: {
      type: String,
      trim: true,
    },
    skillsRequired: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    experienceLevel: {
      type: String,
      enum: ["entry", "intermediate", "expert"],
      required: true,
    },
    budget: {
      type: {
        type: String,
        enum: ["fixed", "hourly"],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },
    duration: {
      type: String,
      required: true,
    },
    expectedStartDate: {
      type: Date,
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      pincode: { type: String, required: true },
      coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
      isRemote: { type: Boolean, default: false },
    },
    status: {
      type: String,
      enum: Object.values(GigStatus),
      default: GigStatus.OPEN,
    },
    deadline: {
      type: Date,
    },
    attachments: [
      {
        type: String,
      },
    ],
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    deliverables: [
      {
        type: String,
        trim: true,
      },
    ],
    applicationsCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    isUrgent: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    preferredFreelancerLocation: {
      type: String,
      trim: true,
    },
    communicationStyle: {
      type: String,
      trim: true,
    },
    projectComplexity: {
      type: String,
      enum: ["simple", "moderate", "complex"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

GigSchema.index({ "location.coordinates": "2dsphere" });
GigSchema.index({ clientId: 1 });
GigSchema.index({ status: 1 });
GigSchema.index({ skillsRequired: 1 });
GigSchema.index({ category: 1 });
GigSchema.index({ experienceLevel: 1 });
GigSchema.index({ createdAt: -1 });
GigSchema.index({ isFeatured: -1 });

export const Gig = model<IGig>("Gig", GigSchema);
