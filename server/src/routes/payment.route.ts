// import { Router } from "express";
// import {
//     createPaymentIntent,
//     confirmPayment,
//     getPaymentHistory
// } from "../controllers/payment.controller.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { checkRole } from "../middlewares/role.middleware.js";
// import { UserRole } from "../models/user.model.js";

// const router = Router();

// // All payment routes are private
// router.use(verifyJWT);

// router.route("/").get(getPaymentHistory);
// router.route("/create-intent").post(checkRole([UserRole.CLIENT]), createPaymentIntent);
// router.route("/confirm").post(checkRole([UserRole.CLIENT]), confirmPayment);

// export default router;
