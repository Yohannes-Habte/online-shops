import express from "express";
import {
  allShopOrders,
  allShopsOrders,
  createOrder,
  deleteOrder,
  deleteOrders,
  getAllUserOrders,
  getOrder,
  orderRefundByShop,
  refundUserOrder,
  updateShopOrders,
} from "../controllers/orderController.js";
import { isAdmin, isAuthenticated } from "../middleware/auth.js";

// order Router
const orderRouter = express.Router();

// order routes
orderRouter.post("/create", isAuthenticated, createOrder);
orderRouter.get("/customer", isAuthenticated, getAllUserOrders);
orderRouter.get("/seller", allShopOrders);
orderRouter.get("/admin", isAuthenticated, isAdmin, allShopsOrders);
orderRouter.put("/update-order-status/:id/:shopId", updateShopOrders);
orderRouter.put("/:id/refund-order", refundUserOrder);
orderRouter.put("/refund-order-successful/:id", orderRefundByShop);
orderRouter.delete("/order/id", deleteOrder);
orderRouter.delete("/", deleteOrders);
orderRouter.get("/:id", getOrder);

// Export order Router
export default orderRouter;
