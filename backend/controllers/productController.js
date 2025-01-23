import Product from "../models/productModel.js";
import createError from "http-errors";
import Shop from "../models/shopModel.js";
import Order from "../models/orderModel.js";
import Brand from "../models/brandModel.js";
import Category from "../models/categoryModel.js";
import mongoose from "mongoose";

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
// Get Single Product
//==============================================================================

export const getProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id).populate(
      "shop supplier category brand"
    );

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
// Get All Products for All Shops
//==============================================================================

export const getAllProducts = async (req, res, next) => {
  try {
    // Pagination options
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .populate("shop supplier category brand");

    if (!products || products.length === 0) {
      return next(createError(404, "No products found"));
    }

    const totalCount = await Product.countDocuments();

    res.status(200).json({
      success: true,
      products,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
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
    const { user, rating, comment, productId, orderId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return next(createError(400, `Product not found!`));
    }

    // New Review for a product
    const newReview = {
      user,
      rating,
      comment,
      productId,
    };

    // Is product reviewed?
    const isReviewed = product.reviews.find(
      (review) => review.user._id === req.user._id
    );

    // If product is reviewed, ..., otherwise, push the new review of a product to a product model
    if (isReviewed) {
      product.reviews.forEach((accessed) => {
        if (accessed.user._id === req.user._id) {
          (accessed.rating = rating),
            (accessed.comment = comment),
            (accessed.user = user);
        }
      });
    } else {
      product.reviews.push(newReview);
    }

    // Ratings sum for a product
    let totalSum = 0;

    product.reviews.forEach((review) => {
      totalSum = totalSum + review.rating;
    });

    // Average rating for a product is
    product.ratings = totalSum / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    // Update order after the product is reviewed. If the product is reviewed, isReviewed will be true in the orders collection under the cart
    await Order.findByIdAndUpdate(
      orderId,
      { $set: { "cart.$[element].isReviewed": true } },
      { arrayFilters: [{ "element._id": productId }], new: true }
    );

    res.status(201).json({
      success: true,
      message: "Reviwed succesfully!",
    });
  } catch (error) {
    console.log(error);
    next(createError(500, "Product review did not succeed! Please try again!"));
  }
};

