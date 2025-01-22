import express from "express";
import {
  createNewSupplier,
  deleteSupplier,
  getAllSuppliers,
  getSingleSupplier,
  updateSupplier,
} from "../controllers/supplierController.js"; 

const supplierRouter = express.Router();

// Supplier routes
supplierRouter.post("/create", createNewSupplier);
supplierRouter.get("/", getAllSuppliers);
supplierRouter.get("/:id", getSingleSupplier);
supplierRouter.put("/:id", updateSupplier);
supplierRouter.delete("/:id", deleteSupplier);

export default supplierRouter;
