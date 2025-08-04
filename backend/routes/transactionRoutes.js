import express from "express";

import {
  createTransaction,
  getAllTransactions,
  updateTransaction,
} from "../controllers/transactionController.js";

import { isSellerAuthenticated } from "../middleware/shopAuth.js";
import { isAdmin } from "../middleware/auth.js";

const transactionRouter = express.Router();

transactionRouter.post("/create", isSellerAuthenticated, createTransaction);
transactionRouter.put("/:id", isSellerAuthenticated, updateTransaction);
transactionRouter.get("/", isAdmin, getAllTransactions);
transactionRouter.get("/shop", isSellerAuthenticated, getAllShopTransactions);

export default transactionRouter;
