import mongoose from "mongoose";
import createError from "http-errors";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Shop from "../models/shopModel.js";
import User from "../models/userModel.js";

//=========================================================================
// Helper functions for order calculations and status history updates
//=========================================================================

// 1. Helper function to calculate shop commission
const calculateShopCommission = (grandTotal) =>
  parseFloat((grandTotal * 0.01).toFixed(2));

// 2. Helper function to  const calculateTax = (subTotal) => subTotal * 0.02;
const calculateTaxAmount = (subTotal) =>
  parseFloat((subTotal * 0.02).toFixed(2));

// 3. Helper function to calculate shipping fee
const calculateShippingFee = (subTotal) => {
  if (typeof subTotal !== "number" || subTotal < 0) return 0;

  return subTotal <= 100
    ? 50
    : subTotal < 500
    ? parseFloat((subTotal * 0.1).toFixed(2))
    : subTotal < 1000
    ? parseFloat((subTotal * 0.05).toFixed(2))
    : subTotal < 2000
    ? parseFloat((subTotal * 0.04).toFixed(2))
    : parseFloat((subTotal * 0.04).toFixed(2));
};

// 4. Helper function for discount calculation
const calculateDiscount = (subTotal) => {
  if (typeof subTotal !== "number" || subTotal < 0) return 0;

  // Validate input: Ensure subTotal is a positive number or can be converted into a valid number
  const parsedSubTotal = parseFloat(subTotal);

  if (isNaN(parsedSubTotal) || parsedSubTotal < 0) {
    throw new Error("Invalid subTotal. Please provide a positive number.");
  }

  // Discount tiers (threshold and discount values)
  const discountTiers = [
    { threshold: 10000, discount: 0.05 },
    { threshold: 4000, discount: 0.04 },
    { threshold: 2000, discount: 0.03 },
    { threshold: 1000, discount: 0.02 },
    { threshold: 500, discount: 0.01 },
    { threshold: 250, discount: 0.005 },
  ];

  // Loop through the discount tiers to find the appropriate discount
  for (const { threshold, discount } of discountTiers) {
    if (parsedSubTotal >= threshold) {
      const discountAmount = parsedSubTotal * discount;
      return parseFloat(discountAmount.toFixed(2)); // Round to 2 decimal places
    }
  }

  // No discount if subTotal is below the first threshold
  return 0;
};

// 5. Helper function to calculate the grand total
const calculateGrandTotal = (subtotal, tax, shippingFee, discount) => {
  if (
    typeof subtotal !== "number" ||
    typeof tax !== "number" ||
    typeof shippingFee !== "number" ||
    typeof discount !== "number"
  ) {
    throw new Error("Invalid input: All inputs must be numbers.");
  }

  return parseFloat((subtotal + tax + shippingFee - discount).toFixed(2));
};

// 6. Helper function to push status history for update shop orders
const addToStatusHistory = (order, status) => {
  order.statusHistory.push({
    status,
    changedAt: new Date(),
    message: `Your order is ${status} at ${new Date().toLocaleString()}`,
  });
};

