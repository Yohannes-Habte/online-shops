import { Router } from "express";
import { createOpenaiImage } from "../controllers/createOpenaiImage.js";

const openaiImageRouter = Router();

openaiImageRouter.post("/", createOpenaiImage);

export default openaiImageRouter;
