import mongoose from "mongoose";
import createError from "http-errors";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Shop from "../models/shopModel.js";

//=========================================================================
// Create an order
//=========================================================================
export const createOrder = async (req, res, next) => {
  let { orderedItems, shippingAddress, customer, payment } = req.body;

  // Validate customer ID using mongoose
  if (!mongoose.Types.ObjectId.isValid(customer)) {
    return res.status(400).json({ message: "Invalid customer ID." });
  }

  // Start transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validate required fields
    if (!customer || !orderedItems || !shippingAddress) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    if (!Array.isArray(orderedItems) || orderedItems.length === 0) {
      return res
        .status(400)
        .json({ message: "Ordered items cannot be empty." });
    }

    // Validate each ordered item
    const productErrors = [];
    orderedItems.forEach((item) => {
      if (!item._id || !mongoose.Types.ObjectId.isValid(item._id)) {
        productErrors.push(`Invalid or missing product ID: ${item._id}`);
      }
      if (!item.qty || item.qty <= 0) {
        productErrors.push(
          `Invalid or missing quantity for product ${item._id}`
        );
      }
    });

    if (productErrors.length > 0) {
      return res
        .status(400)
        .json({ message: "Validation errors.", errors: productErrors });
    }

    // Process and verify each product
    let subtotalPrice = 0;
    const productIds = orderedItems.map((item) => item._id);
    const products = await Product.find({ _id: { $in: productIds } }).session(
      session
    );
    const populatedItems = [];

    for (const item of orderedItems) {
      const product = products.find((p) => p._id.toString() === item._id);
      if (!product) {
        console.warn(`Product not found: ${item._id}`);
        continue; // Skip invalid products
      }

      // Ensure the variant exists in the product's variants array
      const selectedVariant = product.variants.find(
        (variant) =>
          variant.productColor === item.variant.productColor &&
          variant.productSize === item.variant.productSize
      );

      if (!selectedVariant) {
        console.warn(`Variant not found for product ID ${item._id}`);
        continue; // Skip items with invalid variant
      }

      // Check stock availability
      if (product.stock < item.qty) {
        console.warn(`Not enough stock for product ${item._id}`);
        continue; // Skip items with insufficient stock
      }

      // Update stock and soldOut count
      product.stock -= item.qty;
      product.soldOut += item.qty;

      const total = item.qty * product.discountPrice;
      subtotalPrice += total;

      populatedItems.push({
        ...item,
        product: product._id,
        title: product.title,
        category: product.category,
        subcategory: product.subcategory,
        brand: product.brand,
        supplier: product.supplier,
        shop: product.shop,
        productColor: selectedVariant.productColor,
        productSize: selectedVariant.productSize,
        quantity: item.qty,
        price: product.discountPrice,
        total,
      });

      // Save product updates
      await product.save({ session });
    }

    // Calculate tax, shipping fee, service fee, and discount
    const calculateTax = (subTotal) => subTotal * 0.02;
    const calculateShippingFee = (subTotal) =>
      subTotal <= 100 ? 50 : subTotal * 0.1;
    const calculateServiceCharge = (subTotal) => subTotal * 0.01;
    const calculateDiscount = (subTotal) => {
      if (subTotal > 500) return subTotal * 0.1; // 10% discount
      if (subTotal > 200) return subTotal * 0.05; // 5% discount
      return 0;
    };

    const taxAmount = calculateTax(subtotalPrice);
    const shippingFeeAmount = calculateShippingFee(subtotalPrice);
    const serviceFeeAmount = calculateServiceCharge(subtotalPrice);
    const discountAmount = calculateDiscount(subtotalPrice);

    const calculatedGrandTotal =
      subtotalPrice +
      taxAmount +
      shippingFeeAmount +
      serviceFeeAmount -
      discountAmount;

    // Create the order
    const order = new Order({
      customer,
      orderedItems: populatedItems,
      shippingAddress,
      payment,
      subtotal: subtotalPrice,
      shippingFee: shippingFeeAmount,
      tax: taxAmount,
      serviceFee: serviceFeeAmount,
      grandTotal: calculatedGrandTotal,
      orderStatus: "Pending",
      statusHistory: [{ status: "Pending", changedAt: new Date() }],
    });

    const savedOrder = await order.save({ session });

    // Update associated shops using findByIdAndUpdate
    const shopIds = [...new Set(populatedItems.map((item) => item.shop))];
    await Promise.all(
      shopIds.map(async (shopId) => {
        const soldProducts = populatedItems
          .filter((item) => item.shop.toString() === shopId.toString())
          .map((item) => item.product);

        await Shop.findByIdAndUpdate(
          shopId,
          {
            $addToSet: { soldProducts: { $each: soldProducts } }, // Prevent duplicates
            $push: { orders: savedOrder._id },
          },
          { session }
        );
      })
    );

    // Commit the transaction
    await session.commitTransaction();

    return res.status(201).json({
      message: "Order created successfully.",
      order: savedOrder,
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await session.abortTransaction();
    console.error("Error creating order:", error);
    return res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

//=========================================================================
// Update order status for a shop
//=========================================================================

export const updateShopOrders = async (req, res, next) => {
  try {
    // Find order by id
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(createError(400, "Order not found!"));
    }

    // Update each ordered product using forEach method and updateOrder function
    if (req.body.status === "Transferred to delivery partner") {
      order.cart.forEach(async (product) => {
        await updateOrder(product._id, product.qty);
      });
    }

    // The order status in the database will be ...
    order.status = req.body.status;

    // Update shop info using updateShopInfo function
    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
      order.paymentInfo.status = "Succeeded";
      const serviceCharge = order.totalPrice * 0.1;
      const ammount = order.totalPrice - serviceCharge;
      await updateShopInfo(ammount);
    }

    // Save the order
    await order.save({ validateBeforeSave: false });

    // Response is ...
    res.status(200).json({
      success: true,
      order,
    });

    // update product after an order has been transferred to delivery partner
    async function updateOrder(id, qty) {
      const product = await Product.findById(id);

      product.stock = product.stock - qty;
      product.soldOut = product.soldOut + qty;

      await product.save({ validateBeforeSave: false });
    }

    // update shop info after an order has been delivered to a user
    async function updateShopInfo(amount) {
      const shop = await Shop.findById(req.params.shopId);

      shop.availableBalance = amount;

      await shop.save();
    }
  } catch (error) {
    console.log(error);
    next(createError(500, "Order is not updated! Please try again!"));
  }
};

//=========================================================================
// Order Refund for a user
//=========================================================================

export const refundUserOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(createError(400, "Order does not exist in the database!"));
    }

    // Update status from the frontend
    order.status = req.body.status;

    // Save order update
    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      order,
      message: `Refund Request for your order is successful!`,
    });
  } catch (error) {
    next(createError(500, "Database could not refund! Please try again!"));
  }
};

