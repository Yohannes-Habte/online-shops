import express from "express";
import {
  createWithdrawalRequest,
  deleteAllMoneyWithdraws,
  deleteMoneyWithdrawRequest,
  getAllWithdrawRequests,
  updateMoneyWithdrawRequest,
} from "../controllers/withdrawController.js";
import { isSellerAuthenticated } from "../middleware/shopAuth.js";

const withdrawRouter = express.Router();

withdrawRouter.post("/create", isSellerAuthenticated, createWithdrawalRequest);

withdrawRouter.put("/:id", updateMoneyWithdrawRequest);

withdrawRouter.get("/", getAllWithdrawRequests);

withdrawRouter.delete("/:id", deleteMoneyWithdrawRequest);

withdrawRouter.delete("/", deleteAllMoneyWithdraws);

export default withdrawRouter;
