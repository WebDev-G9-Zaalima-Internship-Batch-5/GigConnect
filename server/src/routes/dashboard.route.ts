import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import { UserRole } from "../types/user.types.js";
import { getClientDashboard, getFreelancerDashboard } from "../controllers/dashboard.controller.js";

const router = Router();

router.get(
  "/client",
  verifyJWT,
  checkRole([UserRole.CLIENT]),
  getClientDashboard
);

router.get(
  "/freelancer",
  verifyJWT,
  checkRole([UserRole.FREELANCER]),
  getFreelancerDashboard
);

export default router;
