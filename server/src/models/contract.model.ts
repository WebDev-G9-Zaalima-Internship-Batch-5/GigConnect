import { Schema, model, Document, Types } from "mongoose";

export interface IContract extends Document {
  _id: Types.ObjectId;
  gigId: Types.ObjectId;
  clientId: Types.ObjectId; // Must be CLIENT role
  freelancerId: Types.ObjectId; // Must be FREELANCER role
  applicationId: Types.ObjectId;
  agreedRate: number;
  agreedDuration: string;
  milestones: {
    title: string;
    description: string;
    amount: number;
    dueDate: Date;
    isCompleted: boolean;
    completedAt?: Date;
    clientApproved: boolean;
    approvedAt?: Date;
  }[];
  startDate: Date;
  endDate?: Date;
  actualEndDate?: Date;
  status: "pending" | "active" | "completed" | "cancelled" | "disputed";
  terms: string;
  clientSignedAt?: Date;
  freelancerSignedAt?: Date;
  // Proposal/acceptance flow
  clientSubmittedAt?: Date;
  freelancerAccepted: boolean;
  freelancerAcceptedAt?: Date;
  // Escrow summary
  escrowRequired: number;
  escrowFunded: number;
  escrowStatus: "unfunded" | "funded" | "released" | "refunded";
  escrowPaymentIds: Types.ObjectId[];
  totalPaid: number;
  remainingAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ContractSchema = new Schema<IContract>(
  {
    gigId: {
      type: Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
    },
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
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    agreedRate: {
      type: Number,
      required: true,
      min: 0,
    },
    agreedDuration: {
      type: String,
      required: true,
    },
    milestones: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        amount: { type: Number, required: true, min: 0 },
        dueDate: { type: Date, required: true },
        isCompleted: { type: Boolean, default: false },
        completedAt: { type: Date },
        clientApproved: { type: Boolean, default: false },
        approvedAt: { type: Date },
      },
    ],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    actualEndDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "active", "completed", "cancelled", "disputed"],
      default: "pending",
    },
    terms: {
      type: String,
      required: true,
    },
    clientSignedAt: {
      type: Date,
    },
    freelancerSignedAt: {
      type: Date,
    },
    clientSubmittedAt: {
      type: Date,
    },
    freelancerAccepted: {
      type: Boolean,
      default: false,
    },
    freelancerAcceptedAt: {
      type: Date,
    },
    escrowRequired: {
      type: Number,
      default: 0,
      min: 0,
    },
    escrowFunded: {
      type: Number,
      default: 0,
      min: 0,
    },
    escrowStatus: {
      type: String,
      enum: ["unfunded", "funded", "released", "refunded"],
      default: "unfunded",
    },
    escrowPaymentIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
    totalPaid: {
      type: Number,
      default: 0,
      min: 0,
    },
    remainingAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

ContractSchema.index({ gigId: 1 });
ContractSchema.index({ clientId: 1 });
ContractSchema.index({ freelancerId: 1 });
ContractSchema.index({ status: 1 });

export const Contract = model<IContract>("Contract", ContractSchema);
