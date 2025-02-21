import mongoose from "mongoose";
import createError from "http-errors";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Shop from "../models/shopModel.js";
import User from "../models/userModel.js";

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
      return next(createError(400, "Missing required fields!"));
    }

    if (!Array.isArray(orderedItems) || orderedItems.length === 0) {
      return next(createError(400, "Invalid order items format!"));
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

    // Ensure all products are valid and populate items
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
          variant.productImage === item.variant.productImage &&
          variant.productSizes.some(
            (sizeObj) =>
              sizeObj.size === item.variant.size && sizeObj.stock >= item.qty
          )
      );

      if (!selectedVariant) {
        console.warn(
          `Variant not found for product ID ${item._id}, Size: ${item.variant.size}, Color: ${item.variant.productColor}, Image: ${item.variant.productImage}`
        );
        continue; // Skip items with invalid variant or insufficient stock
      }

      // Update stock and soldOut count
      const sizeObj = selectedVariant.productSizes.find(
        (size) => size.size === item.variant.size
      );
      if (sizeObj && sizeObj.stock < item.qty) {
        console.warn(`Not enough stock for product ${item._id}`);
        continue; // Skip items with insufficient stock
      }

      // Deduct the stock
      sizeObj.stock -= item.qty;

      const total = item.qty * product.discountPrice;
      subtotalPrice += total;

      // Populate item with correct size
      populatedItems.push({
        ...item,
        size: item.variant.size, // Ensure size is set correctly
        product: product._id,
        title: product.title,
        category: product.category,
        subcategory: product.subcategory,
        brand: product.brand,
        supplier: product.supplier,
        shop: product.shop,
        productColor: selectedVariant.productColor,
        productImage: selectedVariant.productImage,
        productSize: item.variant.size,
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
    const discountAmount = calculateDiscount(subtotalPrice);

    const calculatedGrandTotal =
      subtotalPrice + taxAmount + shippingFeeAmount - discountAmount;

    // Create the order
    const order = new Order({
      customer,
      orderedItems: populatedItems,
      shippingAddress,
      payment,
      subtotal: subtotalPrice,
      shippingFee: shippingFeeAmount,
      tax: taxAmount,
      grandTotal: calculatedGrandTotal,
      orderStatus: "Pending",
      statusHistory: [{ status: "Pending", changedAt: new Date() }], // History
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

    // Find the user and update their orders
    const user = await User.findById(customer).session(session);
    user.myOrders.push(savedOrder._id);
    await user.save({ session });

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
// Get an order
//=========================================================================

export const getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid order ID format!"));
    }

    const order = await Order.findById(id)
      .populate({
        path: "customer",
        select: "name email image",
      })
      .populate({
        path: "orderedItems.product",
        model: "Product",
      })
      .populate({
        path: "orderedItems.category",
        select: "categoryName",
      })
      .populate({
        path: "orderedItems.subcategory",
        select: "subcategoryName",
      })
      .populate({
        path: "orderedItems.brand",
        select: "brandName brandDescription",
      })
      .populate({
        path: "orderedItems.supplier",
        select: "supplierName supplierEmail, supplierPhone",
      })
      .populate({
        path: "orderedItems.shop",
        select: "name email,phoneNumber, shopAddress",
      });

    if (!order) {
      return next(createError(404, "Order not found!"));
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(`Error fetching order: ${error.message}`);
    next(
      createError(500, "An unexpected error occurred. Please try again later.")
    );
  }
};

//=========================================================================
// Get an order
//=========================================================================

export const shopOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid order ID format!"));
    }

    const order = await Order.findById(id)
      .populate({
        path: "customer",
        select: "name email image",
      })
      .populate({
        path: "orderedItems.product",
        model: "Product",
      })
      .populate({
        path: "orderedItems.category",
        select: "categoryName",
      })
      .populate({
        path: "orderedItems.subcategory",
        select: "subcategoryName",
      })
      .populate({
        path: "orderedItems.brand",
        select: "brandName brandDescription",
      })
      .populate({
        path: "orderedItems.supplier",
        select: "supplierName supplierEmail, supplierPhone",
      })
      .populate({
        path: "orderedItems.shop",
        select: "name email,phoneNumber, shopAddress",
      });

    if (!order) {
      return next(createError(404, "Order not found!"));
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(`Error fetching order: ${error.message}`);
    next(
      createError(500, "An unexpected error occurred. Please try again later.")
    );
  }
};

