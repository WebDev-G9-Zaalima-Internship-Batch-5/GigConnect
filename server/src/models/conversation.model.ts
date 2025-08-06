import { Schema, model, Document, Types } from "mongoose";

export interface IConversation extends Document {
  _id: Types.ObjectId;
  participants: Types.ObjectId[]; // Always client + freelancer
  gigId?: Types.ObjectId;
  contractId?: Types.ObjectId;
  lastMessage?: string;
  lastMessageAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    gigId: {
      type: Schema.Types.ObjectId,
      ref: "Gig",
    },
    contractId: {
      type: Schema.Types.ObjectId,
      ref: "Contract",
    },
    lastMessage: {
      type: String,
      trim: true,
    },
    lastMessageAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ lastMessageAt: -1 });

// Ensure only 2 participants (client + freelancer)
ConversationSchema.pre("validate", function (next) {
  if (this.participants.length !== 2) {
    next(new Error("Conversation must have exactly 2 participants"));
  } else {
    next();
  }
});

export const Conversation = model<IConversation>(
  "Conversation",
  ConversationSchema
);
