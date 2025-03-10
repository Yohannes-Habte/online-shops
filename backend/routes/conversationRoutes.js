import express from "express";
import {
  createConversation,
  getAllShopConversations,
  getAllUserConversations,
  updateLastMessage,
} from "../controllers/conversationController.js";
import { isAuthenticated } from "../middleware/auth.js";
import { isSellerAuthenticated } from "../middleware/shopAuth.js";

// conversation Router
const conversationRouter = express.Router();

// conversation routes
conversationRouter.post("/create-new-conversation", createConversation);
conversationRouter.put("/update-last-message/:id", updateLastMessage);

conversationRouter.get(
  "/get-all-conversation-seller/:id",
  isSellerAuthenticated,
  getAllShopConversations
);

conversationRouter.get(
  "/get-all-conversation-user/:id",
  isAuthenticated,
  getAllUserConversations
);

// Export conversation Router
export default conversationRouter;
