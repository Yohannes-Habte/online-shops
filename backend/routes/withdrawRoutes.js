import express from "express";
import { createWithdrawalRequest } from "../controllers/withdrawController.js";
import { isSellerAuthenticated } from "../middleware/shopAuth.js";

const withdrawRouter = express.Router();

withdrawRouter.post("/create", isSellerAuthenticated, createWithdrawalRequest);

export default withdrawRouter;
