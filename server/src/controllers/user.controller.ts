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
import { generateAccessAndRefreshTokens } from "../utils/token.utils.js";

type UserDoc = HydratedDocument<IUser, IUserMethods>;

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

  try {
    await sendVerificationEmail(user.email, verificationUrl);
  } catch (error) {
    console.error("Failed to send verification email:", error);
  }

  const { password: _, refreshTokens, ...safeUser } = savedUser.toObject();

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

  if (!token || typeof token !== "string") {
    return res.redirect(
      `${process.env.CORS_ORIGIN}/verification-failed?error=invalid_token`
    );
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token.trim())
    .digest("hex");

  const user = await User.findOne({
    verificationToken: hashedToken,
    /* verificationTokenExpiry: { $gt: new Date() }, */
  }).select("-password -refreshToken");

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

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  interface LoginBody {
    email: string;
    password: string;
  }

  const { email, password }: LoginBody = req.body;

  if (!email?.trim() || !password?.trim()) {
    throw new ApiError(400, "Email and password are required.");
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Invalid email format.");
  }

  // Find user by email, including the password for verification
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  // Check if account is active
  if (!user.isActive) {
    throw new ApiError(
      403,
      "Your account has been deactivated. Please contact support."
    );
  }

  // Verify password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  // Update last login time
  user.lastLogin = new Date();

  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user,
    req
  );

  // Get user data without sensitive information for the response
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshTokens -verificationToken -verificationTokenExpiry"
  );

  // Set secure cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  // Set cookies and send response
  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const refreshTokenFromCookie = req.cookies.refreshToken;

  if (!refreshTokenFromCookie) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User already logged out"));
  }

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshTokenFromCookie)
    .digest("hex");

  const user = await User.findOne({
    "refreshTokens.token": hashedRefreshToken,
  });

  if (user) {
    // Remove the refresh token from the user's document
    user.refreshTokens = user.refreshTokens.filter(
      (rt) => rt.token !== hashedRefreshToken
    );
    await user.save({ validateBeforeSave: false });
  }

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  };

  res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export {
  registerUser,
  verifyUser,
  resendVerificationEmail,
  loginUser,
  logoutUser,
};
