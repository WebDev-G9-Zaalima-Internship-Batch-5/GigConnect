import { Schema, model, Document, Types, Model } from "mongoose";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import type { Secret, SignOptions } from "jsonwebtoken";

export enum UserRole {
  CLIENT = "client",
  FREELANCER = "freelancer",
  ADMIN = "admin",
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  role: UserRole;
  fullName: string;
  phone?: string;
  avatar?: string;
  location: {
    type: {
      type: String;
      enum: ["Point"];
    };
    coordinates: {
      type: [Number]; // [longitude, latitude]
    };
    address: { type: String; trim: true };
    city: { type: String; trim: true };
    state: { type: String; trim: true };
    country: { type: String; trim: true };
    pincode: { type: String; trim: true };
  };
  refreshToken: string;
  isVerified: boolean;
  isActive: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
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
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      immutable: true, // Role cannot be changed after creation
    },
    fullName: {
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
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
      address: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      pincode: { type: String, trim: true },
    },
    refreshToken: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpiry: {
      type: Date,
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
UserSchema.index({ location: "2dsphere" });
UserSchema.index({ role: 1 });
UserSchema.index({ role: 1, location: "2dsphere" });

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to check if the password is correct.
UserSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// Method to generate email verification token
UserSchema.methods.generateVerificationToken = function (): string {
  const token = crypto.randomBytes(20).toString("hex");

  this.verificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // Set expiry to 15 minutes from now
  this.verificationTokenExpiry = new Date(Date.now() + 60 * 360 * 1000);

  return token;
};

// Method to generate an access token.
UserSchema.methods.generateAccessToken = function (): string {
  const secret = process.env.ACCESS_TOKEN_SECRET as Secret;
  const expiry = process.env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"];

  if (!secret || !expiry) {
    throw new Error(
      "Missing access token secret or expiry environment variable."
    );
  }

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: expiry,
    }
  );
};

// Method to generate a refresh token.
UserSchema.methods.generateRefreshToken = function (): string {
  const secret = process.env.REFRESH_TOKEN_SECRET as Secret;
  const expiry = process.env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"];

  if (!secret || !expiry) {
    throw new Error(
      "Missing refresh token secret or expiry environment variable."
    );
  }
  return jwt.sign(
    {
      _id: this._id,
    },
    secret,
    {
      expiresIn: expiry,
    }
  );
};

export interface IUserMethods {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
  generateVerificationToken(): string;
}

// Combine the schema interface and the methods interface
export type UserModelType = Model<IUser, {}, IUserMethods>;

export const User = model<IUser, UserModelType>("User", UserSchema);
