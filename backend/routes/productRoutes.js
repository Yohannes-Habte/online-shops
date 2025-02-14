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

// product Router
const productRouter = express.Router();

// product routes
productRouter.post("/create", createProduct);
productRouter.get("/", getAllProducts);
productRouter.get("/category/customer/:customerCategory", getProductsByCustomerCategory);
productRouter.get("/:id", getProduct);
productRouter.put("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);
productRouter.put("/product/review", isAuthenticated, productReview);

// Export product Router
export default productRouter;
