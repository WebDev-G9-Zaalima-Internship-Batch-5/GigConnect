import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { User } from "../models/user.model.js";
import { IUser } from "../models/user.model.js";

// Extend the Request interface to include the `user` property
declare module "express" {
  interface Request {
    user?: Omit<IUser, "password" | "refreshToken">;
  }
}

export const verifyJWT = asyncHandler(
  async (req: Request, _: Response, next: NextFunction) => {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      throw new ApiError(
        401,
        "Unauthorized Request :: No access token :: verifyJWT, auth.middleware"
      );
    }

    let decodedToken: JwtPayload | string;
    try {
      decodedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET as string
      );
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ApiError(
          401,
          "Access Token Expired :: verifyJWT, auth.middleware"
        );
      }

      throw new ApiError(
        401,
        "Invalid Access Token :: verifyJWT, auth.middleware"
      );
    }

    if (!decodedToken || typeof decodedToken === "string") {
      throw new ApiError(
        401,
        "Unauthorized Request :: Invalid access token :: verifyJWT, auth.middleware"
      );
    }

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(
        401,
        "Invalid Access Token :: verifyJWT, auth.middleware"
      );
    }

    req.user = user;
    next();
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
