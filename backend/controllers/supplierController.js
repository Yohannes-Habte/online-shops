import Supplier from "../models/supplier.js";
import createError from "http-errors";
import Shop from "../models/shopModel.js";
import mongoose from "mongoose";

// Create a new supplier
export const createNewSupplier = async (req, res, next) => {
  const {
    supplierName,
    supplierDescription,
    supplierEmail,
    supplierPhone,
    supplierAddress,
    country,
    isActive,
    shopId,
  } = req.body;

  
  // Validate the category ID
  if (!mongoose.isValidObjectId(shopId)) {
    return next(createError(400, "Invalid shop ID provided."));
  }

  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if the supplier already exists
    const existingSupplier = await Supplier.findOne({ supplierName }).session(
      session
    );
    if (existingSupplier) {
      await session.abortTransaction();
      return next(createError(400, "Supplier with this name already exists"));
    }

    // Create a new supplier and save it to the database
    const newSupplier = new Supplier({
      supplierName,
      supplierDescription,
      supplierEmail,
      supplierPhone,
      supplierAddress,
      country,
      isActive,
      shop: shopId,
    });

    await newSupplier.save({ session });

    // Add the supplier to the shop who created it and save the shop
    const shop = await Shop.findById(shopId).session(session);
    if (!shop) {
      await session.abortTransaction();
      return next(createError(404, "Shop not found"));
    }

    shop.suppliers.push(newSupplier._id);
    await shop.save({ session });

    // Commit transaction if everything is successful
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      supplier: newSupplier,
      message: "Supplier created successfully",
    });
  } catch (error) {
    console.error("Error creating supplier:", error);
    await session.abortTransaction();
    return next(createError(500, "Something went wrong"));
  } finally {
    session.endSession();
  }
};

// Get all suppliers
export const getAllSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find();
    if (!suppliers) {
      return next(createError(404, "No suppliers found"));
    }
    res.status(200).json({ success: true, suppliers });
  } catch (error) {
    console.error("Error getting suppliers:", error);
    return next(createError(500, "Something went wrong"));
  }
};

// Get a single supplier
export const getSingleSupplier = async (req, res, next) => {
  const { id } = req.params;
  try {
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return next(createError(404, "Supplier not found"));
    }
    res.status(200).json({ success: true, supplier });
  } catch (error) {
    console.error("Error getting supplier:", error);
    return next(createError(500, "Something went wrong"));
  }
};

// Update a supplier
export const updateSupplier = async (req, res, next) => {
  const { id } = req.params;
  const {
    supplierName,
    supplierDescription,
    supplierEmail,
    supplierPhone,
    supplierAddress,
    country,
    isActive,
  } = req.body;

  try {
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return next(createError(404, "Supplier not found"));
    }

    // Update supplier details
    supplier.supplierName = supplierName;
    supplier.supplierDescription = supplierDescription;
    supplier.supplierEmail = supplierEmail;
    supplier.supplierPhone = supplierPhone;
    supplier.supplierAddress = supplierAddress;
    supplier.country = country;
    supplier.isActive = isActive;

    await supplier.save();

    res.status(200).json({
      success: true,
      supplier,
      message: "Supplier updated successfully",
    });
  } catch (error) {
    console.error("Error updating supplier:", error);
    return next(createError(500, "Something went wrong"));
  }
};

// Delete a supplier
export const deleteSupplier = async (req, res, next) => {
  const { id } = req.params;
  try {
    const supplier = await Supplier.findByIdAndDelete(id);
    if (!supplier) {
      return next(createError(404, "Supplier not found"));
    }

    res.status(200).json({ success: true, message: "Supplier deleted" });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    return next(createError(500, "Something went wrong"));
  }
};
