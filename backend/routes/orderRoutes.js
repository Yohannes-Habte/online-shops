import express from 'express';
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
} from '../controllers/orderController.js';
import { isAuthenticated } from '../middleware/auth.js';

// order Router
const orderRouter = express.Router();

// order routes
orderRouter.post('/create', isAuthenticated, createOrder);
orderRouter.put('/update-order-status/:id/:shopId', updateShopOrders);
orderRouter.put('/:id/refund-order', refundUserOrder);
orderRouter.put('/refund-order-successful/:id', orderRefundByShop);
orderRouter.get('/order/:id', getOrder);
orderRouter.get('/user/:userId', getAllUserOrders);
orderRouter.get('/shop/:shopId', allShopOrders);
orderRouter.get('/', allShopsOrders);
orderRouter.delete('/order/id', deleteOrder);
orderRouter.delete('/', deleteOrders);

// Export order Router
export default orderRouter;
