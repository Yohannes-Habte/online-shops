import express from "express";
import { deleteBrand } from "../controllers/brandController.js";
import { updateBrand } from "../controllers/brandController.js";
import { getSingleBrand } from "../controllers/brandController.js";
import { getAllBrands } from "../controllers/brandController.js";
import { createNewBrand } from "../controllers/brandController.js";
import { isSellerAuthenticated } from "../middleware/shopAuth.js";

const brandRouter = express.Router();

// Category routes
brandRouter.post("/create", isSellerAuthenticated, createNewBrand);
brandRouter.get("/", getAllBrands);
brandRouter.get("/:id", getSingleBrand);
brandRouter.put("/:id", isSellerAuthenticated, updateBrand);
brandRouter.delete("/:id", isSellerAuthenticated, deleteBrand);

export default brandRouter;