//=========================================================================
// Helper function to push status history for update shop orders
//=========================================================================
const addToStatusHistory = (order, status) => {
  order.statusHistory.push({
    status,
    changedAt: new Date(),
    message: `Your order is ${status} at ${new Date().toLocaleString()}`,
  });
};

//=========================================================================
// Update order status for a shop
//=========================================================================
export const updateShopOrders = async (req, res, next) => {
  const { orderStatus, tracking, cancellationReason, returnReason } = req.body;
  const { id } = req.params;
  const shopId = req.shop.id;

  // 1. Validate the order ID and shop ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, "Invalid order ID format!"));
  }

  if (!mongoose.Types.ObjectId.isValid(shopId)) {
    return next(createError(400, "Invalid shop ID format!"));
  }

  // 2. Start a transaction for atomicity
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 3. Fetch the shop by ID to ensure it's the correct shop
    const seller = await Shop.findById(shopId).session(session);
    if (!seller) {
      await session.abortTransaction();
      return next(createError(404, "No permission to update order status!"));
    }

    // 4. Fetch the order by ID and check its current status
    const order = await Order.findById(id).session(session);
    if (!order) {
      await session.abortTransaction();
      return next(createError(404, "Order not found!"));
    }

    // 5. Ensure that the status transition is valid
    if (
      ![
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned",
      ].includes(orderStatus)
    ) {
      await session.abortTransaction();
      return next(createError(400, "Invalid order status provided!"));
    }

    // 6. Prevent modification if already "Delivered" or "Returned"
    if (["Delivered", "Returned"].includes(order.orderStatus)) {
      await session.abortTransaction();
      return next(
        createError(
          400,
          "Cannot modify the order status once it is delivered or returned!"
        )
      );
    }

    // 7. If the order status is "Processing", update orderStatus, statusHistory, and tracking
    if (orderStatus === "Processing") {
      order.orderStatus = orderStatus;
      addToStatusHistory(order, orderStatus);
      if (tracking) {
        order.tracking = tracking;
      } else {
        return next(
          createError(
            400,
            "Tracking details must be provided when status is 'Processing'"
          )
        );
      }
    }

    // 8. If the order status is "Shipped", update  orderStatus, and statusHistory
    if (orderStatus === "Shipped") {
      order.orderStatus = orderStatus;
      addToStatusHistory(order, orderStatus);
    }

    // 9. If the order status is "Delivered", update orderStatus, statusHistory, payment status, service fee, stock, soldOut, availableBalance, and deliverAt
    if (orderStatus === "Delivered") {
      order.orderStatus = orderStatus;
      order.deliveredAt = Date.now();
      order.payment.paymentStatus = "completed";

      // Calculate service fee, soldOut, availableBalance
      const grandTotal = order.grandTotal;
      const shopCommission = grandTotal * 0.01;
      const shopBalance = grandTotal - shopCommission;
      const shopNetOrderAmount = parseFloat(shopBalance.toFixed(2));

      // Update service fee, deliveredAt, soldOut, and availableBalance
      order.serviceFee = shopCommission;
      order.availableBalance = shopNetOrderAmount;

      // Loop through the ordered items to update stock and soldOut in the product schema
      await Promise.all(
        order.orderedItems.map(async (item) => {
          const product = await Product.findById(item.product).session(session);
          if (product) {
            // Find the variant based on the productColor
            const variant = product.variants.find(
              (v) => v.productColor === item.productColor
            );
            if (variant) {
              // Find the product size based on the size
              const productSize = variant.productSizes.find(
                (size) => size.size === item.size
              );
              if (productSize) {
                // Check if stock is sufficient before decrementing
                if (productSize.stock < item.quantity) {
                  return next(
                    createError(
                      400,
                      `Insufficient stock for product ${product.name}, size ${item.size}.`
                    )
                  );
                }

                // Reduce stock and update soldOut in the product schema
                productSize.stock -= item.quantity;
                product.soldOut += item.quantity; // Increase soldOut quantity

                await product.save({ session });
              } else {
                throw new Error(
                  `Size ${item.size} not found in product variant.`
                );
              }
            } else {
              throw new Error(
                `Variant with color ${item.productColor} not found.`
              );
            }
          }
        })
      );

      // Add to status history
      addToStatusHistory(order, orderStatus);

      // Update shop balance
      if (seller) {
        seller.availableBalance += shopNetOrderAmount;
        await seller.save({ session });
      }
    }

    // 10. Handle the "Cancelled" status logic
    if (orderStatus === "Cancelled") {
      if (cancellationReason) {
        order.cancellationReason = cancellationReason;
      }
      order.orderStatus = orderStatus;
      addToStatusHistory(order, orderStatus);
    }

    // 11. Handle the "Returned" status logic
    if (orderStatus === "Returned") {
      if (returnReason) {
        order.returnReason = returnReason;
      }
      order.orderStatus = orderStatus;
      addToStatusHistory(order, orderStatus);
    }

    // 12. Save the updated order and commit the transaction
    await order.save({ validateBeforeSave: false, session });
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    return next(
      createError(500, "Order status update failed. Please try again.")
    );
  } finally {
    session.endSession();
  }
};

