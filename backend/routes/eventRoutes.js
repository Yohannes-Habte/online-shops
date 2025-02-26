import express from "express";
import {
  createEvent,
  deleteShopSingleEvent,
  getAllShopEvents,
  getAllShopsEvents,
  updateShopSingleEvent,
  getShopSingleEvent,
} from "../controllers/evnetController.js";
import { isSellerAuthenticated } from "../middleware/shopAuth.js";

// event Router
const eventRouter = express.Router();

// event routes
eventRouter.post("/create", isSellerAuthenticated, createEvent);
eventRouter.get("/", getAllShopsEvents);
eventRouter.get("/seller", isSellerAuthenticated, getAllShopEvents);
eventRouter.get("/:eventID", isSellerAuthenticated, getShopSingleEvent);
eventRouter.put("/:eventID", isSellerAuthenticated, updateShopSingleEvent);
eventRouter.delete("/:eventID", isSellerAuthenticated, deleteShopSingleEvent);

// Export event Router
export default eventRouter;
