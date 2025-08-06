import { Schema, model, Document, Types } from "mongoose";

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export interface IPayment extends Document {
  _id: Types.ObjectId;
  contractId: Types.ObjectId;
  milestoneId?: Types.ObjectId;
  clientId: Types.ObjectId; // Payer (CLIENT)
  freelancerId: Types.ObjectId; // Payee (FREELANCER)
  amount: number;
  platformFee: number;
  freelancerAmount: number; // Amount after platform fee
  currency: string;
  paymentGateway: "razorpay" | "stripe";
  gatewayTransactionId?: string;
  status: PaymentStatus;
  paidAt?: Date;
  escrowReleaseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    contractId: {
      type: Schema.Types.ObjectId,
      ref: "Contract",
      required: true,
    },
    milestoneId: {
      type: Schema.Types.ObjectId,
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
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    platformFee: {
      type: Number,
      required: true,
      min: 0,
    },
    freelancerAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    paymentGateway: {
      type: String,
      enum: ["razorpay", "stripe"],
      required: true,
    },
    gatewayTransactionId: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    paidAt: {
      type: Date,
    },
    escrowReleaseDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

PaymentSchema.index({ contractId: 1 });
PaymentSchema.index({ clientId: 1 });
PaymentSchema.index({ freelancerId: 1 });
PaymentSchema.index({ status: 1 });

export const Payment = model<IPayment>("Payment", PaymentSchema);