/**

export const updateShopOrders = async (req, res, next) => {
  const { orderStatus, cancellationReason, returnReason } = req.body;
  const { id } = req.params;
  const shopId = req.shop.id;

  // 1. Validate the order ID and shop ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, "Invalid order ID format!"));
  }

  if (!mongoose.Types.ObjectId.isValid(shopId)) {
    return next(createError(400, "Invalid shop ID format!"));
  }

  // 2. Start a transaction for atomicity
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 3. Fetch the shop by ID to ensure it's the correct shop
    const seller = await Shop.findById(shopId).session(session);
    if (!seller) {
      session.abortTransaction();
      return next(createError(404, "No permission to update order status!"));
    }

    // 4. Fetch the order by ID and check its current status
    const order = await Order.findById(id).session(session);
    if (!order) {
      session.abortTransaction();
      return next(createError(404, "Order not found!"));
    }

    console.log("Order status:", order);

    // 5. Ensure that the status transition is valid
    if (
      orderStatus &&
      ![
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned",
      ].includes(orderStatus)
    ) {
      session.abortTransaction();
      return next(createError(400, "Invalid order status provided!"));
    }

    // 6. Handle specific order status updates
    if (orderStatus) {
      // Prevent transition from Delivered back to other statuses
      if (order.orderStatus === "Delivered" && orderStatus !== "Returned") {
        session.abortTransaction();
        return next(
          createError(
            400,
            "Cannot modify the order status once it is delivered!"
          )
        );
      }

      order.orderStatus = orderStatus;

      // Handle cancellation reason
      if (orderStatus === "Cancelled" && cancellationReason) {
        order.cancellationReason = cancellationReason;
      }

      // Handle return reason
      if (orderStatus === "Returned" && returnReason) {
        order.returnReason = returnReason;
      }

      // Add to the status history using the helper function
      addToStatusHistory(order, orderStatus);
    }

    // 7. Handle the "Delivered" status logic
    if (orderStatus === "Delivered") {
      order.deliveredAt = Date.now();
      order.payment.paymentStatus = "completed";

      
      // Calculate shop commission and net order amount
      const grandTotal = order.grandTotal;
      const shopCommission = grandTotal * 0.1;
      const serviceFee = grandTotal * 0.01;
      const shopBalance = grandTotal - shopCommission;
      const shopNetOrderAmount = parseFloat(shopBalance.toFixed(2)); // Convert string to number

      // Add to status history
      addToStatusHistory(order, orderStatus);

      // Update shop balance
      if (seller) {
        seller.availableBalance += shopNetOrderAmount; // Now adding number to number
        await seller.save({ session });
      }
    }

    // 8. Handle other statuses like "Shipped", "Processing"
    if (["Shipped", "Processing"].includes(orderStatus)) {
      await Promise.all(
        order.orderedItems.map(async (item) => {
          const product = await Product.findById(item.product).session(session);
          if (product) {
            const variant = product.variants.find(
              (v) => v.productColor === item.productColor
            );
            if (variant) {
              const productSize = variant.productSizes.find(
                (size) => size.size === item.size
              );
              if (productSize) {
                if (orderStatus === "Shipped") {
                  // Check if stock is sufficient before decrementing
                  if (productSize.stock < item.quantity) {
                    session.abortTransaction();
                    return next(
                      createError(
                        400,
                        `Insufficient stock for product ${product.name}, size ${item.size}.`
                      )
                    );
                  }

                  productSize.stock -= item.quantity;
                  product.soldOut += item.quantity;

                  // Add to status history
                  addToStatusHistory(order, orderStatus);
                } else if (orderStatus === "Processing") {
                  addToStatusHistory(order, orderStatus);
                }

                await product.save({ session });
              } else {
                throw new Error(
                  `Size ${item.size} not found in product variant.`
                );
              }
            } else {
              throw new Error(
                `Variant with color ${item.productColor} not found.`
              );
            }
          }
        })
      );
    }

    // 9. Handle "Returned" status: No stock update, just handling returnReason
    if (orderStatus === "Returned") {
      order.returnReason = returnReason || "No reason provided";
      addToStatusHistory(order, orderStatus); // Add to status history for return
    }

    // 10. Save the updated order and commit the transaction
    await order.save({ validateBeforeSave: false, session });
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    return next(
      createError(500, "Order status update failed. Please try again.")
    );
  } finally {
    session.endSession();
  }
};
 */
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
// Get all orders for a user
//=========================================================================

