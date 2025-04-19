import express from "express";

import { createRefundRequest } from "../controllers/refundRequestController.js";

import { isSellerAuthenticated } from "../middleware/shopAuth.js";

const refundRequestRouter = express.Router();

refundRequestRouter.post("/request", isSellerAuthenticated, createRefundRequest);

export default refundRequestRouter;