import express from "express";

import { createShipping } from "../controllers/shippingController.js";

import { isSellerAuthenticated } from "../middleware/shopAuth.js";

const shippingRouter = express.Router();

shippingRouter.post("/create", isSellerAuthenticated, createShipping);

export default shippingRouter;