export const getAllUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return next(
        createError(401, "Unauthorized: Please login to view your orders")
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(createError(400, "Invalid user ID format"));
    }

    const user = await User.findById(userId).populate("myOrders").lean();

    if (!user) {
      return next(createError(404, "User not found"));
    }

    if (!user.myOrders?.length) {
      return next(createError(404, "No orders found for this user"));
    }

    res.status(200).json({ success: true, orders: user.myOrders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    next(
      createError(500, error.message || "Server error: Unable to fetch orders.")
    );
  }
};

//=========================================================================
// Get all orders for a seller with populated fields
//=========================================================================
export const allShopOrders = async (req, res, next) => {
  try {
    const sellerId = req.shop.id;

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return next(createError(400, "Invalid seller ID format"));
    }

    const shop = await Shop.findById(sellerId).select("_id");

    if (!shop) {
      return next(createError(404, "Seller not found"));
    }

    // Fetch orders for the shop and populate necessary fields
    const orders = await Order.find({ "orderedItems.shop": shop._id })
      .populate("orderedItems.product", "title price productImage")
      .populate("orderedItems.category", "categoryName")
      .populate("orderedItems.subcategory", "subcategoryName")
      .populate("orderedItems.brand", "brandName")
      .populate("orderedItems.supplier", "supplierName")
      .populate("payment.createdBy", "username email")
      .populate("payment.updatedBy", "username email")
      .populate("customer", "username email")
      .select(
        "orderedItems orderStatus shippingAddress subtotal grandTotal payment createdAt tracking statusHistory"
      );

    res.status(200).json({
      success: true,
      orders: orders,
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
// Get all orders for all shops (Admin Only)
//=========================================================================
export const allShopsOrders = async (req, res, next) => {
  try {
    // Ensure only admins can access this route
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "admin") {
      return next(createError(403, "Unauthorized access!"));
    }

    // Pagination setup
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch orders with sorting and pagination
    const orders = await Order.find()
      .sort({ deliveredAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-sensitiveField"); // Exclude sensitive fields if necessary

    if (!orders) {
      return next(createError(404, "No orders found!"));
    }

    // count the total number of orders
    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      success: true,
      count: totalOrders,
      page,
      orders,
    });
  } catch (error) {
    console.error("Error fetching all shop orders:", error);
    next(createError(500, "Failed to retrieve orders. Please try again."));
  }
};