//=========================================================================
// Shop Refunds back to a user ordered products
//=========================================================================

export const orderRefundByShop = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(createError(400, "Order does not exist!"));
    }

    // Update status from the frontend
    order.status = req.body.status;

    // Save refund status
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order Refund is successfull!",
    });

    // Update order function
    const updateOrder = async (id, qty) => {
      const product = await Product.findById(id);

      product.stock = product.stock + qty;
      product.soldOut = product.soldOut - qty;

      await product.save({ validateBeforeSave: false });
    };

    // If status is 'Successfully refunded', then ...
    if (req.body.status === "Successfully refunded") {
      order.cart.forEach(async (order) => {
        await updateOrder(order._id, order.qty);
      });
    }
  } catch (error) {
    next(createError(500, "Database could not refund! Please try again!"));
  }
};

//=========================================================================
// Get an order
//=========================================================================

export const getOrder = async (req, res, next) => {
  try {
    res.send("New order");
  } catch (error) {
    next(createError(500, "Order could not be accessed! Please try again!"));
  }
};

//=========================================================================
// Get all orders for a user
//=========================================================================

export const getAllUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ "user._id": req.params.userId }).sort({
      createdAt: -1,
    });

    if (!orders) {
      return next(createError(400, "User orders not found! Please try again!"));
    }

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(createError(500, "Orders could not be accessed! Please try again!"));
  }
};

//=========================================================================
// Get all orders for a seller
//=========================================================================

export const allShopOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      "cart.shopId": req.params.shopId,
    }).sort({
      createdAt: -1,
    });

    if (!orders) {
      return next(
        createError(400, "Seller orders not found! Please try again!")
      );
    }

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(createError(500, "Orders could not be accessed! Please try again!"));
  }
};

//=========================================================================
// Delete an order
//=========================================================================

export const deleteOrder = async (req, res, next) => {
  try {
    res.send("New order");
  } catch (error) {
    next(createError(500, "Order could not be deleted! Please try again!"));
  }
};

//=========================================================================
// Delete all orders
//=========================================================================

export const deleteOrders = async (req, res, next) => {
  try {
    res.send("New order");
  } catch (error) {
    next(createError(500, "Orders could not be deleted! Please try again!"));
  }
};

//=========================================================================
// Get all orders for all shops by an admin
//=========================================================================

export const allShopsOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({
      deliveredAt: -1,
      createdAt: -1,
    });
    res.status(201).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(
      createError(500, "All shops orders could not be accessed! Try again!")
    );
  }
};
