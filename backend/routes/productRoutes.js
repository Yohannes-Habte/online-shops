import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  getProductsByCustomerCategory,
  productReview,
  updateProduct,
} from "../controllers/productController.js";
import { isAuthenticated } from "../middleware/auth.js";
import { isSellerAuthenticated } from "../middleware/shopAuth.js";

// product Router
const productRouter = express.Router();

// product routes
productRouter.post("/create", isSellerAuthenticated, createProduct);
productRouter.get("/", getAllProducts);
productRouter.get(
  "/category/customer/:customerCategory",
  getProductsByCustomerCategory
);
productRouter.get("/:id", getProduct);
productRouter.put("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);
productRouter.put("/product/review", isAuthenticated, productReview);

// Export product Router
export default productRouter;
