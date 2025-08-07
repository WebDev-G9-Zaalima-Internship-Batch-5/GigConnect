import { Schema, model, Document, Types } from "mongoose";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
  refreshToken: string;
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
      immutable: true, // Role cannot be changed after creation
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
    refreshToken: {
      type: String,
      default: "",
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
UserSchema.index({ role: 1 });

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

export const User = model<IUser>("User", UserSchema);
