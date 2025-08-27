import { ApiError } from "./ApiError.js";
import { Request } from "express";
import { UserDoc } from "../types/user.types.js";

export const generateAccessAndRefreshTokens = async (
  user: UserDoc,
  req: Request
) => {
  try {
    const accessToken = user.generateAccessToken();
    const { raw: rawRefreshToken, hashed: hashedRefreshToken } =
      user.generateRefreshToken();

    user.refreshTokens.push({
      token: hashedRefreshToken,
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
