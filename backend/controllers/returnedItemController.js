import ReturnRequest from "../models/ReturnRequestModel.js";
import RefundRequest from "../models/refundRequestModel.js";
import createError from "http-errors";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Shop from "../models/shopModel.js";
import { addToStatusHistory } from "../utils/orderHelperFunctions.js";

export const createReturnedItem = async (req, res, next) => {
  const {
    isProductReturned,
    condition,
    comments,
    refundAmount,
    processedDate,
    refundStatus,
    rejectedReason,
    processedBy,
    order,
    refundRequest,
    returnedDate,
    product,
  } = req.body;

  const authShopId = req.shop.id;

  // Validate IDs
  const idsToValidate = { order, refundRequest, product, authShopId };
  for (const [key, value] of Object.entries(idsToValidate)) {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return next(createError(400, `Invalid ${key} ID`));
    }
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const returnedItemId = uuidv4();
    let orderStatus;

    // Determine order status based on conditions
    if (isProductReturned) {
      if (refundStatus === "Rejected") {
        orderStatus = "Refund Rejected";
      } else if (refundStatus === "Accepted" && condition === "New") {
        orderStatus = "Refund Accepted";
      } else if (["Used", "Damaged"].includes(condition)) {
        orderStatus = "Refund Rejected";
      }
    }

    // Fetch related documents
    const [shopDetails, orderDetails, refundRequestDetails] = await Promise.all(
      [
        Shop.findById(authShopId).session(session),
        Order.findById(order).session(session),
        RefundRequest.findById(refundRequest).session(session),
      ]
    );

    if (!shopDetails) return next(createError(404, "Shop not found"));
    if (!orderDetails) return next(createError(404, "Order not found"));
    if (!refundRequestDetails)
      return next(createError(404, "Refund Request not found"));

    // Validate ownership
    const shopMismatch = orderDetails.orderedItems.some(
      (item) => item.shop.toString() !== authShopId.toString()
    );
    if (shopMismatch) {
      return next(
        createError(
          403,
          "Unauthorized: You cannot process refunds for this order."
        )
      );
    }

    // Order must be eligible for refund
    const invalidRefundStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    if (invalidRefundStatuses.includes(orderDetails.orderStatus)) {
      return next(
        createError(
          400,
          `Refund not allowed. Current order status: "${orderDetails.orderStatus}".`
        )
      );
    }

    // Refund must exist in order
    const existingRefund = orderDetails.refundRequests.find(
      (r) => String(r._id) === refundRequest
    );
    if (!existingRefund) {
      return next(createError(400, "Refund request not found in order."));
    }

    // Ensure no duplicate returned item for this refund
    const duplicateReturned = orderDetails.returnedItems.some(
      (r) => String(r.refundRequest) === refundRequest
    );
    if (duplicateReturned) {
      return next(createError(400, "Refund request already processed."));
    }

    // Validate refund amount
    if (refundAmount <= 0 || refundAmount > orderDetails.payment.amountPaid) {
      return next(createError(400, "Invalid refund amount."));
    }

    // Check shop balance
    if (shopDetails.netShopIncome < refundAmount) {
      return next(createError(400, "Insufficient shop balance for refund."));
    }

    // Construct ReturnRequest (but don't save yet)
    const returnedItemObject = {
      returnRequestId: returnedItemId,
      order,
      refundRequest,
      isProductReturned,
      returnedDate,
      condition,
      refundStatus,
      refundAmount,
      comments,
      processedDate,
      processedBy,
      ...(refundStatus === "Rejected" && { rejectedReason }),
    };

    const newReturnRequest = new ReturnRequest(returnedItemObject);

    // Update order status
    orderDetails.orderStatus = orderStatus;

    // Check refund status and update accordingly
    if (shopDetails.netShopIncome < refundAmount) {
      await session.abortTransaction();
      return next(
        createError(400, "Insufficient balance in shop account for refund.")
      );
    }

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

    // Update refund request in order and shop
    if (
      isProductReturned &&
      condition === "New" &&
      refundStatus === "Accepted"
    ) {
      orderDetails.returnedItems.push(newReturnRequest._id);
      shopDetails.returnedItems.push(newReturnRequest._id);

      shopDetails.netShopIncome = (
        shopDetails.netShopIncome - refundAmount
      ).toFixed(2);

      // Restore stock if fully refunded
      if (orderStatus === "Refund Accepted") {
        await Promise.all(
          orderDetails.orderedItems.map((item) =>
            restoreStock(
              item.product._id,
              item.productColor,
              item.size,
              item.quantity
            )
          )
        );
      }
    }

    // Update order status history
    addToStatusHistory(orderDetails, orderStatus);
    
    // Persist all updates
    await Promise.all([
      newReturnRequest.save({ session }),
      shopDetails.save({ session }),
      orderDetails.save({ session }),
    ]);

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Returned item created successfully",
      result: newReturnRequest,
    });
  } catch (error) {
    console.error("Error processing refund:", error);
    if (session?.inTransaction()) {
      await session.abortTransaction();
    }
    return next(createError(500, "Internal Server Error"));
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};
