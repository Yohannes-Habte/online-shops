import Shop from "../models/shopModel.js";
import Subcategory from "../models/subcategory.js";
import createError from "http-errors";

// Create a new subcategory
export const createSubcategory = async (req, res, next) => {
  const { subcategoryName, subcategoryDescription, category, shopId } = req.body;

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
  const { id } = req.params;
  const { subcategoryName, subcategoryDescription } = req.body;

  try {
    const subcategory = await Subcategory.findById(id);

    if (!subcategory) {
      return next(createError(404, "Subcategory not found"));
    }

    await Subcategory.findByIdAndUpdate(
      id,
      { subcategoryName, subcategoryDescription },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ success: true, message: "Subcategory updated" });
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

// Delete a subcategory
export const deleteSubcategory = async (req, res, next) => {
  const { id } = req.params;

  try {
    const subcategory = await Subcategory.findById(id);

    if (!subcategory) {
      return next(createError(404, "Subcategory not found"));
    }

    await Subcategory.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Subcategory deleted" });
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};
