import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { UserRole } from "../types/user.types.js";

export const checkRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized: No user found"));
    }

    const userRole = req.user.role as UserRole;

    if (!roles.includes(userRole)) {
      return next(
        new ApiError(
          403,
          `Forbidden: Role (${userRole}) is not allowed to access this resource`
        )
      );
    }

    next();
  };
};