//=========================================================================
// Create an order
//=========================================================================
export const createOrder = async (req, res, next) => {
  let { orderedItems, shippingAddress, customer, payment } = req.body;

  const authUserId = req.user.id;

  if (!authUserId) {
    return next(
      createError(401, "Unauthorized: Please login to place an order.")
    );
  }

  if (!mongoose.Types.ObjectId.isValid(authUserId)) {
    return next(createError(400, "Invalid user ID format."));
  }

  // Validate customer ID using mongoose
  if (!mongoose.Types.ObjectId.isValid(customer)) {
    return res.status(400).json({ message: "Invalid customer ID." });
  }

  if (customer !== authUserId) {
    return next(
      createError(
        403,
        "Unauthorized: You cannot place an order for another user."
      )
    );
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

    //
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
          variant.productSizes.some(
            (sizeObj) =>
              sizeObj.size === item.variant.size && sizeObj.stock >= item.qty
          )
      );

      if (!selectedVariant) {
        console.warn(
          `Variant not found for product ID ${item._id},  Color: ${item.variant.productColor} and Size: ${item.variant.size} }`
        );
        continue; // Skip items with invalid variant or insufficient stock
      }

      // Update stock and soldOut count
      const sizeObj = selectedVariant.productSizes.find(
        (size) => size.size === item.variant.size
      );

      if (!sizeObj) {
        console.warn(`Size not found for product ${item._id}`);
        continue; // Skip items with invalid size
      }

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
        size: item.variant.size,
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

    const taxAmount = calculateTaxAmount(subtotalPrice);
    const shippingFeeAmount = calculateShippingFee(subtotalPrice);
    const discountAmount = calculateDiscount(subtotalPrice);

    const grandTotal = calculateGrandTotal(
      subtotalPrice,
      taxAmount,
      shippingFeeAmount,
      discountAmount
    );

    // Create the order
    const order = new Order({
      customer,
      orderedItems: populatedItems,
      shippingAddress,
      payment,
      subtotal: subtotalPrice,
      shippingFee: shippingFeeAmount,
      tax: taxAmount,
      grandTotal: grandTotal,
      orderStatus: "Pending",
      statusHistory: [{ status: "Pending", changedAt: new Date() }], // History
    });

    const savedOrder = await order.save({ session });

    // The order belongs only to one Shop. So, update the shop by pushing the order ID to the orders array of the shop
    const shopId = populatedItems[0].shop;

    await Shop.findByIdAndUpdate(
      shopId,
      { $push: { orders: savedOrder._id } },
      { session }
    );

    // Update shop soldProducts array with the ordered product IDs. This is for tracking the products sold by the shop. Hence, you need to find the products from the populatedItems array and push them to the soldProducts array of the shop.
    const shopSoldProductsIds = populatedItems.map((item) => item.product);
    await Shop.findByIdAndUpdate(
      shopId,
      { $addToSet: { soldProducts: { $each: shopSoldProductsIds } } },
      { session }
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
      .populate([
        {
          path: "customer",
          select: "name email image",
        },
        {
          path: "orderedItems.product",
          model: "Product",
        },
        {
          path: "orderedItems.category",
          select: "categoryName",
        },
        {
          path: "orderedItems.subcategory",
          select: "subcategoryName",
        },
        {
          path: "orderedItems.brand",
          select: "brandName brandDescription",
        },
        {
          path: "orderedItems.supplier",
          select: "supplierName supplierEmail supplierPhone",
        },
        {
          path: "orderedItems.shop",
          select: "name email phoneNumber shopAddress",
        },
        {
          path: "refundRequestInfo.product",
          model: "Product",
          select: "title discountPrice productImage",
        },
        {
          path: "returnedItems.refundRequestIdLinked",
          select: "refundRequestInfo product",
          populate: {
            path: "refundRequestInfo.product",
            model: "Product",
            select: "title discountPrice productImage",
          },
        },
      ])
      .lean();

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
// Update order status for a shop
//=========================================================================
export const updateShopOrder = async (req, res, next) => {
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
      return next(createError(404, "Shop not found!"));
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
        "Refund Requested",
        "Refund Processing",
        "Returned",
        "Refunded",
      ].includes(orderStatus)
    ) {
      await session.abortTransaction();
      return next(createError(400, "Invalid order status provided!"));
    }

    // 6. Prevent modification if already "Returned", "Refund Rejected" or "Refunded"
    if (
      ["Returned", "Refund Rejected", "Refunded"].includes(order.orderStatus)
    ) {
      await session.abortTransaction();
      return next(
        createError(
          400,
          `Cannot modify the order status once it is returned or refunded!`
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

    // 9. If the order status is "Delivered", update orderStatus, statusHistory, payment status, service fee, stock, soldOut, shopIncomeInfo, and deliverAt
    if (orderStatus === "Delivered") {
      order.orderStatus = orderStatus;
      order.deliveredAt = Date.now();
      order.payment.paymentStatus = "completed";

      // Calculate service fee, soldOut, shopIncomeInfo
      const grandTotal = order.grandTotal;
      const shopCommission = calculateShopCommission(grandTotal); // None refundable
      const shopBalance = grandTotal - shopCommission;
      const shopNetOrderAmount = parseFloat(shopBalance.toFixed(2));

      // Update service fee, shopIncomeInfo, soldOut, and status history
      order.serviceFee = shopCommission.toFixed(2);

      if (!Array.isArray(seller.shopIncomeInfo)) {
        seller.shopIncomeInfo = [];
      }

      seller.shopIncomeInfo.push({
        paymentDate: new Date(),
        currentAmount: shopNetOrderAmount,
      });

      seller.netShopIncome = (
        seller.netShopIncome + shopNetOrderAmount
      ).toFixed(2);

      await seller.save({ validateBeforeSave: false, session });

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

      // Update order status history
      addToStatusHistory(order, orderStatus);
    }

    // 10. Handle the "Cancelled" status logic.

    if (orderStatus === "Cancelled") {
      if (cancellationReason) {
        return next(createError(400, "Order is already cancelled."));
      } else {
        order.cancellationReason = cancellationReason;
        order.orderStatus = orderStatus;
        addToStatusHistory(order, orderStatus);
      }
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

//=========================================================================
// User Refund request for an order placed
//=========================================================================
export const refundUserOrderRequest = async (req, res, next) => {
  const {
    productId,
    productColor,
    productSize,
    quantity,
    requestedDate,
    refundReason,
    otherReason,
    orderStatus,
  } = req.body;

  const orderId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return next(createError(400, "Invalid order ID format!"));
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return next(createError(400, "Invalid product ID format!"));
  }

  const currentStatus = "Refund Requested";
  if (orderStatus !== currentStatus) {
    return next(
      createError(400, `Invalid order status update: ${orderStatus}.`)
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(orderId).session(session);

    if (!order) {
      await session.abortTransaction();
      return next(createError(404, "Order not found!"));
    }

    // Find the product
    const product = await Product.findById(productId).session(session);
    if (!product) {
      await session.abortTransaction();
      return next(createError(404, "Product not found!"));
    }

    const productPrice = product.discountPrice;

    // Find the ordered product in the order
    const orderedProduct = order.orderedItems.find(
      (item) =>
        String(item.product._id) === String(productId) &&
        item.productColor.trim().toLowerCase() ===
          productColor.trim().toLowerCase() &&
        String(item.size).toLowerCase() === String(productSize).toLowerCase() &&
        Number(item.quantity) === Number(quantity)
    );

    if (!orderedProduct) {
      await session.abortTransaction();
      return next(createError(400, "Product not found in the order!"));
    }

    // Prevent duplicate refund requests
    const existingRefundRequest = order.refundRequestInfo?.find(
      (refund) =>
        refund.product.toString() === productId.toString() &&
        refund.requestedItemColor.trim().toLowerCase() ===
          productColor.trim().toLowerCase() &&
        String(refund.requestedItemSize || "").toLowerCase() ===
          String(productSize).toLowerCase() &&
        Number(new Date(refund.requestedDate).getTime()) ===
          Number(new Date(requestedDate).getTime()) &&
        Number(refund.requestedItemQuantity || 0) === Number(quantity)
    );

    // If a refund request for this product already exists, prevent a duplicate request
    if (existingRefundRequest) {
      await session.abortTransaction();
      return next(createError(400, "Refund already requested for this item!"));
    }

    // Ensure product price matches backend data
    if (Number(productPrice) !== Number(orderedProduct.price)) {
      await session.abortTransaction();
      return next(
        createError(400, "Product price mismatch! Please contact support.")
      );
    }

    // Ensure product size matches backend data
    if (
      String(productSize).toLowerCase() !==
      String(orderedProduct.size).toLowerCase()
    ) {
      await session.abortTransaction();
      return next(
        createError(400, "Product size mismatch! Please contact support.")
      );
    }

    // Calculate refund amount
    const subTotalProductPrice = productPrice * quantity;

    const taxAmount = calculateTaxAmount(subTotalProductPrice);
    const shippingFeeAmount = calculateShippingFee(subTotalProductPrice);
    const discountAmount = calculateDiscount(subTotalProductPrice);

    const netRefundAmount = calculateGrandTotal(
      subTotalProductPrice,
      taxAmount,
      shippingFeeAmount,
      discountAmount
    );

    // Update order status
    order.orderStatus = orderStatus;

    // Update order status history
    order.statusHistory.push({
      status: "Refund Requested",
      changedAt: new Date(),
      message: `Your order, placed on ${new Date().toLocaleString()}, for the product ${
        product.title
      } with color ${productColor}, size ${productSize}, and quantity ${quantity}, has been successfully marked as Refund Requested. We are processing your request and will notify you once it is completed.`,
    });

    // Add refund request details
    order.refundRequestInfo.push({
      refundRequestId: new mongoose.Types.ObjectId(),
      product: productId,
      requestedItemColor: productColor,
      requestedItemSize: productSize,
      requestedItemQuantity: quantity,
      requestedDate: requestedDate,
      requestRefundReason: refundReason,
      otherReason: otherReason,
      requestedRefundAmount: netRefundAmount,
    });

    await order.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      order,
      message: "Your refund request has been submitted successfully!",
    });
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    next(
      createError(500, "An error occurred while processing the refund request!")
    );
  } finally {
    session.endSession();
  }
};

//=========================================================================
// Shop Refunds back to a user for an order placed
//=========================================================================
export const orderRefundByShop = async (req, res, next) => {
  const {
    refundRequestIdLinked,
    isProductReturned,
    returnedDate,
    condition,
    comments,
    refundAmount,
    processedDate,
    refundStatus,
    processedBy,
  } = req.body;

  let orderStatus;

  if (isProductReturned === true && refundStatus === "Rejected") {
    orderStatus = "Refund Rejected";
  } else if (
    isProductReturned === true &&
    condition === "New" &&
    refundStatus === "Accepted"
  ) {
    orderStatus = "Refund Accepted";
  } else if (isProductReturned === true && refundStatus === "Processing") {
    orderStatus = "Refund Processing";
  } else {
    orderStatus = "Refund Processing";
  }

  const orderId = req.params.id;
  const shopId = req.shop.id;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return next(createError(400, "Invalid order ID format."));
  }

  if (!mongoose.Types.ObjectId.isValid(shopId)) {
    return next(createError(400, "Invalid shop ID format."));
  }

  if (!mongoose.Types.ObjectId.isValid(refundRequestIdLinked)) {
    return next(createError(400, "Invalid refund request ID format."));
  }

  if (!mongoose.Types.ObjectId.isValid(processedBy)) {
    return next(createError(400, "Invalid processed by ID format."));
  }

  if (processedBy !== shopId) {
    return next(
      createError(403, "Unauthorized: You cannot process this refund.")
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(orderId).session(session);
    if (!order) {
      await session.abortTransaction();
      return next(createError(404, "Order not found."));
    }

    const shop = await Shop.findById(shopId).session(session);
    if (!shop) {
      await session.abortTransaction();
      return next(createError(404, "Shop not found."));
    }

    const shopMismatch = order.orderedItems.some(
      (item) => item.shop.toString() !== shopId
    );
    if (shopMismatch) {
      await session.abortTransaction();
      return next(
        createError(
          403,
          "Unauthorized: You cannot process refunds for this order."
        )
      );
    }

    //
    const validOrderStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (validOrderStatuses.includes(order.orderStatus)) {
      await session.abortTransaction();
      return next(
        createError(
          400,
          `We're sorry, but an order with the status "${order.orderStatus}" is not eligible to accept a refund. Refunds can only be processed for orders with a "Refund Accepted" status. Please contact our support team if you have any questions or need further assistance.`
        )
      );
    }

    // Ensure the requested refund exists in the refundRequestInfo array
    const existingRefund = order.refundRequestInfo.find(
      (refund) => String(refund.refundRequestId) === refundRequestIdLinked
    );
    if (!existingRefund) {
      await session.abortTransaction();
      return next(createError(400, "Refund request not found!"));
    }

    // Ensure the requested refund doses not exists in the returnedItems array
    const existingReturnedRefund = order.returnedItems.find(
      (refund) => String(refund.refundRequestIdLinked) === refundRequestIdLinked
    );

    if (existingReturnedRefund) {
      await session.abortTransaction();
      return next(createError(400, "Refund request is processing!"));
    }

    // Ensure refund amount is valid
    if (refundAmount <= 0 || refundAmount > order.payment.amountPaid) {
      await session.abortTransaction();
      return next(
        createError(400, "Refund amount is invalid or exceeds paid amount.")
      );
    }

    order.orderStatus = orderStatus;

    // If the orderStatus is returned, the condition is new and refundStatus is Accepted, approve refund to the user and update product variant stock"
    if (
      (condition === "New" && refundStatus === "Accepted",
      isProductReturned === true)
    ) {
      // Update returnedItems array with the refund details
      order.returnedItems.push({
        refundRequestIdLinked,
        isProductReturned,
        returnedDate,
        condition,
        comments,
        refundAmount,
        processedDate,
        refundStatus,
        processedBy,
        returnedId: new mongoose.Types.ObjectId(),
      });

      // Update shop refund info array
      shop.shopRefundInfo.push({
        refundDate: new Date(),
        refundAmount: refundAmount,
      });

      // Update shop net income
      if (shop.netShopIncome < refundAmount) {
        await session.abortTransaction();
        return next(
          createError(400, "Insufficient balance in shop account for refund.")
        );
      }

      shop.netShopIncome = (shop.netShopIncome - refundAmount).toFixed(2);
      await shop.save({ session });

      // Function to restore stock
      const restoreStock = async (productId, variantColor, size, quantity) => {
        const product = await Product.findById(productId).session(session);
        if (!product) return;

        const variant = product.variants.find(
          (v) => v.productColor === variantColor
        );
        if (!variant) return;

        const sizeEntry = variant.productSizes.find((s) => s.size === size);
        if (!sizeEntry) return;

        sizeEntry.stock += quantity;
        product.soldOut = Math.max(0, product.soldOut - quantity);

        await product.save({ session, validateBeforeSave: false });
      };

      // Restore stock if fully refunded
      if (orderStatus === "Refund Accepted") {
        await Promise.all(
          order.orderedItems.map((item) =>
            restoreStock(
              item.product._id,
              item.productColor,
              item.size,
              item.quantity
            )
          )
        );
      }

      // Update the shop's SoldProducts array by removing the product ID from soldProducts
      // const productIdsToRemove = order.orderedItems.map(
      //   (item) => item.product._id
      // );

      // shop.soldProducts = shop.soldProducts.filter(
      //   (productId) => !productIdsToRemove.includes(productId.toString())
      // );
    }

    order.statusHistory.push({
      status: orderStatus,
      changedAt: new Date(),
      message: `Your order status changed to '${orderStatus}' on ${new Date().toLocaleString()}.`,
    });

    // Save order update
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Order refund processed successfully.",
    });
  } catch (error) {
    console.error("Error processing refund:", error);
    await session.abortTransaction();
    session.endSession();
    next(createError(500, "Database error: Unable to process refund."));
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

    const user = await User.findById(userId)
      .populate({
        path: "myOrders",
        model: "Order",
        populate: {
          path: "orderedItems.shop",
          model: "Shop",
          select: "name",
        },
      })
      .lean();

    console.log(user);

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

    // Validate sellerId
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return next(createError(400, "Invalid seller ID format"));
    }

    const shop = await Shop.findById(sellerId).select("_id");

    if (!shop) {
      return next(createError(404, "Seller not found"));
    }

    // Fetch orders for the shop
    const orders = await Order.find({ "orderedItems.shop": shop._id })
      .populate("orderedItems.product", "title price productImage")
      .populate("orderedItems.category", "categoryName")
      .populate("orderedItems.subcategory", "subcategoryName")
      .populate("orderedItems.brand", "brandName")
      .populate("orderedItems.supplier", "supplierName")
      .populate("payment.createdBy", "username email")
      .populate("payment.updatedBy", "username email")
      .populate("customer", "username email")
      .populate({
        path: "refundRequestInfo.product",
        model: "Product",
        select: "title discountPrice productImage",
      })
      .populate({
        path: "returnedItems.refundRequestIdLinked",
        model: "Order",
        select: "refundRequestInfo",
        populate: {
          path: "refundRequestInfo.product",
          model: "Product",
          select: "title discountPrice productImage",
        },
      })
      .select(
        "orderedItems orderStatus shippingAddress subtotal grandTotal payment createdAt tracking statusHistory refundRequestInfo returnedItems"
      )
      .sort({ createdAt: -1 })
      .lean();

    // Aggregation for Monthly Order Count, Total Items Ordered & Net Income
    const monthlyOrders = await Order.aggregate([
      // Filter orders by shop ID
      {
        $match: {
          "orderedItems.shop": new mongoose.Types.ObjectId(sellerId),
        },
      },

      // Group orders by year and month using $year and $month aggregation operators from createdAt field
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          orderCount: { $sum: 1 },
          totalItemsOrdered: { $sum: "$itemsQty" },
          grandTotal: { $sum: "$grandTotal" },
        },
      },

      // Sorts results in ascending order by year and month.
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },

      // Project the fields to display
      {
        $project: {
          _id: 0, // Remove _id
          year: "$_id.year",
          month: "$_id.month",
          orderCount: 1,
          totalItemsOrdered: 1,
          grandTotal: 1,
        },
      },
    ]);

    // Ensure data is structured correctly before sending response
    const formattedMonthlyOrders = (monthlyOrders || []).map((item) => ({
      year: item.year || null,
      month: item.month || null,
      orderCount: item.orderCount || 0,
      totalItemsOrdered: item.totalItemsOrdered || 0,
      grandTotal: item.grandTotal || 0,
    }));

    res.status(200).json({
      success: true,
      orders,
      monthlyOrderCount: formattedMonthlyOrders,
    });
  } catch (error) {
    console.error("Error fetching shop orders:", error);
    next(createError(500, "Orders could not be accessed! Please try again!"));
  }
};

