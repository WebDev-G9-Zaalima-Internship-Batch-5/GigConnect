import { Router } from "express";
import {
    applyForGig,
    getGigApplications,
    updateApplicationStatus
} from "../controllers/application.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import { UserRole } from "../models/user.model.js";

const router = Router({ mergeParams: true });

// Freelancer route
router.route("/apply").post(verifyJWT, checkRole([UserRole.FREELANCER]), applyForGig);

// Client routes
router.route("/").get(verifyJWT, checkRole([UserRole.CLIENT]), getGigApplications);
router.route("/:applicationId").patch(verifyJWT, checkRole([UserRole.CLIENT]), updateApplicationStatus);

export default router;
