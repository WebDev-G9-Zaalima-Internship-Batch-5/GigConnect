import { Router } from "express";
import {
    createReview,
    getUserReviews
} from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public route
router.route("/user/:userId").get(getUserReviews);

// Private route
router.use(verifyJWT);
router.route("/").post(createReview);

export default router;
