import express from "express";

import { createRefundRequest } from "../controllers/refundRequestController.js";

import { isAuthenticated } from "../middleware/auth.js";

const refundRequestRouter = express.Router();

refundRequestRouter.post("/request", isAuthenticated, createRefundRequest);

export default refundRequestRouter;
