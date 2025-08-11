import { Router } from "express";
import {
    getUserContracts,
    getContractById,
    updateContract
} from "../controllers/contract.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All contract routes are private
router.use(verifyJWT);

router.route("/").get(getUserContracts);
router.route("/:contractId").get(getContractById).put(updateContract);

export default router;
