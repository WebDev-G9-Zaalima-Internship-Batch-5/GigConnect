import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { registerUser, verifyUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/verify-email").get(verifyUser);

export default router;
