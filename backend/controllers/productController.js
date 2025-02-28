import Product from "../models/productModel.js";
import createError from "http-errors";
import Shop from "../models/shopModel.js";
import Order from "../models/orderModel.js";
import Brand from "../models/brandModel.js";
import Category from "../models/categoryModel.js";
import mongoose from "mongoose";
import Joi from "joi";
import Subcategory from "../models/subcategory.js";
import User from "../models/userModel.js";

//==============================================================================
// Create Product
//==============================================================================

export const createProduct = async (req, res, next) => {
  const {
    title,
    description,
    originalPrice,
    discountPrice,
    shopId,
    supplier,
    category,
    subcategory,
    brand,
    customerCategory,
    tags,
    status,
    variants,
  } = req.body;

  // Validate the shop ID
  if (!mongoose.isValidObjectId(shopId)) {
    return next(createError(400, "Invalid shop ID provided."));
  }

  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if the shop exists
    const shop = await Shop.findById(shopId).session(session);
    if (!shop) {
      await session.abortTransaction();
      session.endSession();
      return next(createError(400, "Shop not found!"));
    }

    // Check for duplicate product title in the shop
    const isProductTitleExist = await Product.findOne({
      shop: shopId,
      title,
    }).session(session);

    if (isProductTitleExist) {
      await session.abortTransaction();
      session.endSession();
      return next(
        createError(400, "Product title already exists in this shop.")
      );
    }

    // Step 1: Create a new product
    const newProduct = new Product({
      title,
      description,
      originalPrice,
      discountPrice,
      shop: shopId,
      supplier,
      category,
      subcategory,
      brand,
      customerCategory,
      tags,
      status,
      variants,
    });

    // Save the new product
    const savedProduct = await newProduct.save({ session });

    // Step 2: Add the product to the shop's shopProducts array
    if (!shop.shopProducts.includes(savedProduct._id)) {
      shop.shopProducts.push(savedProduct._id);
      await shop.save({ session });
    } else {
      throw new Error("Product ID already exists in the shop.");
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Step 3: Respond to the client
    res.status(201).json({
      success: true,
      product: savedProduct,
      message: "Product created successfully and added to the shop.",
    });
  } catch (error) {
    // Abort the transaction in case of an error
    await session.abortTransaction();
    session.endSession();

    console.error("Error creating product:", error.message);
    return next(
      createError(
        500,
        error.message || "Something went wrong while creating the product."
      )
    );
  }
};

//==============================================================================
// Get All Products for All Shops
//==============================================================================
export const getAllProducts = async (req, res, next) => {
  try {
    // Validate and sanitize query parameters
    const schema = Joi.object({
      title: Joi.string().allow(""),
      shopName: Joi.string().allow(""), // Query by shop name
      categoryName: Joi.string().allow(""), // Query by category name
      subcategoryName: Joi.string().allow(""), // Query by subcategory name
      brandName: Joi.string().allow(""), // Query by brand name
      customerCategory: Joi.string().valid("Ladies", "Gents", "Kids").allow(""), // Allow empty string,
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).default(12),
      populate: Joi.boolean().default(false),
    });

    const {
      title,
      shopName,
      categoryName,
      subcategoryName,
      brandName,
      customerCategory,
      page,
      limit,
      populate,
    } = await schema.validateAsync(req.query);

    // Initialize the query object
    let query = {};

    // Search by product title (case-insensitive, partial match)
    if (title)
      query.title = new RegExp(
        title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );

    // Resolve shop name to shop ID
    if (shopName) {
      const shop = await Shop.findOne({ name: shopName }).select("_id");
      if (shop) query.shop = shop._id;
      else
        return res
          .status(404)
          .json({ success: false, message: "Shop not found" });
    }

    // Resolve category name to category ID
    if (categoryName) {
      const category = await Category.findOne({
        categoryName: categoryName,
      }).select("_id");
      if (category) query.category = category._id;
      else
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
    }

    // Resolve subcategory name to subcategory ID
    if (subcategoryName) {
      const subcategory = await Subcategory.findOne({
        subcategoryName: subcategoryName,
      }).select("_id");
      if (subcategory) query.subcategory = subcategory._id;
      else
        return res
          .status(404)
          .json({ success: false, message: "Subcategory not found" });
    }

    // Resolve brand name to brand ID
    if (brandName) {
      const brand = await Brand.findOne({ brandName: brandName }).select("_id");
      if (brand) query.brand = brand._id;
      else
        return res
          .status(404)
          .json({ success: false, message: "Brand not found" });
    }

    // Add customer category filter
    if (customerCategory) query.customerCategory = customerCategory;

    const skip = (page - 1) * limit;

    // Fetch products
    const products = await Product.find(query)
      .sort({ createdAt: 1 })
      .limit(limit)
      .skip(skip)
      .populate([
        { path: "shop", model: "Shop" },
        { path: "supplier", model: "Supplier" },
        { path: "category", model: "Category" },
        { path: "subcategory", model: "Subcategory" },
        { path: "brand", model: "Brand" },
      ]);

    if (!products || products.length === 0) {
      return next(
        createError(
          404,
          "No products found related to your query. Please try again."
        )
      );
    }

    // Get total product count for pagination
    const totalCount = await Product.countDocuments(query);

    // Respond with the results
    res.status(200).json({
      success: true,
      products,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error(error);
    return next(createError(500, error.message || "Internal Server Error"));
  }
};

//==============================================================================
// Get All Products based on customer category (Ladies, Gents, Kids)
//==============================================================================

export const getProductsByCustomerCategory = async (req, res, next) => {
  try {
    const { customerCategory } = req.params;

    const customerProducts = await Product.find({
      customerCategory: { $regex: new RegExp(customerCategory, "i") },
    }).sort({ soldOut: -1 });
    if (!customerProducts || customerProducts.length === 0) {
      return res.status(200).json({ success: true, products: [] });
    }

    // Return the products
    res.status(200).json({ success: true, customerProducts });
  } catch (error) {
    console.error("Error getting products:", error);
    return next(createError(500, "Something went wrong. Please try again."));
  }
};

//==============================================================================
// Get Single Product
//==============================================================================

export const getProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id).populate([
      { path: "shop", model: "Shop" },
      { path: "supplier", model: "Supplier" },
      { path: "category", model: "Category" },
      { path: "subcategory", model: "Subcategory" },
      { path: "brand", model: "Brand" },
    ]);

    if (!product) {
      return next(createError(404, "Product not found"));
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

//==============================================================================
// Update Single Product
//==============================================================================

export const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    description,
    shop,
    supplier,
    category,
    brand,
    tags,
    status,
    stock,
    soldOut,
    variants,
  } = req.body;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return next(createError(404, "Product not found"));
    }

    // Update the product fields
    product.title = title || product.title;
    product.description = description || product.description;
    product.shop = shop || product.shop;
    product.supplier = supplier || product.supplier;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.tags = tags || product.tags;
    product.status = status || product.status;
    product.stock = stock || product.stock;
    product.soldOut = soldOut || product.soldOut;
    product.variants = variants || product.variants;

    // Save the updated product
    await product.save();

    res.status(200).json({
      success: true,
      product,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return next(createError(500, "Something went wrong"));
  }
};

