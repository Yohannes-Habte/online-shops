import express from "express";

import { createReturnedItem } from "../controllers/returnedItemController.js";

import { isSellerAuthenticated } from "../middleware/shopAuth.js";

const returnedItemsRouter = express.Router();

returnedItemsRouter.post("/create", isSellerAuthenticated, createReturnedItem);

export default returnedItemsRouter;
