import { Router } from "express";
import {
    createGig,
    getAllGigs,
    getGigById,
    updateGig,
    deleteGig
} from "../controllers/gig.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import { UserRole } from "../models/user.model.js";
import applicationRouter from "./application.route.js";

const router = Router();

// Nested routes for applications
router.use("/:gigId/applications", applicationRouter);

// Public routes
router.route("/").get(getAllGigs);
router.route("/:gigId").get(getGigById);

// Private routes (Client only)
router.route("/").post(verifyJWT, checkRole([UserRole.CLIENT]), createGig);
router.route("/:gigId").put(verifyJWT, checkRole([UserRole.CLIENT]), updateGig);
router.route("/:gigId").delete(verifyJWT, checkRole([UserRole.CLIENT]), deleteGig);

export default router;
