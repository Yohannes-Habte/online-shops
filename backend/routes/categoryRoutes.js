import express from "express";
import {
  createNewCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
} from "../controllers/categoryController.js";
import { isSellerAuthenticated } from "../middleware/shopAuth.js";
const categoryRouter = express.Router();

// Category routes
categoryRouter.post("/create", isSellerAuthenticated, createNewCategory);
categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:id", getSingleCategory);
categoryRouter.put("/:id", isSellerAuthenticated, updateCategory);
categoryRouter.delete("/:id", isSellerAuthenticated, deleteCategory);

export default categoryRouter;
