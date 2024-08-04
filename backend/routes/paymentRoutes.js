import express from 'express';
import { getStripe, postStripe } from '../controllers/paymentController.js';

// Payment router
const paymentRouter = express.Router();

// Payment routes
paymentRouter.post("/stripe", postStripe)
paymentRouter.get("/stripeapikey", getStripe)
paymentRouter.post("/cash-on-delivery")

// Export payment router
export default paymentRouter;
