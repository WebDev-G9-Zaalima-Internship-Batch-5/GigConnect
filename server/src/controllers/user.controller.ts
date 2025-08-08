import { ApiError } from "../utils/ApiError.js";
import { IUser, IUserMethods } from "../models/user.model.js";
import type { HydratedDocument } from "mongoose";
import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import validator from "validator";
import { UserRole } from "../models/user.model.js";
import { sendVerificationEmail } from "../services/nodemailerd.service.js";
import crypto from "crypto";

type UserDoc = HydratedDocument<IUser, IUserMethods>;

const generateAccessAndRefreshTokens = async (user: UserDoc) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token in database.
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error: any) {
    throw new ApiError(
      500,
      `Something went wrong while generating access and refresh tokens: ${error.message}`
    );
  }
};

interface CloudinaryUploadResult {
  secure_url: string;
  url: string;
  public_id: string;
}

const AVATAR_FOLDER_PATH = "avatars";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  interface RegisterBody {
    email: string;
    password: string;
    role: UserRole;
    fullName: string;
  }

  const { email, password, role, fullName }: RegisterBody = req.body;

  // Validate user data.
  const fields = [email, password, role, fullName];
  if (
    fields.some(
      (field) => !field || (typeof field === "string" && field.trim() === "")
    )
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  // Check if the email is in proper format.
  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Invalid email format.");
  }

  // Check if user already exists.
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw new ApiError(409, "User with this email already exists.");
  }

  // Create a new User object and save it to the database.
  const user = await User.create({
    email,
    password,
    role,
    fullName,
  });

  if (!user) {
    throw new ApiError(500, "Failed to register user.");
  }

  // Send verification email
  const verificationToken = user.generateVerificationToken();
  const savedUser = await user.save({ validateBeforeSave: false });

  if (!savedUser) {
    throw new ApiError(500, "Failed to register user.");
  }

  const verificationUrl = `${process.env.BACKEND_URL}/api/v1/users/verify-email?token=${verificationToken}`;

  console.log("Verification URL:", verificationUrl);

  try {
    await sendVerificationEmail(user.email, verificationUrl);
  } catch (error) {
    console.error("Failed to send verification email:", error);
  }

  const { password: _, refreshToken, ...safeUser } = savedUser.toObject();

  // Return Response.
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        safeUser,
        "User registered successfully. Please check your email to verify your account."
      )
    );
});

const verifyUser = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.query;

  console.log("Token:", token);

  if (!token || typeof token !== "string") {
    return res.redirect(
      `${process.env.CORS_ORIGIN}/verification-failed?error=invalid_token`
    );
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token.trim())
    .digest("hex");

  console.log("Hashed Token:", hashedToken);

  const user = await User.findOne({
    verificationToken: hashedToken,
    /* verificationTokenExpiry: { $gt: new Date() }, */
  }).select("-password -refreshToken");

  console.log("User:", user);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (user.isVerified) {
    throw new ApiError(400, "User already verified.");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  await user.save({ validateBeforeSave: false });

  res.redirect(`${process.env.CORS_ORIGIN}/dashboard`);
});

const resendVerificationEmail = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "User is not logged in.");

    const user = req.user as UserDoc;
    if (user.isVerified) {
      throw new ApiError(400, "User already verified.");
    }

    const verificationToken = user.generateVerificationToken();
    const savedUser = await user.save({ validateBeforeSave: false });

    if (!savedUser) {
      throw new ApiError(500, "Failed to resend verification email.");
    }

    const verificationUrl = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${verificationToken}`;

    try {
      await sendVerificationEmail(user.email, verificationUrl);
    } catch (error) {
      console.error("Failed to send verification email:", error);
      throw new ApiError(
        500,
        "Failed to send verification email. Please try again later."
      );
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "Verification email sent successfully. Please check your email to verify your account."
        )
      );
  }
);

export { registerUser, verifyUser, resendVerificationEmail };
