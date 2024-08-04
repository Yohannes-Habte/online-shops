import express from 'express';
import {
  createMessage,
  getAllSenderMessages,
} from '../controllers/messageController.js';

// message Router
const messageRouter = express.Router();

// message routes
messageRouter.post('/create-message', createMessage);
messageRouter.get('/sender-messages/:id', getAllSenderMessages);

// Export message Router
export default messageRouter;
