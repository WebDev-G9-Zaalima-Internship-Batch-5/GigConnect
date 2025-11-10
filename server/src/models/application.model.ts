import { Document, model, Schema, Types } from "mongoose";

export enum ApplicationStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export interface IApplication extends Document {
  _id: Types.ObjectId;
  gigId: Types.ObjectId;
  freelancerId: Types.ObjectId; // Must be a FREELANCER role user
  coverLetter: string;
  proposedRate: number;
  estimatedDuration: string;
  relevantExperience: string;
  portfolioSamples?: string[]; // References to portfolio items
  status: ApplicationStatus;
  appliedAt: Date;
  clientViewed: boolean;
  clientViewedAt?: Date;
}

const ApplicationSchema = new Schema<IApplication>({
  gigId: {
    type: Schema.Types.ObjectId,
    ref: "Gig",
    required: true,
  },
  freelancerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  coverLetter: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  proposedRate: {
    type: Number,
    required: true,
    min: 0,
  },
  estimatedDuration: {
    type: String,
    required: true,
  },
  relevantExperience: {
    type: String,
    required: true,
    maxlength: 500,
  },
  portfolioSamples: [
    {
      type: String,
    },
  ],
  status: {
    type: String,
    enum: Object.values(ApplicationStatus),
    default: ApplicationStatus.PENDING,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  clientViewed: {
    type: Boolean,
    default: false,
  },
  clientViewedAt: {
    type: Date,
  },
});

ApplicationSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true });
ApplicationSchema.index({ freelancerId: 1 });
ApplicationSchema.index({ status: 1 });
ApplicationSchema.index({ appliedAt: -1 });

export const Application = model<IApplication>(
  "Application",
  ApplicationSchema
);
