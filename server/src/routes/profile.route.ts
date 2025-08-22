import { Router } from "express";
import {
  completeClientProfile,
  getUserProfile,
  updateUserProfile,
} from "../controllers/profile.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import { UserRole } from "../models/user.model.js";

const router = Router();

// Public route
router.route("/:userId").get(getUserProfile);

// Private routes
router
  .route("/complete-client-profile")
  .post(verifyJWT, checkRole([UserRole.CLIENT]), completeClientProfile);
router.route("/:userId").put(verifyJWT, updateUserProfile);

export default router;
