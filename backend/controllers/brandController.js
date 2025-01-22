import Brand from "../models/brandModel.js";
import createError from "http-errors";
import Shop from "../models/shopModel.js";
import mongoose from "mongoose";

// Create a new brand
export const createNewBrand = async (req, res, next) => {
  const { brandName, brandDescription, shopId } = req.body;

  // Validate the shop ID
  if (!mongoose.isValidObjectId(shopId)) {
    return next(createError(400, "Invalid shop ID provided."));
  }

  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if the brand already exists
    const existingBrand = await Brand.findOne({ brandName }).session(session);
    if (existingBrand) {
      await session.abortTransaction();
      return next(createError(400, "Brand with this name already exists"));
    }

    // Create a new brand and save it to the database
    const newBrand = new Brand({
      brandName,
      brandDescription,
      shop: shopId,
    });

    // Save the new brand within the transaction
    await newBrand.save({ session });

    // Add the new brand to the shop and save the shop
    const shop = await Shop.findById(shopId).session(session);
    if (!shop) {
      await session.abortTransaction();
      return next(createError(404, "Shop not found"));
    }

    shop.brands.push(newBrand._id);
    await shop.save({ session });

    // Commit transaction if everything is successful
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      brand: newBrand,
      message: "Brand created successfully",
    });
  } catch (error) {
    console.error("Error creating brand:", error);
    await session.abortTransaction();
    return next(createError(500, "Something went wrong"));
  } finally {
    // End the session regardless of success or failure
    session.endSession();
  }
};

// Get all brands
export const getAllBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find();
    if (!brands) {
      return next(createError(404, "No brands found"));
    }
    res.status(200).json({ success: true, brands });
  } catch (error) {
    console.error("Error getting brands:", error);
    return next(createError(500, "Something went wrong"));
  }
};

// Get a single brand
export const getSingleBrand = async (req, res, next) => {
  const { id } = req.params;
  try {
    const brand = await Brand.findById(id);
    if (!brand) {
      return next(createError(404, "Brand not found"));
    }
    res.status(200).json({ success: true, brand });
  } catch (error) {
    console.error("Error getting brand:", error);
    return next(createError(500, "Something went wrong"));
  }
};

// Update a brand
export const updateBrand = async (req, res, next) => {
  const { id } = req.params;
  const { brandName, brandDescription } = req.body;
  try {
    const brand = await Brand.findById(id);
    if (!brand) {
      return next(createError(404, "Brand not found"));
    }

    // Update the brand details
    brand.brandName = brandName;
    brand.brandDescription = brandDescription;
    await brand.save();

    res.status(200).json({
      success: true,
      brand,
      message: "Brand updated successfully",
    });
  } catch (error) {
    console.error("Error updating brand:", error);
    return next(createError(500, "Something went wrong"));
  }
};

// Delete a brand
export const deleteBrand = async (req, res, next) => {
  const { id } = req.params;
  try {
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) {
      return next(createError(404, "Brand not found"));
    }

    res.status(200).json({ success: true, message: "Brand deleted" });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return next(createError(500, "Something went wrong"));
  }
};
