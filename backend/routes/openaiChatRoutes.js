import { Router } from "express";
import { createOpenaiChat, createOpenaiImage } from "../controllers/openaiController.js";

const openaiRouter = Router();

openaiRouter.post("/chat/completions", createOpenaiChat);

openaiRouter.post("/images/generations", createOpenaiImage);

export default openaiRouter;
