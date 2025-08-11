import { Router } from "express";
import {
    createClientProfile,
    createFreelancerProfile,
    getUserProfile,
    updateUserProfile
} from "../controllers/profile.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public route
router.route("/:userId").get(getUserProfile);

// Private routes
router.route("/client").post(verifyJWT, createClientProfile);
router.route("/freelancer").post(verifyJWT, createFreelancerProfile);
router.route("/:userId").put(verifyJWT, updateUserProfile);

export default router;
