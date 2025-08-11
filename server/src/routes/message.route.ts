import { Router } from "express";
import {
    sendMessage,
    getConversationMessages,
    getConversations
} from "../controllers/message.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All message routes are private
router.use(verifyJWT);

router.route("/").post(sendMessage);
router.route("/conversations").get(getConversations);
router.route("/:conversationId").get(getConversationMessages);

export default router;
