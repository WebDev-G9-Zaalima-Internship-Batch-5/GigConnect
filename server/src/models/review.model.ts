import { Schema, model, Document, Types } from "mongoose";

export interface IReview extends Document {
  _id: Types.ObjectId;
  contractId: Types.ObjectId;
  fromUserId: Types.ObjectId;
  toUserId: Types.ObjectId;
  fromUserRole: "client" | "freelancer";
  toUserRole: "client" | "freelancer";
  rating: number;
  comment: string;
  skills?: string[]; // Only for freelancer reviews
  communication: number;
  quality: number;
  professionalism: number;
  timeliness: number;
  wouldWorkAgain: boolean;
  isVisible: boolean;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    contractId: {
      type: Schema.Types.ObjectId,
      ref: "Contract",
      required: true,
    },
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fromUserRole: {
      type: String,
      enum: ["client", "freelancer"],
      required: true,
    },
    toUserRole: {
      type: String,
      enum: ["client", "freelancer"],
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    communication: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    quality: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    professionalism: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    timeliness: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    wouldWorkAgain: {
      type: Boolean,
      required: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ReviewSchema.index({ contractId: 1, fromUserId: 1 }, { unique: true });
ReviewSchema.index({ toUserId: 1 });
ReviewSchema.index({ rating: -1 });
ReviewSchema.index({ fromUserRole: 1 });
ReviewSchema.index({ toUserRole: 1 });

export const Review = model<IReview>("Review", ReviewSchema);
