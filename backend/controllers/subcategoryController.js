import mongoose, { mongo } from "mongoose";
import Shop from "../models/shopModel.js";
import Subcategory from "../models/subcategory.js";
import createError from "http-errors";
import Product from "../models/productModel.js";
import Event from "../models/eventModel.js";

// ======================================================================================
// Create a new subcategory
// ======================================================================================
export const createSubcategory = async (req, res, next) => {
  const { subcategoryName, subcategoryDescription, category, shopId } =
    req.body;
  const sellerId = req.shop.id;

  if (!mongoose.isValidObjectId(shopId)) {
    return next(createError(400, "Invalid shop ID"));
  }

  if (!mongoose.isValidObjectId(sellerId)) {
    return next(createError(400, "Invalid seller ID"));
  }

  if (sellerId.toString() !== shopId.toString()) {
    return next(
      createError(
        403,
        "Unauthorized: You can't create a subcategory for another shop"
      )
    );
  }

  const smoothTransition = await mongoose.startSession();
  smoothTransition.startTransaction();

  try {
    // Step 1: Check if the subcategory already exists
    const subcategory = await Subcategory.findOne({ subcategoryName }).session(
      smoothTransition
    );

    if (subcategory) {
      await smoothTransition.abortTransaction();
      smoothTransition.endSession();
      return next(createError(400, "Subcategory already exists"));
    }

    // Step 2: Create a new subcategory and save it to the database
    const newSubcategory = new Subcategory({
      subcategoryName,
      subcategoryDescription,
      category,
      shop: shopId,
    });

    await newSubcategory.save({ session: smoothTransition });

    // Step 3: Find the shop by shopId and update the subcategories array and save the shop
    const shop = await Shop.findById(shopId).session(smoothTransition);

    if (!shop) {
      await smoothTransition.abortTransaction();
      smoothTransition.endSession();
      return next(createError(404, "Shop not found"));
    }

    // Add the new subcategory to the shop's subCategories and approvedSubcategories
    await Shop.findByIdAndUpdate(
      shopId,
      {
        $push: {
          subCategories: newSubcategory._id,
          approvedSubcategories: newSubcategory._id,
        },
      },
      { session: smoothTransition }
    );

    // Commit the transaction after all operations
    await smoothTransition.commitTransaction();
    smoothTransition.endSession();

    res.status(201).json({
      success: true,
      subcategory: newSubcategory,
      message: "Subcategory created successfully",
    });
  } catch (error) {
    await smoothTransition.abortTransaction();
    smoothTransition.endSession();
    return next(
      createError(500, "Something went wrong while creating the subcategory")
    );
  }
};

// ======================================================================================
// Get all subcategories
// ======================================================================================
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

// ======================================================================================
// Get a single subcategory
// ======================================================================================
export const getSubcategory = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return next(createError(400, "Invalid subcategory ID"));
  }

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

// ======================================================================================
// Update a subcategory
// ======================================================================================
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

    // Check if the shop has the subcategory
    if (!shop.subCategories.includes(id)) {
      await transaction.abortTransaction();
      transaction.endSession();
      return next(
        createError(404, "You are not authorized to update this subcategory")
      );
    }

    if (!shop.approvedSubcategories.includes(id)) {
      await transaction.abortTransaction();
      transaction.endSession();
      return next(
        createError(403, "You are not authorized to update this subcategory")
      );
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

    // Update the approvedSubcategories array in the shop
    // The positional operator ($) to target the correct index within the array.
    /**
     *The $set operator is used to update a specific element in an array.
     *The $[elem] in the update query is a placeholder for a specific element in the array.
     *arrayFilters allows you to define the conditions that an array element must meet in order to be updated.
     */
    await Shop.findByIdAndUpdate(
      shopId,
      {
        $set: {
          "approvedSubcategories.$[elem]": new mongoose.Types.ObjectId(id),
        },
      },
      {
        arrayFilters: [
          { elem: new mongoose.Types.ObjectId(id) }, // Condition to target the specific subcategory
        ],
        session: transaction,
      }
    );

    // Update products linked to this subcategory
    await Product.updateMany(
      { subcategory: id },
      {
        $set: {
          subcategory: new mongoose.Types.ObjectId(id),
        },
      },
      { session: transaction }
    );

    // Update events linked to this subcategory
    await Event.updateMany(
      { subcategory: id },
      {
        $set: {
          subcategory: new mongoose.Types.ObjectId(id),
        },
      },
      { session: transaction }
    );

    // Update shops that reference this subcategory
    await Shop.updateMany(
      { subCategories: id },
      { $set: { "subCategories.$": new mongoose.Types.ObjectId(id) } },
      { session: transaction }
    );

    // Commit transaction if all updates are successful
    await transaction.commitTransaction();
    transaction.endSession();

    res.status(200).json({
      success: true,
      message: "Subcategory updated successfully",
      subcategory: updatedSubcategory,
    });
  } catch (error) {
    console.error("Error updating subcategory:", error);
    await transaction.abortTransaction();
    transaction.endSession();
    console.error("Error updating subcategory:", error);
    return next(createError(500, "Something went wrong"));
  }
};

// ======================================================================================
// Delete a subcategory (only if all shops agree)
// ======================================================================================
export const deleteSubcategory = async (req, res, next) => {
  const { id } = req.params;
  const requestingShopId = req.shop.id;

  if (!requestingShopId) {
    return next(createError(401, "Unauthorized to delete subcategory"));
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, "Invalid subcategory ID"));
  }

  const transaction = await mongoose.startSession();
  transaction.startTransaction();

  try {
    const subcategory = await Subcategory.findById(id).session(transaction);
    if (!subcategory) {
      await transaction.abortTransaction();
      transaction.endSession();
      return next(createError(404, "Subcategory not found"));
    }

    const requestingShop = await Shop.findById(requestingShopId);
    if (!requestingShop) {
      await transaction.abortTransaction();
      transaction.endSession();
      return next(createError(401, "Unauthorized shop"));
    }

    // Find all shops using this subcategory
    const shopsUsingSubcategory = await Shop.find({
      subCategories: id,
    }).session(transaction);

    if (shopsUsingSubcategory.length === 0) {
      await transaction.abortTransaction();
      transaction.endSession();
      return next(createError(404, "No shops found using this subcategory"));
    }

    // Ensure all shops have approved deletion
    const allShopsAgreed = shopsUsingSubcategory.every((shop) =>
      shop.approvedSubcategories.includes(id)
    );

    if (!allShopsAgreed) {
      await transaction.abortTransaction();
      transaction.endSession();
      return next(
        createError(
          403,
          "Not all shops have approved deleting this subcategory"
        )
      );
    }

    // Cascade delete related products and events
    await Product.deleteMany({ subcategory: id }, { session: transaction });
    await Event.deleteMany({ subcategory: id }, { session: transaction });

    // Remove the subcategory from all shops
    await Shop.updateMany(
      { subCategories: id },
      { $pull: { subCategories: id, approvedSubcategories: id } },
      { session: transaction }
    );

    // Delete the subcategory
    await Subcategory.findByIdAndDelete(id, { session: transaction });

    await transaction.commitTransaction();
    transaction.endSession();

    console.log(
      `Subcategory ${id} deleted successfully by shop ${requestingShopId}`
    );

    res.status(200).json({
      success: true,
      message: "Subcategory and related data deleted successfully",
    });
  } catch (error) {
    await transaction.abortTransaction();
    transaction.endSession();
    next(
      createError(500, "Something went wrong while deleting the subcategory")
    );
  }
};
