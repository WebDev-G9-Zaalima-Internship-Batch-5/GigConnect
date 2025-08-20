import { Router } from "express";
import {
  forgotPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  resendVerificationEmail,
  resetPassword,
  verifyUser,
} from "../controllers/user.controller.js";
import { optionalVerifyJWT, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

// Secured routes
router.route("/get-current-user").get(verifyJWT, getCurrentUser);
router
  .route("/resend-verification-email")
  .post(verifyJWT, resendVerificationEmail);
router.route("/logout").post(verifyJWT, logoutUser);

// Optional verification
router.route("/verify-email").get(optionalVerifyJWT, verifyUser);

export default router;
