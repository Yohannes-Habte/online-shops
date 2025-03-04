import Category from "../models/categoryModel.js";
import createError from "http-errors";
import Shop from "../models/shopModel.js";
import mongoose from "mongoose";

// Create a new category
export const createNewCategory = async (req, res, next) => {
  const { categoryName, categoryDescription, shopId } = req.body;

  // Validate the shop ID
  if (!mongoose.isValidObjectId(shopId)) {
    return next(createError(400, "Invalid shop ID provided."));
  }

  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Check if the category already exists
    const productCategory = await Category.findOne({ categoryName }).session(
      session
    );
    if (productCategory) {
      await session.abortTransaction();
      return next(createError(400, "Category with this name already exists"));
    }

    // Step 2: Create a new category and save it to the database
    const newCategory = new Category({
      categoryName,
      categoryDescription,
      shop: shopId,
    });

    await newCategory.save({ session });

    // Step 3: Find the shop by shopId and update the categories array and save the shop
    const shop = await Shop.findById(shopId).session(session);
    if (!shop) {
      await session.abortTransaction();
      return next(createError(404, "Shop not found"));
    }

    shop.categories.push(newCategory._id);
    await shop.save({ session });

    // Commit transaction if everything is successful
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      category: newCategory,
      message: "Category created successfully",
    });
  } catch (error) {
    console.error("Error creating category:", error);
    await session.abortTransaction();
    return next(createError(500, "Something went wrong"));
  } finally {
    session.endSession(); // End the session after completion
  }
};

// Get all categories
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    if (!categories) {
      return next(createError(404, "No categories found"));
    }
    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("Error getting categories:", error);
    return next(createError(500, "Something went wrong"));
  }
};

// Get a single category
export const getSingleCategory = async (req, res, next) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category) {
      return next(createError(404, "Category not found"));
    }
    res.status(200).json({ success: true, category });
  } catch (error) {
    console.error("Error getting category:", error);
    return next(createError(500, "Something went wrong"));
  }
};

// Update a category
export const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const { categoryName, categoryDescription } = req.body;
  try {
    const category = await Category.findById(id);
    if (!category) {
      return next(createError(404, "Category not found"));
    }
    category.categoryName = categoryName;
    category.categoryDescription = categoryDescription;
    await category.save();
    res.status(200).json({
      success: true,
      category,
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return next(createError(500, "Something went wrong"));
  }
};

// Delete a category
export const deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  const shopId = req.shop.id;

  if (!mongoose.isValidObjectId(id)) {
    return next(createError(400, "Invalid category ID"));
  }

  if (!mongoose.isValidObjectId(shopId)) {
    return next(createError(400, "Invalid shop ID"));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const category = await Category.findById(id).session(session);
    if (!category) {
      await session.abortTransaction();
      return next(createError(404, "Category not found"));
    }

    const shop = await Shop.findById(shopId).session(session);

    if (!shop) {
      await session.abortTransaction();
      return next(createError(404, "Shop not found"));
    }

    if (!shop.categories.includes(id)) {
      await session.abortTransaction();
      return next(
        createError(403, "Unauthorized: You can't delete this category")
      );
    }

    // Ensure the authenticated shop owns the category
    if (category.shop.toString() !== shopId.toString()) {
      await session.abortTransaction();
      return next(
        createError(403, "Unauthorized: You can't delete this category")
      );
    }

    // Remove category reference from the shop
    await Shop.findByIdAndUpdate(
      shopId,
      { $pull: { categories: id } },
      { session }
    );

    // Delete the category
    await Category.deleteOne({ _id: id }, { session });

    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error deleting category:", error);
    next(createError(500, "Something went wrong while deleting the category"));
  }
};
