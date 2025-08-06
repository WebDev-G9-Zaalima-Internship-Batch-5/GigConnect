import { Schema, model, Document, Types } from "mongoose";

// ===================== FREELANCER INVITE SCHEMA (CLIENT-ONLY) =====================
export interface IFreelancerInvite extends Document {
  _id: Types.ObjectId;
  clientId: Types.ObjectId; // Must be CLIENT role
  freelancerId: Types.ObjectId; // Must be FREELANCER role
  gigId: Types.ObjectId;
  message: string;
  status: "pending" | "accepted" | "declined" | "expired";
  invitedAt: Date;
  respondedAt?: Date;
  expiresAt: Date;
}

const FreelancerInviteSchema = new Schema<IFreelancerInvite>({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  freelancerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  gigId: {
    type: Schema.Types.ObjectId,
    ref: "Gig",
    required: true,
  },
  message: {
    type: String,
    required: true,
    maxlength: 500,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined", "expired"],
    default: "pending",
  },
  invitedAt: {
    type: Date,
    default: Date.now,
  },
  respondedAt: {
    type: Date,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

FreelancerInviteSchema.index({ clientId: 1 });
FreelancerInviteSchema.index({ freelancerId: 1 });
FreelancerInviteSchema.index({ gigId: 1 });
FreelancerInviteSchema.index({ status: 1 });
FreelancerInviteSchema.index({ expiresAt: 1 });

export const FreelancerInvite = model<IFreelancerInvite>(
  "FreelancerInvite",
  FreelancerInviteSchema
);
