import mongoose, { Document, Schema, Types } from "mongoose";

// Enums for better type safety
export enum UserRole {
  CLIENT = "client",
  FREELANCER = "freelancer",
  ADMIN = "admin",
}

export enum GigStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum ApplicationStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
}

// ===================== USER SCHEMA =====================
export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
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
  };
  isVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
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
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create geospatial index for location-based queries
UserSchema.index({ "location.coordinates": "2dsphere" });
UserSchema.index({ email: 1 });

// ===================== FREELANCER PROFILE SCHEMA =====================
export interface IFreelancerProfile extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  bio: string;
  skills: string[];
  hourlyRate: number;
  availability: string;
  portfolio: {
    title: string;
    description: string;
    images: string[];
    projectUrl?: string;
  }[];
  experience: {
    company: string;
    position: string;
    duration: string;
    description: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    dateIssued: Date;
    credentialUrl?: string;
  }[];
  languages: {
    language: string;
    proficiency: "basic" | "intermediate" | "advanced" | "native";
  }[];
  rating: number;
  totalReviews: number;
  completedGigs: number;
  responseTime: number; // in hours
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
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      required: true,
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
      required: true,
      min: 0,
    },
    availability: {
      type: String,
      required: true,
    },
    portfolio: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        images: [{ type: String }],
        projectUrl: { type: String },
      },
    ],
    experience: [
      {
        company: { type: String, required: true },
        position: { type: String, required: true },
        duration: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    certifications: [
      {
        name: { type: String, required: true },
        issuer: { type: String, required: true },
        dateIssued: { type: Date, required: true },
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
    responseTime: {
      type: Number,
      default: 24,
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

FreelancerProfileSchema.index({ userId: 1 });
FreelancerProfileSchema.index({ skills: 1 });
FreelancerProfileSchema.index({ rating: -1 });
FreelancerProfileSchema.index({ hourlyRate: 1 });

// ===================== GIG SCHEMA =====================
export interface IGig extends Document {
  _id: Types.ObjectId;
  clientId: Types.ObjectId;
  title: string;
  description: string;
  category: string;
  skillsRequired: string[];
  budget: {
    type: "fixed" | "hourly";
    amount: number;
    currency: string;
  };
  duration: string;
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
  applicationsCount: number;
  viewsCount: number;
  isUrgent: boolean;
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
    skillsRequired: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
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
GigSchema.index({ createdAt: -1 });

// ===================== APPLICATION SCHEMA =====================
export interface IApplication extends Document {
  _id: Types.ObjectId;
  gigId: Types.ObjectId;
  freelancerId: Types.ObjectId;
  coverLetter: string;
  proposedRate: number;
  estimatedDuration: string;
  status: ApplicationStatus;
  appliedAt: Date;
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
  status: {
    type: String,
    enum: Object.values(ApplicationStatus),
    default: ApplicationStatus.PENDING,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

ApplicationSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true });
ApplicationSchema.index({ freelancerId: 1 });
ApplicationSchema.index({ status: 1 });

// ===================== CONTRACT SCHEMA =====================
export interface IContract extends Document {
  _id: Types.ObjectId;
  gigId: Types.ObjectId;
  clientId: Types.ObjectId;
  freelancerId: Types.ObjectId;
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
  }[];
  startDate: Date;
  endDate?: Date;
  status: "active" | "completed" | "cancelled" | "disputed";
  terms: string;
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
      },
    ],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled", "disputed"],
      default: "active",
    },
    terms: {
      type: String,
      required: true,
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

// ===================== PAYMENT SCHEMA =====================
export interface IPayment extends Document {
  _id: Types.ObjectId;
  contractId: Types.ObjectId;
  milestoneId?: Types.ObjectId;
  clientId: Types.ObjectId;
  freelancerId: Types.ObjectId;
  amount: number;
  currency: string;
  paymentGateway: "razorpay" | "stripe";
  gatewayTransactionId?: string;
  status: PaymentStatus;
  paidAt?: Date;
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
  },
  {
    timestamps: true,
  }
);

PaymentSchema.index({ contractId: 1 });
PaymentSchema.index({ clientId: 1 });
PaymentSchema.index({ freelancerId: 1 });
PaymentSchema.index({ status: 1 });

// ===================== REVIEW SCHEMA =====================
export interface IReview extends Document {
  _id: Types.ObjectId;
  contractId: Types.ObjectId;
  fromUserId: Types.ObjectId;
  toUserId: Types.ObjectId;
  rating: number;
  comment: string;
  skills: string[];
  communication: number;
  quality: number;
  professionalism: number;
  isVisible: boolean;
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
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

ReviewSchema.index({ contractId: 1, fromUserId: 1 }, { unique: true });
ReviewSchema.index({ toUserId: 1 });
ReviewSchema.index({ rating: -1 });

// ===================== CONVERSATION SCHEMA =====================
export interface IConversation extends Document {
  _id: Types.ObjectId;
  participants: Types.ObjectId[];
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

// ===================== MESSAGE SCHEMA =====================
export interface IMessage extends Document {
  _id: Types.ObjectId;
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  content: string;
  messageType: MessageType;
  attachments: string[];
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    messageType: {
      type: String,
      enum: Object.values(MessageType),
      default: MessageType.TEXT,
    },
    attachments: [
      {
        type: String,
      },
    ],
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

MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1 });

// ===================== NOTIFICATION SCHEMA =====================
export interface INotification extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  message: string;
  type:
    | "gig_application"
    | "message"
    | "payment"
    | "review"
    | "contract"
    | "general";
  relatedId?: Types.ObjectId;
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
        "general",
      ],
      required: true,
    },
    relatedId: {
      type: Schema.Types.ObjectId,
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

// ===================== MODEL EXPORTS =====================
export const User = mongoose.model<IUser>("User", UserSchema);
export const FreelancerProfile = mongoose.model<IFreelancerProfile>(
  "FreelancerProfile",
  FreelancerProfileSchema
);
export const Gig = mongoose.model<IGig>("Gig", GigSchema);
export const Application = mongoose.model<IApplication>(
  "Application",
  ApplicationSchema
);
export const Contract = mongoose.model<IContract>("Contract", ContractSchema);
export const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);
export const Review = mongoose.model<IReview>("Review", ReviewSchema);
export const Conversation = mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema
);
export const Message = mongoose.model<IMessage>("Message", MessageSchema);
export const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
