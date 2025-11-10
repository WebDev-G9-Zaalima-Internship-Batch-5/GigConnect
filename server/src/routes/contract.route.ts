import { Router } from "express";
import {
    getUserContracts,
    getContractById,
    updateContract,
    proposeContract,
    updateContractDraft,
    submitContract,
    acceptContractByFreelancer,
    rejectContractByFreelancer,
    fundEscrowInit,
    getContractByApplication,
    verifyRazorpayPayment,
} from "../controllers/contract.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import { UserRole } from "../types/user.types.js";

const router = Router();

// All contract routes are private
router.use(verifyJWT);

router.route("/").get(getUserContracts);
router.route("/:contractId").get(getContractById).put(updateContract);

// New flows
router.post("/propose", checkRole([UserRole.CLIENT]), proposeContract);
router.patch("/:contractId", checkRole([UserRole.CLIENT]), updateContractDraft);
router.post("/:contractId/submit", checkRole([UserRole.CLIENT]), submitContract);
router.post(
  "/:contractId/accept",
  checkRole([UserRole.FREELANCER]),
  acceptContractByFreelancer
);
router.post(
  "/:contractId/reject",
  checkRole([UserRole.FREELANCER]),
  rejectContractByFreelancer
);
router.post(
  "/:contractId/fund-escrow",
  checkRole([UserRole.CLIENT]),
  fundEscrowInit
);
router.post(
  "/:contractId/razorpay/verify",
  checkRole([UserRole.CLIENT]),
  verifyRazorpayPayment
);
router.get(
  "/by-application/:applicationId",
  getContractByApplication
);

export default router;