//=========================================================================
// Get all refunded orders for a seller and other details
//=========================================================================
export const allShopRefundedOrders = async (req, res, next) => {
  try {
    const sellerId = req.shop.id;

    // Validate sellerId
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return next(createError(400, "Invalid seller ID format"));
    }

    const shop = await Shop.findById(sellerId).select("_id");

    if (!shop) {
      return next(createError(404, "Seller not found"));
    }

    // Fetch refunded orders for the shop
    const refundedOrders = await Order.find({
      "orderedItems.shop": shop._id,
      "payment.paymentStatus": "refunded",
    })
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
      )
      .sort({ createdAt: -1 })
      .lean();

    // Aggregation for Monthly Order Refunded Count, Total Items Refunded, and Total Refund Amount
    const monthlyRefundedOrders = await Order.aggregate([
      // Filter orders by shop ID and payment status
      {
        $match: {
          "orderedItems.shop": new mongoose.Types.ObjectId(sellerId),
          "payment.paymentStatus": "refunded",
        },
      },

      // Group orders by year and month using $year and $month aggregation operators from createdAt field
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          orderCount: { $sum: 1 },
          totalItemsRefunded: { $sum: "$itemsQty" },
          totalRefundAmount: { $sum: "$grandTotal" },
        },
      },

      // Sorts results in ascending order by year and month.
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },

      // Project the fields to display
      {
        $project: {
          _id: 0, // Remove _id
          year: "$_id.year",
          month: "$_id.month",
          orderCount: 1,
          totalItemsRefunded: 1,
          totalRefundAmount: 1,
        },
      },
    ]);

    // Ensure data is structured correctly before sending response
    const formattedMonthlyRefundedOrders = (monthlyRefundedOrders || []).map(
      (item) => ({
        year: item.year || null,
        month: item.month || null,
        orderCount: item.orderCount || 0,
        totalItemsRefunded: item.totalItemsRefunded || 0,
        totalRefundAmount: item.totalRefundAmount || 0,
      })
    );

    res.status(200).json({
      success: true,
      refundedOrders,
      monthlyRefundedOrderCount: formattedMonthlyRefundedOrders,
    });
  } catch (error) {
    console.error("Error fetching refunded orders:", error);
    next(
      createError(
        500,
        "Refunded orders could not be accessed! Please try again!"
      )
    );
  }
};

