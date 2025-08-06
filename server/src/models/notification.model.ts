import { Schema, model, Document, Types } from "mongoose";

export interface INotification extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  userRole: "client" | "freelancer";
  title: string;
  message: string;
  type:
    | "gig_application"
    | "message"
    | "payment"
    | "review"
    | "contract"
    | "milestone"
    | "general";
  relatedId?: Types.ObjectId;
  actionUrl?: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userRole: {
      type: String,
      enum: ["client", "freelancer"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "gig_application",
        "message",
        "payment",
        "review",
        "contract",
        "milestone",
        "general",
      ],
      required: true,
    },
    relatedId: {
      type: Schema.Types.ObjectId,
    },
    actionUrl: {
      type: String,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ userRole: 1 });

export const Notification = model<INotification>(
  "Notification",
  NotificationSchema
);
