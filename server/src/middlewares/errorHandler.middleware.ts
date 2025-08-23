import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import multer from "multer";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  if (err instanceof multer.MulterError) {
    const multerStatusCode = 400;
    const multerMessage = err.message || "File upload error";

    if (process.env.NODE_ENV === "development") {
      console.error("Multer Error:", err);
    }

    return res
      .status(multerStatusCode)
      .json(new ApiResponse<null>(multerStatusCode, null, multerMessage));
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  // if (process.env.NODE_ENV === "development") {
  //   console.error("Error:", err);
  // }
  console.error("Error:", err);

  return res
    .status(statusCode)
    .json(new ApiResponse<null>(statusCode, null, message));
};

export { errorHandler };
