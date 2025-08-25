import { Router } from "express";
import {
  completeClientProfile,
  completeFreelancerProfile,
  getUserProfile,
  updateAvatar,
  updateUserProfile,
} from "../controllers/profile.controller.js";
import { isProfileComplete, isVerifiedUser, verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import { UserRole } from "../types/user.types.js";

const router = Router();

// Public route
router.route("/:userId").get(getUserProfile);

// Private routes
router
  .route("/complete-client-profile")
  .post(verifyJWT, isVerifiedUser, checkRole([UserRole.CLIENT]), completeClientProfile);
router
  .route("/complete-freelancer-profile")
  .post(verifyJWT, isVerifiedUser, checkRole([UserRole.FREELANCER]), completeFreelancerProfile);
router
  .route("/update-avatar")
  .post(verifyJWT, isVerifiedUser, isProfileComplete, updateAvatar);
router.route("/:userId").put(verifyJWT, updateUserProfile);

export default router;