//=========================================================================
// Delete an order for a shop
//=========================================================================
export const deleteOrder = async (req, res, next) => {
  const { id: orderId } = req.params;
  const shopId = req.shop?.id;

  if (!shopId) {
    return next(createError(401, "Unauthorized: To delete an order"));
  }

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return next(createError(400, "Invalid order ID format"));
  }

  if (!mongoose.Types.ObjectId.isValid(shopId)) {
    return next(createError(400, "Invalid shop ID format"));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const shop = await Shop.findById(shopId).session(session);

    if (!shop) {
      await session.abortTransaction();
      session.endSession();
      return next(createError(404, "Shop not found"));
    }

    const order = await Order.findById(orderId).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return next(createError(404, "Order not found"));
    }
    if (!shop.orders.includes(orderId))
      throw createError(403, "Unauthorized order deletion");

    // Extract relevant details
    const productIdsToRemove = order.orderedItems.map(
      (item) => item.product._id
    );

    const totalOrderIncome = order.payment.amountPaid;

    // Remove order from shop records

    await Shop.updateOne(
      { _id: shopId },
      {
        $pull: {
          orders: { _id: orderId },
          soldProducts: { _id: { $in: productIdsToRemove } },
          shopIncomeInfo: {
            _id: { $in: shop.shopIncomeInfo.map((info) => info._id) },
          },
          shopRefundInfo: {
            _id: { $in: shop.shopRefundInfo.map((info) => info._id) },
          },
        },
        $inc: { netShopIncome: -totalOrderIncome },
      },
      { session }
    );

    // Remove order from user's myOrders
    await User.updateOne(
      { myOrders: orderId },
      { $pull: { myOrders: orderId } },
      { session }
    );

    // Delete order
    await Order.findByIdAndDelete(orderId).session(session);

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Order deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    await session.abortTransaction();
    session.endSession();
    next(createError(500, "Order could not be deleted! Please try again!"));
  }
};