//==============================================================================
// Delete Single Product
//==============================================================================

export const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return next(createError(404, "Product not found"));
    }

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return next(createError(500, "Something went wrong"));
  }
};

//==============================================================================
// Get All Products for a specific category
//==============================================================================
export const getAllCategoryProducts = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const products = await Category.findById(categoryId).populate("products");

    if (!products || products.length === 0) {
      return next(createError(404, "No products found"));
    }

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error getting products:", error);
    return next(createError(500, "Something went wrong"));
  }
};

//==============================================================================
// Get All Products for a specific brand
//==============================================================================
export const getAllBrandProducts = async (req, res, next) => {
  try {
    const { brandId } = req.params;
    const products = await Brand.findById(brandId).populate(products);

    if (!products || products.length === 0) {
      return next(createError(404, "No products found"));
    }

    res.status(200).json({ success: true, products });
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

//==============================================================================
// Product Review
//==============================================================================

export const productReview = async (req, res, next) => {
  try {
    const { ratings, productId, orderId } = req.body;
    const userId = req.user.id;

    if (!mongoose.isValidObjectId(productId)) {
      return next(createError(400, "Invalid product ID provided."));
    }

    if (!mongoose.isValidObjectId(userId)) {
      return next(createError(400, "Invalid user ID provided."));
    }

    if (!mongoose.isValidObjectId(orderId)) {
      return next(createError(400, "Invalid order ID provided."));
    }

    // Fetch product and user
    const product = await Product.findById(productId);
    if (!product) return next(createError(404, "Product not found."));

    const user = await User.findById(userId);
    if (!user) return next(createError(404, "User not found."));

    // Ensure the user has purchased the product before reviewing
    const order = await Order.findOne({
      _id: orderId,
      customer: userId,
      "orderedItems.product": productId,
    });

    if (!order) {
      return next(
        createError(403, "You can only review products you have purchased.")
      );
    }

    const newProductReview = {
      user: userId,
      rating: ratings.rating,
      comment: ratings.comment,
    };

    // Check if the user has already reviewed this product
    const existingReview = product.reviews.find(
      (review) => review.user.toString() === userId.toString()
    );

    if (existingReview) {
      // Update existing review
      existingReview.rating = ratings.rating;
      existingReview.comment = ratings.comment;
    } else {
      // Add new review
      product.reviews.push(newProductReview);
    }

    // Recalculate the average rating
    const totalRatings = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating = totalRatings / product.reviews.length;
    const averageRatingFixed = averageRating.toFixed(1);
    const totalReviews = product.reviews.length;

    const updateRatings = {
      average: averageRatingFixed,
      count: totalReviews,
    };

    product.ratings = updateRatings;

    // Save the updated product
    await product.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully!",
    });
  } catch (error) {
    console.error("Product Review Error:", error);
    next(createError(500, error.message || "Product review failed."));
  }
};
