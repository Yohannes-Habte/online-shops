import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  productReview,
  updateProduct,
} from "../controllers/productController.js";
import requiredValues from "../validators/requiredValues.js";
import productValidator from "../validators/productValidator.js";
import checkValidation from "../validators/checkValidation.js";

// product Router
const productRouter = express.Router();

// product routes
productRouter.post("/create", createProduct);
productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProduct);
productRouter.put("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);

productRouter.put("/product/review", productReview);

// Export product Router
export default productRouter;