//=========================================================================
// Delete all orders for a shop
//=========================================================================
export const deleteOrders = async (req, res, next) => {
  const shopId = req.shop?.id;

  if (!mongoose.Types.ObjectId.isValid(shopId)) {
    return next(createError(400, "Invalid shop ID format"));
  }

  // Start transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Find the shop and validate
    const shop = await Shop.findById(shopId).session(session);
    if (!shop) {
      await session.abortTransaction();
      session.endSession();
      return next(createError(404, "Shop not found"));
    }

    if (shop.orders.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return next(createError(400, "No orders found to delete for this shop"));
    }

    // Remove all orders-related data
    await Shop.findByIdAndUpdate(
      shopId,
      {
        $unset: {
          orders: [],
          soldProducts: [],
          transactions: [],
          shopIncomeInfo: [],
          shopRefundInfo: [],
          netShopIncome: 0,
        },
      },
      { session }
    );

    // Remove all customer orders from this particular shop
    await User.updateMany(
      { myOrders: { $in: shop.orders } },
      { $pull: { myOrders: { $in: shop.orders } } },
      { session }
    );

    // Delete all orders associated with the shop
    await Order.deleteMany({ "orderedItems.shop": shopId }).session(session);

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "All orders deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting orders:", error);

    if (session) {
      await session.abortTransaction();
      session.endSession();
    }

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
