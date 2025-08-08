import { ApiError } from "./ApiError.js";
import { IUser, IUserMethods } from "../models/user.model.js";
import { HydratedDocument } from "mongoose";
import { Request } from "express";

type UserDoc = HydratedDocument<IUser, IUserMethods>;

export const generateAccessAndRefreshTokens = async (
  user: UserDoc,
  req: Request
) => {
  try {
    const accessToken = user.generateAccessToken();
    const { raw: rawRefreshToken, hashed: hashedRefreshToken } =
      user.generateRefreshToken();

    // Add the new refresh token to the user's document
    user.refreshTokens.push({
      token: hashedRefreshToken,
      createdAt: new Date(),
      ip: req.ip || "unknown",
      userAgent: req.headers["user-agent"] || "unknown",
    });

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken: rawRefreshToken };
  } catch (error: any) {
    throw new ApiError(
      500,
      `Something went wrong while generating access and refresh tokens: ${error.message}`
    );
  }
};
