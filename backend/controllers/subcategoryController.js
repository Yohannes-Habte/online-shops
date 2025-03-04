import mongoose, { mongo } from "mongoose";
import Shop from "../models/shopModel.js";
import Subcategory from "../models/subcategory.js";
import createError from "http-errors";
import Product from "../models/productModel.js";
import Event from "../models/eventModel.js";

// Create a new subcategory
export const createSubcategory = async (req, res, next) => {
  const { subcategoryName, subcategoryDescription, category, shopId } =
    req.body;

  try {
    // Step 1: Check if the subcategory already exists
    const subcategory = await Subcategory.findOne({ subcategoryName });

    if (subcategory) {
      return next(createError(400, "Subcategory already exists"));
    }

    // Step 2: Create a new subcategory and save it to the database
    const newSubcategory = new Subcategory({
      subcategoryName,
      subcategoryDescription,
      category,
      shop: shopId,
    });

    await newSubcategory.save();

    // Step 3: Find the shop by shopId and update the subcategories array and save the shop
    const shop = await Shop.findById(shopId);
    shop.subCategories.push(newSubcategory._id);
    await shop.save();

    res.status(201).json({
      success: true,
      subcategory: newSubcategory,
      matchMedia: "Subcategory created successfully",
    });
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

// Get all subcategories
export const getSubcategories = async (req, res, next) => {
  try {
    const subcategories = await Subcategory.find().populate("category");

    if (!subcategories) {
      return next(createError(404, "No subcategories found"));
    }

    res.status(200).json({ success: true, subcategories });
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

// Get a single subcategory
export const getSubcategory = async (req, res, next) => {
  const { id } = req.params;

  try {
    const subcategory = await Subcategory.findById(id);

    if (!subcategory) {
      return next(createError(404, "Subcategory not found"));
    }

    res.status(200).json({ success: true, subcategory });
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

// Update a subcategory
export const updateSubcategory = async (req, res, next) => {
  const { subcategoryName, subcategoryDescription } = req.body;
  const { id } = req.params;
  const shopId = req.shop.id;

  if (!mongoose.isValidObjectId(id)) {
    return next(createError(400, "Invalid subcategory ID"));
  }

  if (!mongoose.isValidObjectId(shopId)) {
    return next(createError(400, "Invalid shop ID"));
  }

  const transaction = await mongoose.startSession();
  transaction.startTransaction();

  try {
    // Find the existing subcategory
    const subcategory = await Subcategory.findById(id).session(transaction);
    if (!subcategory) {
      await transaction.abortTransaction();
      transaction.endSession();
      return next(createError(404, "Subcategory not found"));
    }

    // Find the shop
    const shop = await Shop.findById(shopId).session(transaction);
    if (!shop) {
      await transaction.abortTransaction();
      transaction.endSession();
      return next(createError(404, "Shop not found"));
    }

    console.log("Subcategory id", id);
    console.log("shopId", shopId);
    console.log("subcategory.shop", subcategory.shop);
    console.log("subcategory", subcategory);
    console.log("shop.subCategories.id", shop.subCategories.id);

    // Check if the shop has the subcategory
    if (!shop.subCategories.includes(id)) {
      await transaction.abortTransaction();
      transaction.endSession();
      return next(
        createError(404, "You are not authorized to update this subcategory")
      );
    }

    if (shopId.toString() && subcategory.shop.toString()) {
      console.log("shop.subCategories.id", shopId);
    }

    if (shopId.toString() !== subcategory.shop.toString()) {
      await transaction.abortTransaction();
      transaction.endSession();
      return next(
        createError(403, "Unauthorized: You can't update this subcategory")
      );
    }

    // Update the subcategory
    const updatedSubcategory = await Subcategory.findByIdAndUpdate(
      id,
      { subcategoryName, subcategoryDescription },
      { new: true, runValidators: true, session: transaction }
    );

    // Update products linked to this subcategory
    const productsUpdated = await Product.updateMany(
      { subcategory: id }, 
      {
        $set: {
          subcategory: new mongoose.Types.ObjectId(id),
        },
      },
      { session: transaction }
    );
    

    // Update events linked to this subcategory
    const eventsUpdated = await Event.updateMany(
      { subcategory: id },
      {
        $set: {
          subcategory: new mongoose.Types.ObjectId(id),
        },
      },
      { session: transaction }
    );

    // Update shops that reference this subcategory
    const shopsUpdated = await Shop.updateMany(
      { subCategories: id },
      { $set: { "subCategories.$": new mongoose.Types.ObjectId(id) } },
      { session: transaction }
    );

    // Log the updates for debugging
    console.log("Update result", {
      productsUpdated: productsUpdated.modifiedCount,
      eventsUpdated: eventsUpdated.modifiedCount,
      shopsUpdated: shopsUpdated.modifiedCount,
    });

    // Commit transaction if all updates are successful
    await transaction.commitTransaction();
    transaction.endSession();

    res.status(200).json({
      success: true,
      message: "Subcategory updated successfully",
      subcategory: updatedSubcategory,
    });
  } catch (error) {
    await transaction.abortTransaction();
    transaction.endSession();
    console.error("Error updating subcategory:", error);
    return next(createError(500, "Something went wrong"));
  }
};

// Delete a subcategory
export const deleteSubcategory = async (req, res, next) => {
  const { id } = req.params;
  const shopId = req.shop.id;

  if (!shopId) {
    return next(createError(401, "Unauthorized to delete subcategory"));
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, "Invalid subcategory ID"));
  }

  if (!mongoose.Types.ObjectId.isValid(shopId)) {
    return next(createError(400, "Invalid shop ID"));
  }

  const transaction = await mongoose.startSession();
  transaction.startTransaction();

  try {
    const subcategory = await Subcategory.findById(id).session(transaction);
    if (!subcategory) {
      return next(createError(404, "Subcategory not found"));
    }

    const shop = await Shop.findById(shopId).session(transaction);
    if (!shop) {
      return next(createError(404, "Shop not found"));
    }

    if (!shop.subCategories.includes(id)) {
      return next(
        createError(404, "You are not authorized to delete this subcategory")
      );
    }

    if (shopId.toString() !== subcategory.shop.toString()) {
      return next(
        createError(403, "Unauthorized: You can't delete this subcategory")
      );
    }

    // Remove the subcategory from the shop
    await Shop.findByIdAndUpdate(
      shopId,
      { $pull: { subCategories: id } },
      { new: true, session: transaction }
    );

    // Delete the subcategory
    await Subcategory.findByIdAndDelete(id, { session: transaction });

    await transaction.commitTransaction();
    transaction.endSession();

    res
      .status(200)
      .json({ success: true, message: "Subcategory deleted successfully" });
  } catch (error) {
    await transaction.abortTransaction();
    transaction.endSession();
    next(
      createError(500, "Something went wrong while deleting the subcategory")
    );
  }
};
