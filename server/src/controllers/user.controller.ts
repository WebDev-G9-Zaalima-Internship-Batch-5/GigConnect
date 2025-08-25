import { ApiError } from "../utils/ApiError.js";
import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import validator from "validator";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../services/nodemailer.service.js";
import crypto from "crypto";
import { generateAccessAndRefreshTokens } from "../utils/token.utils.js";
import { FreelancerProfile } from "../models/freelancerProfile.model.js";
import { ClientProfile } from "../models/clientProfile.model.js";
import { UserDoc, UserRole } from "../types/user.types.js";
import { cookieOptions } from "../consts/cookieOptions.const.js";
import { corsOrigin } from "../consts/cors.const.js";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  interface RegisterBody {
    email: string;
    password: string;
    role: UserRole;
    fullName: string;
  }

  const { email, password, role, fullName }: RegisterBody = req.body;

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

  if (role !== UserRole.FREELANCER && role !== UserRole.CLIENT) {
    throw new ApiError(400, "Invalid role.");
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new ApiError(
      400,
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    );
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
    return res.redirect(`${corsOrigin}/error?message=invalid_token`);
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token.trim())
    .digest("hex");

  const user = await User.findOneAndUpdate(
    {
      verificationToken: hashedToken,
      verificationTokenExpiry: { $gt: new Date() },
      isVerified: false,
    },
    {
      $set: { isVerified: true },
      $unset: { verificationToken: 1, verificationTokenExpiry: 1 },
    },
    {
      new: true,
      runValidators: true,
      select:
        "-password -refreshTokens -passwordResetToken -passwordResetExpiry",
    }
  );

  if (!user)
    return res.redirect(
      `${corsOrigin}/error?message=invalid_or_expired_token_or_already_verified`
    );

  const alreadyLoggedIn = req.user?._id?.toString() === user._id.toString();

  if (alreadyLoggedIn) {
    return res.redirect(`${corsOrigin}/dashboard`);
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user,
    req
  );

  res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .redirect(`${corsOrigin}/dashboard`);
});

const resendVerificationEmail = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "User is not logged in.");

    const user = req.user as UserDoc;
    if (user.isVerified) throw new ApiError(400, "User already verified.");

    const verificationToken = user.generateVerificationToken();

    await user.save({ validateBeforeSave: false });

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

  const user = await User.findOne({ email }).select(
    "-verificationToken -verificationTokenExpiry -passwordResetToken -passwordResetExpiry"
  );

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

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user,
    req
  );

  const { password: _, refreshTokens, ...safeUser } = user.toObject();

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

  if (!refreshToken) {
    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .json(new ApiResponse(200, null, "User logged out successfully"));
  }

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await User.findOneAndUpdate(
    { "refreshTokens.token": hashedRefreshToken },
    { $pull: { refreshTokens: { token: hashedRefreshToken } } }
  );

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

  if (!email?.trim() || !validator.isEmail(email)) {
    throw new ApiError(400, "Invalid email format.");
  }

  const user = await User.findOne({ email }).select(
    "email passwordResetToken passwordResetExpiry"
  );

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

  const resetUrl = `${corsOrigin}/reset-password?token=${resetToken}&email=${encodeURIComponent(
    user.email
  )}`;

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

  if (!password?.trim() || !token?.trim() || !email?.trim()) {
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

  user.passwordResetToken = undefined;
  user.passwordResetExpiry = undefined;
  user.password = password;

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
