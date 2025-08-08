import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { User } from "../models/user.model.js";
import { IUser } from "../models/user.model.js";
import { generateAccessAndRefreshTokens } from "../utils/token.utils.js";
import crypto from "crypto";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const verifyJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        throw new ApiError(401, "Unauthorized: No token provided.");
      }

      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as JwtPayload;

      const user = await User.findById(decodedToken?._id).select(
        "-password -refreshTokens"
      );

      if (!user) {
        throw new ApiError(401, "Invalid access token.");
      }

      req.user = user;
      return next();
    } catch (error: any) {
      if (error.name !== "TokenExpiredError") {
        throw new ApiError(401, error?.message || "Invalid access token.");
      }

      // Handle expired access token by trying to refresh it
      const incomingRefreshToken = req.cookies.refreshToken;
      if (!incomingRefreshToken) {
        throw new ApiError(
          401,
          "Unauthorized: Access token expired, no refresh token provided."
        );
      }

      const hashedRefreshToken = crypto
        .createHash("sha256")
        .update(incomingRefreshToken)
        .digest("hex");

      const user = await User.findOne({
        "refreshTokens.token": hashedRefreshToken,
      });

      if (!user) {
        throw new ApiError(
          401,
          "Unauthorized: Invalid or expired refresh token."
        );
      }

      // Remove the old refresh token
      user.refreshTokens = user.refreshTokens.filter(
        (rt) => rt.token !== hashedRefreshToken
      );

      await user.save({ validateBeforeSave: false });

      const { accessToken, refreshToken: newRefreshToken } =
        await generateAccessAndRefreshTokens(user, req);

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
      };

      res.cookie("accessToken", accessToken, cookieOptions);
      res.cookie("refreshToken", newRefreshToken, cookieOptions);

      // Attach the user to the request and proceed
      const refreshedUser = await User.findById(user._id).select(
        "-password -refreshTokens"
      );
      req.user = refreshedUser;
      return next();
    }
  }
);

export const optionalVerifyJWT = asyncHandler(
  async (req: Request, _: Response, next: NextFunction) => {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (accessToken) {
      try {
        const decodedToken = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET as string
        );

        if (decodedToken && typeof decodedToken !== "string") {
          const user = await User.findById(decodedToken._id).select(
            "-password -refreshToken"
          );
          if (user) {
            req.user = user;
          }
        }
      } catch (_) {
        // Do nothing, as this middleware is for optional check.
      }
    }

    next();
  }
);
