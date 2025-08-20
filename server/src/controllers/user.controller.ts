import { ApiError } from "../utils/ApiError.js";
import { IUser, IUserMethods } from "../models/user.model.js";
import type { HydratedDocument } from "mongoose";
import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import validator from "validator";
import { UserRole } from "../models/user.model.js";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../services/nodemailer.service.js";
import crypto from "crypto";
import { generateAccessAndRefreshTokens } from "../utils/token.utils.js";
import { FreelancerProfile } from "../models/freelancerProfile.model.js";
import { ClientProfile } from "../models/clientProfile.model.js";

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

  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Invalid email format.");
  }

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw new ApiError(409, "User with this email already exists.");
  }

  const user = await User.create({
    email,
    password,
    role,
    fullName,
  });

  if (!user) {
    throw new ApiError(500, "Failed to register user.");
  }

  // Create a freelancer or client profile based on the user's role.
  if (user.role === UserRole.FREELANCER) {
    await FreelancerProfile.create({ userId: user._id });
  } else if (user.role === UserRole.CLIENT) {
    await ClientProfile.create({ userId: user._id });
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

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user,
    req
  );

  const {
    password: _,
    refreshTokens,
    verificationToken: _verificationToken,
    verificationTokenExpiry,
    passwordResetToken,
    passwordResetExpiry,
    ...safeUser
  } = user.toObject();

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        {
          user: safeUser,
        },
        "User registered successfully. Please check your email to verify your account."
      )
    );
});

const verifyUser = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    const corsOrigin =
      process.env.NODE_ENV === "development"
        ? process.env.CORS_ORIGIN_LOCAL
        : process.env.CORS_ORIGIN_PROD;
    return res.redirect(
      `${corsOrigin}/verification-failed?error=invalid_token`
    );
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token.trim())
    .digest("hex");

  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpiry: { $gt: new Date() },
  }).select(
    "-password -verificationToken -verificationTokenExpiry -passwordResetToken -passwordResetExpiry"
  );

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (user.isVerified) {
    throw new ApiError(400, "User already verified.");
  }
  const alreadyLoggedIn = req.user?.toString() === user._id.toString();

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  const savedUser = await user.save({ validateBeforeSave: false });

  if (!savedUser) {
    throw new ApiError(500, "Failed to verify user.");
  }

  const corsOrigin =
    process.env.NODE_ENV === "development"
      ? process.env.CORS_ORIGIN_LOCAL
      : process.env.CORS_ORIGIN_PROD;

  if (alreadyLoggedIn) {
    return res.redirect(`${corsOrigin}/dashboard`);
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user,
    req
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .redirect(`${corsOrigin}/dashboard`);
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
      throw new ApiError(
        500,
        "Failed to resend verification email. Please try again later."
      );
    }

    const verificationUrl = `${process.env.BACKEND_URL}/api/v1/users/verify-email?token=${verificationToken}`;

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

  if (!user.isActive) {
    throw new ApiError(
      403,
      "Your account has been deactivated. Please contact support."
    );
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  // Note: lastLogin will be saved in generateAccessAndRefreshTokens()
  user.lastLogin = new Date();

  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user,
    req
  );

  const {
    password: _,
    refreshTokens,
    verificationToken,
    verificationTokenExpiry,
    passwordResetToken,
    passwordResetExpiry,
    ...safeUser
  } = user.toObject();

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: safeUser,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  };

  if (!refreshToken) {
    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .json(new ApiResponse(200, null, "User already logged out"));
  }

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const user = await User.findOne({
    "refreshTokens.token": hashedRefreshToken,
  });

  if (user) {
    user.refreshTokens = user.refreshTokens.filter(
      (rt) => rt.token !== hashedRefreshToken
    );
    await user.save({ validateBeforeSave: false });
  }

  res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "User is not logged in.");

  res
    .status(200)
    .json(
      new ApiResponse(200, { user: req.user }, "User fetched successfully")
    );
});

const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email?.trim()) {
    throw new ApiError(400, "Email is required.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "Password reset email sent. Please check your inbox. The link will expire in 10 minutes."
        )
      );
  }

  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CORS_ORIGIN_LOCAL}/reset-password?token=${resetToken}&email=${user.email}`;

  try {
    await sendPasswordResetEmail(user.email, resetUrl);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "Password reset email sent. Please check your inbox. The link will expire in 10 minutes."
        )
      );
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    console.error("Failed to send password reset email:", error);
    throw new ApiError(
      500,
      "Failed to send password reset email. Please try again later."
    );
  }
});

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  interface ResetPasswordBody {
    password: string;
    token: string;
    email: string;
  }

  const { password, token, email }: ResetPasswordBody = req.body;

  console.log(req.body);

  if (!password || !token || !email) {
    throw new ApiError(400, "Invalid request.");
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Invalid email format.");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    email,
    passwordResetToken: hashedToken,
    passwordResetExpiry: { $gt: new Date() },
  });

  if (!user) {
    throw new ApiError(400, "Password reset token is invalid or has expired.");
  }

  user.password = password;

  user.passwordResetToken = undefined;
  user.passwordResetExpiry = undefined;

  const savedUser = await user.save();

  if (!savedUser) {
    throw new ApiError(500, "Failed to reset password.");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user,
    req
  );

  const {
    password: _,
    refreshTokens,
    verificationToken,
    verificationTokenExpiry,
    passwordResetToken,
    passwordResetExpiry,
    ...safeUser
  } = savedUser.toObject();

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: safeUser,
        },
        "Password reset successfully."
      )
    );
});

export {
  registerUser,
  verifyUser,
  resendVerificationEmail,
  loginUser,
  logoutUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
};
