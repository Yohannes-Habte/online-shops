import express from 'express';
import {
  createConversation,
  getAllShopConversations,
  getAllUserConversations,
  updateLastMessage,
} from '../controllers/conversationController.js';
import { authSeller, authUser } from '../middleware/auth.js';

// conversation Router
const conversationRouter = express.Router();

// conversation routes
conversationRouter.post('/create-conversation', createConversation);
conversationRouter.put('/update-lastMessage/:id', updateLastMessage);

conversationRouter.get('/shop-conversations/:id', getAllShopConversations);

conversationRouter.get('/user-conversations/:id', getAllShopConversations);

// Export conversation Router
export default conversationRouter;
