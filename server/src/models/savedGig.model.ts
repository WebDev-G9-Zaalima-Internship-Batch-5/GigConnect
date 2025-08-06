import { Schema, model, Document, Types } from "mongoose";

// ===================== SAVED GIGS SCHEMA (FREELANCER-ONLY) =====================
export interface ISavedGig extends Document {
  _id: Types.ObjectId;
  freelancerId: Types.ObjectId; // Must be FREELANCER role
  gigId: Types.ObjectId;
  savedAt: Date;
}

const SavedGigSchema = new Schema<ISavedGig>({
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
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

SavedGigSchema.index({ freelancerId: 1, gigId: 1 }, { unique: true });
SavedGigSchema.index({ freelancerId: 1 });
SavedGigSchema.index({ savedAt: -1 });

export const SavedGig = model<ISavedGig>("SavedGig", SavedGigSchema);
