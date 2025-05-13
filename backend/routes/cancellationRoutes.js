import express from "express";

import {
  createCancellationOrder,
  updateCancellationOrder,
} from "../controllers/cancellationOrderController.js";

import { isSellerAuthenticated } from "../middleware/shopAuth.js";
import { isAuthenticated } from "../middleware/auth.js";

const cancellationRouter = express.Router();

cancellationRouter.post("/create", isAuthenticated, createCancellationOrder);

cancellationRouter.put(
  "/update",
  isSellerAuthenticated,
  updateCancellationOrder
);

export default cancellationRouter;
