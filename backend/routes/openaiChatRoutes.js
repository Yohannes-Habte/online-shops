import { Router } from "express";
import { createOpenaiChat } from "../controllers/openaiChatBot.js";

const openaiChatRouter = Router();

openaiChatRouter.post("/", createOpenaiChat);

export default openaiChatRouter;
