import express from "express";
import { getStripe, postStripe } from "../controllers/paymentController.js";
import { isAuthenticated } from "../middleware/auth.js";

// Payment router
const paymentRouter = express.Router();

// Payment routes
paymentRouter.post("/stripe", isAuthenticated, postStripe);
paymentRouter.get("/stripeApiKey", getStripe);

// Export payment router
export default paymentRouter;
