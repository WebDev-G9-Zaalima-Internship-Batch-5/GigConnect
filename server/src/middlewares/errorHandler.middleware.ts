import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  if (process.env.NODE_ENV === "development") {
    console.error("Error:", err);
  }

  return res
    .status(statusCode)
    .json(new ApiResponse<null>(statusCode, null, message));
};

export { errorHandler };
