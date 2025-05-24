import express from "express";

import {
  createTransaction,
  updateTransaction,
} from "../controllers/transactionController.js";

import { isSellerAuthenticated } from "../middleware/shopAuth.js";

const transactionRouter = express.Router();

transactionRouter.post("/create", isSellerAuthenticated, createTransaction);
transactionRouter.put("/:id", isSellerAuthenticated, updateTransaction);

export default transactionRouter;
