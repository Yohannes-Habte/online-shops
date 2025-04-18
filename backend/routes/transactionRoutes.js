import express from "express";

import { createTransaction } from "../controllers/transactionController.js";

import { isSellerAuthenticated } from "../middleware/shopAuth.js";

const transactionRouter = express.Router();

transactionRouter.post("/create", isSellerAuthenticated, createTransaction);

export default transactionRouter;
