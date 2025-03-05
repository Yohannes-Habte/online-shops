import Category from "../models/categoryModel.js";
import createError from "http-errors";
import Shop from "../models/shopModel.js";
import mongoose from "mongoose";
import Product from "../models/productModel.js";
import Event from "../models/eventModel.js";

// ========================================================================
// Create a new category
// ========================================================================
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

    // Update the shop's categories and approvedCategories arrays
    await Shop.findByIdAndUpdate(
      shopId,
      {
        $push: {
          categories: newCategory._id,
          approvedCategories: newCategory._id,
        },
      },
      { new: true, session }
    );

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

// ========================================================================
// Get all categories
// ========================================================================
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

// ========================================================================
// Get a single category
// ========================================================================
export const getSingleCategory = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return next(createError(400, "Invalid category ID"));
  }

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

// ========================================================================
// Update a category
// ========================================================================
export const updateCategory = async (req, res, next) => {
  const { categoryName, categoryDescription } = req.body;
  const { id } = req.params;
  const shopId = req.shop.id;

  if (!mongoose.isValidObjectId(id)) {
    return next(createError(400, "Invalid category ID"));
  }

  if (!mongoose.isValidObjectId(shopId)) {
    return next(createError(400, "Invalid shop ID"));
  }

  const transaction = await mongoose.startSession();
  transaction.startTransaction();

  try {
    const category = await Category.findById(id).session(transaction);
    if (!category) {
      await transaction.abortTransaction();
      transaction.endSession();
      return next(createError(404, "Category not found"));
    }

    // Find the shop by shopId
    const shop = await Shop.findById(shopId).session(transaction);
    if (!shop) {
      await transaction.abortTransaction();
      transaction.endSession();
      return next(createError(404, "Shop not found"));
    }

    // Ensure the authenticated shop owns the category
    if (category.shop.toString() !== shopId.toString()) {
      await transaction.abortTransaction();
      transaction.endSession();
      return next(
        createError(403, "Unauthorized: You can't update this category")
      );
    }

    // Ensure the authenticated shop has the category in the approvedCategories array
    if (!shop.approvedCategories.includes(id)) {
      await transaction.abortTransaction();
      transaction.endSession();
      return next(
        createError(403, "Unauthorized: You can't update this category")
      );
    }

    // Update the category using findByIdAndUpdate
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { categoryName, categoryDescription },
      { new: true, runValidators: true, session: transaction }
    );

    // Update the category for all the shops that have this category
    await Shop.updateMany(
      { categories: id },
      { $set: { "categories.$[elem]": new mongoose.Types.ObjectId(id) } },
      {
        arrayFilters: [{ elem: new mongoose.Types.ObjectId(id) }],
        session: transaction,
      }
    );

    // Update products with this category
    await Product.updateMany(
      { category: id },
      { $set: { category: new mongoose.Types.ObjectId(id) } },
      { session: transaction }
    );

    // Update events with this category
    await Event.updateMany(
      { category: id },
      { $set: { category: new mongoose.Types.ObjectId(id) } },
      { session: transaction }
    );

    // Commit the transaction if everything is successful
    await transaction.commitTransaction();
    transaction.endSession();

    res.status(200).json({
      success: true,
      category: updatedCategory,
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return next(createError(500, "Something went wrong"));
  }
};

// ========================================================================
// Delete a category
// ========================================================================
export const deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  const requestingShopId = req.shop.id;

  if (!mongoose.isValidObjectId(id)) {
    return next(createError(400, "Invalid category ID"));
  }

  if (!mongoose.isValidObjectId(requestingShopId)) {
    return next(createError(400, "Invalid shop ID"));
  }

  const validSession = await mongoose.startSession();
  validSession.startTransaction();

  try {
    const category = await Category.findById(id).session(validSession);
    if (!category) {
      await validSession.abortTransaction();
      validSession.endSession();
      return next(createError(404, "Category not found"));
    }

    const requestingShop = await Shop.findById(requestingShopId).session(
      validSession
    );

    if (!requestingShop) {
      await validSession.abortTransaction();
      validSession.endSession();
      return next(createError(404, "Shop not found"));
    }

    // Check if any shops are using this category
    const shopsUsingCategory = await Shop.find({
      categories: id,
    }).session(validSession);

    if (shopsUsingCategory.length === 0) {
      await validSession.abortTransaction();
      validSession.endSession();
      return next(createError(404, "No shops found with this category"));
    }

    // Ensure all shops have approved deletion
    const allShopsApproved = shopsUsingCategory.every((shop) =>
      shop.approvedCategories.includes(id)
    );

    if (!allShopsApproved) {
      await validSession.abortTransaction();
      validSession.endSession();
      return next(
        createError(
          403,
          "Unauthorized: Not all shops have approved deletion. Please contact the shops using this category to approve deletion."
        )
      );
    }

    if (!requestingShop.categories.includes(id)) {
      await validSession.abortTransaction();
      validSession.endSession();
      return next(
        createError(403, "Unauthorized: You can't delete this category")
      );
    }

    // Ensure the authenticated shop owns the category
    if (category.shop.toString() !== requestingShopId.toString()) {
      await validSession.abortTransaction();
      validSession.endSession();
      return next(
        createError(403, "Unauthorized: You can't delete this category")
      );
    }

    // Cascade delete related products and events with this category
    await Product.deleteMany({ category: id }, { session: validSession });
    await Event.deleteMany({ category: id }, { session: validSession });

    // Remove category from all shops
    await Shop.updateMany(
      { categories: id },
      { $pull: { categories: id, approvedCategories: id } },
      { session: validSession }
    );

    // Delete the category
    await Category.deleteOne({ _id: id }, { session: validSession });

    await validSession.commitTransaction();
    validSession.endSession();

    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    await validSession.abortTransaction();
    validSession.endSession();
    next(createError(500, "Something went wrong while deleting the category"));
  }
};
