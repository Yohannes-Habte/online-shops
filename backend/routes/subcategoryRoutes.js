import express from "express";
import { isSellerAuthenticated } from "../middleware/shopAuth.js";
import { createSubcategory, deleteSubcategory, getSubcategories, getSubcategory, updateSubcategory } from "../controllers/subcategoryController.js";
const subcategoryRouter = express.Router();

// Category routes
subcategoryRouter.post("/create", isSellerAuthenticated, createSubcategory);
subcategoryRouter.get("/", getSubcategories);
subcategoryRouter.get("/:id", getSubcategory);
subcategoryRouter.put("/:id", isSellerAuthenticated, updateSubcategory);
subcategoryRouter.delete("/:id", isSellerAuthenticated, deleteSubcategory);

export default subcategoryRouter;