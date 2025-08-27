import { Document, HydratedDocument, Types } from "mongoose";

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
  refreshTokens: {
    token: string;
    createdAt?: Date;
    expiresAt?: Date;
    ip: string;
    userAgent: string;
  }[];
  isVerified: boolean;
  isProfileComplete: boolean;
  isActive: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  passwordResetToken?: string;
  passwordResetExpiry?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): { raw: string; hashed: string };
  generateVerificationToken(): string;
  generatePasswordResetToken(): string;
}

export type PublicUser = Omit<
  IUser,
  | "password"
  | "refreshTokens"
  | "verificationToken"
  | "verificationTokenExpiry"
  | "passwordResetToken"
  | "passwordResetExpiry"
>;

export type UserDoc = HydratedDocument<IUser, IUserMethods>;
