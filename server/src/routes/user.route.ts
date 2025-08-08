import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  resendVerificationEmail,
  verifyUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verify-email").get(verifyUser);

// Secured routes
router
  .route("/resend-verification-email")
  .post(verifyJWT, resendVerificationEmail);
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
