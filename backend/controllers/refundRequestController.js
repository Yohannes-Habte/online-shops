import RefundRequest from "../models/refundRequestModel.js";
import createError from "http-errors";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Shop from "../models/shopModel.js";
import {
  calculateDiscount,
  calculateGrandTotal,
  calculateTaxAmount,
} from "../utils/orderHelperFunctions.js";
import User from "../models/userModel.js";
import { calculatedShippingPrice } from "../utils/shipmentPricing.js";

// ==========================================================================
// Create a new refund request by a user
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

  const authUserId = req.user.id;

  // Validate the shop ID
  if (!mongoose.isValidObjectId(order)) {
    return next(createError(400, "Invalid order ID provided."));
  }

  if (!mongoose.isValidObjectId(product)) {
    return next(createError(400, "Invalid product ID provided."));
  }

  if (!mongoose.isValidObjectId(authUserId)) {
    return next(createError(400, "Invalid user ID."));
  }

  if (!mongoose.isValidObjectId(processedBy)) {
    return next(createError(400, "Invalid processedBy ID provided."));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the authenticated user
    const authUser = await User.findById(authUserId).session(session);
    if (!authUser) {
      await session.abortTransaction();
      return next(
        createError(
          403,
          "Forbidden: Unauthorized to create a refund request for this order!"
        )
      );
    }

    // Find the order
    const orderDetails = await Order.findById(order).session(session);
    if (!orderDetails) {
      await session.abortTransaction();
      return next(createError(404, "Order not found"));
    }

    // Find shop
    const shopID = orderDetails.orderedItems[0].shop._id;
    const foundShop = await Shop.findById(shopID).session(session);
    if (!foundShop) {
      await session.abortTransaction();
      return next(createError(404, "Shop not found!"));
    }

    const currentOrderStatus = [
      "Pending",
      "Processing",
      "Shipped",
      "Cancelled",
      "Refund Requested",
      "Awaiting Item Return",
      "Returned",
      "Refund Processing",
      "Refund Rejected",
      "Refund Accepted",
      "Refunded",
    ];

    if (currentOrderStatus.includes(orderDetails.orderStatus)) {
      await session.abortTransaction();
      return next(
        createError(
          400,
          `Refund request not allowed for orders with status ${orderDetails.orderStatus}`
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
    const isRefundRequestExist = orderDetails.refundRequests.find(
      (refundRequest) =>
        String(refundRequest.order) === String(order) &&
        String(refundRequest.product) === String(product) &&
        String(refundRequest.productColor).toLowerCase() ===
          productColor.trim().toLowerCase() &&
        String(refundRequest.productSize).toLowerCase() ===
          productSize.trim().toLowerCase() &&
        Number(refundRequest.productQuantity) === Number(productQuantity)
    );

    // If a refund request for this product already exists, prevent a duplicate request
    if (isRefundRequestExist) {
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
    const serviceType = orderDetails.shippingAddress.service;
    const productWeight = orderedProduct.quantity;

    const taxAmount = calculateTaxAmount(subTotalProductPrice);
    const shippingFeeAmount = calculatedShippingPrice(
      subTotalProductPrice,
      productWeight,
      serviceType
    );
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

    const updateOrderStatus = "Refund Requested";

    orderDetails.orderStatus = updateOrderStatus;

    orderDetails.statusHistory.push({
      status: updateOrderStatus,
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
