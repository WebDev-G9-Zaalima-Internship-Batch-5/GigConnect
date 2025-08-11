import { Router } from "express";
import {
    getUserNotifications,
    markNotificationsAsRead
} from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All notification routes are private
router.use(verifyJWT);

router.route("/").get(getUserNotifications);
router.route("/mark-read").patch(markNotificationsAsRead);

export default router;
