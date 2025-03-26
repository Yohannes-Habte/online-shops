import express from "express";
import {
  allShopOrders,
  allShopsOrders,
  createOrder,
  deleteOrders,
  getAllUserOrders,
  getOrder,
  orderRefundByShop,
  refundUserOrderRequest,
  shopOrder,
  updateShopOrder,
} from "../controllers/orderController.js";
import { isAdmin, isAuthenticated } from "../middleware/auth.js";
import { isSellerAuthenticated } from "../middleware/shopAuth.js";

// order Router
const orderRouter = express.Router();

// order routes
orderRouter.post("/create", isAuthenticated, createOrder);
orderRouter.get("/customer", isAuthenticated, getAllUserOrders);
orderRouter.get("/seller", isSellerAuthenticated, allShopOrders);
orderRouter.get("/admin", isAuthenticated, isAdmin, allShopsOrders);
orderRouter.put("/:id/update/status", isSellerAuthenticated, updateShopOrder);
orderRouter.put("/:id/refund/request", isAuthenticated, refundUserOrderRequest);
orderRouter.put("/:id/refund/completed", isSellerAuthenticated, orderRefundByShop);
orderRouter.get("/:id/shop/order", isSellerAuthenticated, shopOrder);
orderRouter.get("/:id", isAuthenticated, getOrder);
orderRouter.get("/:id", isSellerAuthenticated, getOrder);
orderRouter.delete("/", isAuthenticated, isAdmin, deleteOrders);

// Export order Router
export default orderRouter;
