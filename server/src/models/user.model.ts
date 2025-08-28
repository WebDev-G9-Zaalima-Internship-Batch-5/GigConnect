import { Schema, model, Document, Types, Model } from "mongoose";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import type { Secret, SignOptions } from "jsonwebtoken";
import { IUser, IUserMethods, UserRole } from "../types/user.types.js";

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
      url: String,
      publicId: String,
    },
    refreshTokens: [
      {
        token: { type: String, required: true },
        createdAt: { type: Date, required: true, default: Date.now },
        expiresAt: {
          type: Date,
          required: true,
          default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        ip: { type: String },
        userAgent: { type: String },
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    isProfileComplete: {
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
    passwordResetToken: {
      type: String,
    },
    passwordResetExpiry: {
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

UserSchema.index({ role: 1 });
UserSchema.index({ isVerified: 1 });
UserSchema.index({ isActive: 1 });

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

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

UserSchema.methods.generateRefreshToken = function (): {
  raw: string;
  hashed: string;
} {
  const raw = crypto.randomBytes(64).toString("hex");
  const hashed = crypto.createHash("sha256").update(raw).digest("hex"); // store hashed in DB
  return { raw, hashed };
};

UserSchema.methods.generatePasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpiry = new Date(Date.now() + 1000 * 60 * 10);

  return resetToken;
};

// Combine the schema interface and the methods interface
export type UserModelType = Model<IUser, {}, IUserMethods>;

export const User = model<IUser, UserModelType>("User", UserSchema);
