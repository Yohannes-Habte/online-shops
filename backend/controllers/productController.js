import Product from '../models/productModel.js';
import createError from 'http-errors';
import Shop from '../models/shopModel.js';
import Order from '../models/orderModel.js';

//==============================================================================
// Create Product
//==============================================================================
export const createProduct = async (req, res, next) => {
  try {
    // Find shop ID
    const shopId = req.body.shopId;
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return createError(401, 'Shop not found! Please login!');
    } else {
      const product = new Product({
        ...req.body,
        shop: shop,
      });

      try {
        await product.save();
      } catch (error) {
        return createError(500, 'Shop is not saved! Please login!');
      }

      res.status(201).json({ success: true, product: product });
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'Product could not be created! Please try again!'));
  }
};

//==============================================================================
// Get Single Product
//==============================================================================
export const getSingleProduct = async (req, res, next) => {
  try {
    const productID = req.params.productID;

    // product id
    const product = await Product.findById(productID);
    if (!product) {
      return next(createError(400, `Product not found!`));
    }

    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
    next(createError(500, 'Product could not be accessed! Please try again!'));
  }
};

//==============================================================================
// Get All Products
//==============================================================================
export const getAllShopProducts = async (req, res, next) => {
  try {
    // Get the shop by its id
    const shopID = req.params.shopID;

    // find the shop id (seller id) and then find all its products
    const shop = await Shop.findById(shopID);

    if (!shop) {
      return next(createError(400, 'Shop not found!'));
    }

    // If the shop found, find all its products using the shopId in the database
    const products = await Product.find({ shopId: shopID });
    if (!products) {
      return next(createError(400, 'Products not found!'));
    }

    // if shop and products exist, get the products for that particular shop

    return res.status(200).json({ success: true, products: products });
  } catch (error) {
    console.log(error);
    next(createError(500, 'Products could not query! Please try again!'));
  }
};

//==============================================================================
// Get All Products
//==============================================================================
export const getAllShopsProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    if (!products) {
      return next(createError(400, 'Products not found!'));
    } else {
      return res.status(200).json(products);
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'Products could not query! Please try again!'));
  }
};

//==============================================================================
// Delete Single Products
//==============================================================================
export const deleteSingleProduct = async (req, res, next) => {
  try {
    // Find product id
    const productID = req.params.productID;

    // product id
    const product = await Product.findById(productID);
    if (!product) {
      return next(createError(400, `Product not found!`));
    }

    // If product exist, then you can get the product
    await Product.findByIdAndDelete(productID);
    return res.status(200).json(`The product has been successfully deleted!`);
  } catch (error) {
    console.log(error);
    next(createError(500, 'Product could not be deleted! Please try again!'));
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
      { $set: { 'cart.$[element].isReviewed': true } },
      { arrayFilters: [{ 'element._id': productId }], new: true }
    );

    res.status(201).json({
      success: true,
      message: 'Reviwed succesfully!',
    });
  } catch (error) {
    console.log(error);
    next(createError(500, 'Product review did not succeed! Please try again!'));
  }
};

//==============================================================================
// Products that could be seen only by admin
//==============================================================================
export const shopsProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.status(201).json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    next(
      createError(
        500,
        'All shops products could not be accessed! Please try again!'
      )
    );
  }
};
