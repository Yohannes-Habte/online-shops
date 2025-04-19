import RefundRequest from "../models/refundRequestModel.js";
import createError from "http-errors";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Shop from "../models/shopModel.js";

//=========================================================================
// Helper functions for order calculations and status history updates
//=========================================================================

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

// ==========================================================================
// Create a new refund request
// ==========================================================================
export const createRefundRequest = async (req, res, next) => {
  const {
    order,
    product,
    productColor,
    productSize,
    productQuantity,
    requestedDate,
    requestRefundReason,
    otherReason,
    currency,
    method,
    bankDetails,
    email,
    chequeRecipient,
    cryptoDetails,
    notes,
    processedBy,
  } = req.body;

  const authShopId = req.shop.id;

  // Validate the shop ID
  if (!mongoose.isValidObjectId(order)) {
    return next(createError(400, "Invalid order ID provided."));
  }

  if (!mongoose.isValidObjectId(product)) {
    return next(createError(400, "Invalid product ID provided."));
  }

  if (!mongoose.isValidObjectId(authShopId)) {
    return next(createError(400, "Invalid shop ID provided."));
  }

  if (!mongoose.isValidObjectId(processedBy)) {
    return next(createError(400, "Invalid processedBy ID provided."));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find shop
    const foundShop = await Shop.findById(authShopId).session(session);
    if (!foundShop) {
      await session.abortTransaction();
      return next(createError(404, "Shop not found!"));
    }

    // Find the order
    const orderDetails = await Order.findById(order).session(session);
    if (!orderDetails) {
      await session.abortTransaction();
      return next(createError(404, "Order not found"));
    }

    // Check if the order belongs to the authenticated shop
    if (
      orderDetails.orderedItems[0].shop.toString() !== authShopId.toString()
    ) {
      await session.abortTransaction();
      return next(
        createError(
          403,
          "You are not authorized to create a refund request for this order"
        )
      );
    }

    // Order status must be "Delivered" to create a refund request
    if (orderDetails.orderStatus !== "Delivered") {
      return next(
        createError(
          400,
          "Refund request can only be created for delivered orders"
        )
      );
    }

    // If order status is "Returned", "Refund Processing", "Refund Rejected", "Refund Accepted", or  "Refunded", you cannot create a refund request

    const restrictedStatuses = [
      "Returned",
      "Refund Processing",
      "Refund Rejected",
      "Refund Accepted",
      "Refunded",
    ];

    const orderStatus = orderDetails.orderStatus;

    if (restrictedStatuses.includes(orderStatus)) {
      await session.abortTransaction();
      return next(
        createError(
          400,
          "Refund request cannot be created for this order status"
        )
      );
    }

    // Find the product
    const existProduct = await Product.findById(product).session(session);
    if (!existProduct) {
      await session.abortTransaction();
      return next(createError(404, "Product not found!"));
    }

    const productPrice = existProduct.discountPrice;

    // Find the ordered product in the order
    const orderedProduct = orderDetails.orderedItems.find(
      (item) =>
        String(item.product._id) === String(product) &&
        item.productColor.trim().toLowerCase() ===
          productColor.trim().toLowerCase() &&
        String(item.size).toLowerCase() === String(productSize).toLowerCase() &&
        Number(item.quantity) === Number(productQuantity)
    );

    if (!orderedProduct) {
      await session.abortTransaction();
      return next(createError(400, "Product not found in the order!"));
    }

    // Prevent duplicate refund requests. refundRequests is an array of refund requests in the order
    // Check if a refund request for this product already exists in the order
    const existingRefundRequestInRefundRequests =
      orderDetails.refundRequests.find(
        (refundRequest) =>
          String(refundRequest.product) === String(product) &&
          String(refundRequest.productColor).toLowerCase() ===
            productColor.trim().toLowerCase() &&
          String(refundRequest.productSize).toLowerCase() ===
            productSize.trim().toLowerCase() &&
          Number(refundRequest.productQuantity) === Number(productQuantity)
      );

    // If a refund request for this product already exists, prevent a duplicate request
    if (existingRefundRequestInRefundRequests) {
      await session.abortTransaction();
      return next(createError(400, "Refund already requested for this item!"));
    }

    if (Number(productPrice) !== Number(orderedProduct.price)) {
      await session.abortTransaction();
      return next(
        createError(400, "Product price mismatch! Please contact support.")
      );
    }

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
    const subTotalProductPrice = productPrice * productQuantity;

    const taxAmount = calculateTaxAmount(subTotalProductPrice);
    const shippingFeeAmount = calculateShippingFee(subTotalProductPrice);
    const discountAmount = calculateDiscount(subTotalProductPrice);

    const netRefundAmount = calculateGrandTotal(
      subTotalProductPrice,
      taxAmount,
      shippingFeeAmount,
      discountAmount
    );

    const existingRefundRequest = await RefundRequest.findOne({
      order,
      product,
      productColor,
      productSize,
      productQuantity,
      requestRefundReason,
      currency,
      method,
    }).session(session);

    if (existingRefundRequest) {
      return next(
        createError(400, "Refund request already exists for this product")
      );
    }

    const generatedRefundRequestId = uuidv4();
    const requestedDateObj = {
      refundRequestId: generatedRefundRequestId,
      order,
      product,
      productColor,
      productSize,
      productQuantity,
      requestedRefundAmount: netRefundAmount,
      currency,
      method,
      requestedDate,
      requestRefundReason,
      notes,
      processedBy,
    };

    if (requestRefundReason === "Other") {
      requestedDateObj.otherReason = otherReason;
    }

    if (method === "Bank Transfer") {
      requestedDateObj.bankDetails = bankDetails;
    }
    if (method === "PayPal" || method === "Stripe") {
      requestedDateObj.email = email;
    }
    if (method === "Cheque") {
      requestedDateObj.chequeRecipient = chequeRecipient;
    }

    if (method === "Crypto") {
      requestedDateObj.cryptoDetails = cryptoDetails;
    }

    const newRefundRequest = new RefundRequest(requestedDateObj);
    await newRefundRequest.save({ session });

    // Update order
    orderDetails.refundRequests.push(newRefundRequest._id);

    orderDetails.orderStatus = "Refund Requested";

    orderDetails.statusHistory.push({
      status: "Refund Requested",
      changedAt: requestedDate,
      message: `Your order, placed on ${new Date().toLocaleString()}, for the product ${
        product.title
      } with color ${productColor}, size ${productSize}, and quantity ${productQuantity}, has been successfully marked as Refund Requested. We are processing your request and will notify you once it is completed.`,
    });

    await orderDetails.save({ session });

    // Update shop
    foundShop.refundRequests.push(newRefundRequest._id);
    await foundShop.save({ session });

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Refund request created successfully",
      refundRequest: newRefundRequest,
    });
  } catch (error) {
    console.error("Error creating refund request:", error);
    await session.abortTransaction();
    return next(createError(500, "Failed to create refund request"));
  } finally {
    session.endSession();
  }
};
