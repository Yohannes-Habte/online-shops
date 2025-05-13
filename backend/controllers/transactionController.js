import Transaction from "../models/transactionModel.js";
import createError from "http-errors";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Order from "../models/orderModel.js";
import Shop from "../models/shopModel.js";
import RefundRequest from "../models/refundRequestModel.js";
import ReturnRequest from "../models/ReturnRequestModel.js";
import Withdrawal from "../models/withdrawModel.js";

export const createTransaction = async (req, res, next) => {
  const {
    shop,
    transactionType,
    order,
    platformFees,
    refundRequest,
    returnedItem,
    withdrawal,
    adjustmentReason,
    adjustmentNotes,
    amount,
    currency,
    method,
    paymentProvider,
    transactionStatus,
    cancelledReason,
    processedDate,
    processedBy,
  } = req.body;

  const authShopId = req.shop.id;

  if (!authShopId) {
    return next(
      createError(401, "You are not authorized to create a transaction.")
    );
  }

  if (
    !mongoose.isValidObjectId(authShopId) ||
    !mongoose.isValidObjectId(shop)
  ) {
    return next(createError(400, "Invalid shop ID provided."));
  }

  if (authShopId !== shop) {
    return next(
      createError(
        403,
        "You are not authorized to create a transaction for this shop."
      )
    );
  }

  if (!mongoose.isValidObjectId(order) && transactionType === "Payout") {
    return next(createError(400, "Invalid order ID provided."));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const generatedTransactionId = `${shop}-${order}-${transactionType}`;

    const existingTransaction = await Transaction.findOne({
      transactionId: generatedTransactionId,
    }).session(session);
    if (existingTransaction) {
      await session.abortTransaction();
      return next(createError(400, "Transaction with this ID already exists"));
    }

    const transactionObject = {
      transactionId: generatedTransactionId,
      shop,
      transactionType,
      amount,
      currency,
      method,
      paymentProvider,
      transactionStatus,
      processedDate,
      processedBy,
    };

    // Add additional details based on the transaction type
    if (transactionType === "Payout") {
      transactionObject.order = order;
      transactionObject.platformFees = platformFees;
    } else if (transactionType === "Refund") {
      transactionObject.refundRequest = refundRequest;
      transactionObject.returnedItem = returnedItem;
      transactionObject.withdrawal = withdrawal;
    } else if (transactionType === "Withdrawal") {
      transactionObject.withdrawal = withdrawal;
    } else if (transactionType === "Adjustment") {
      transactionObject.adjustmentReason = adjustmentReason;
      transactionObject.adjustmentNotes = adjustmentNotes;
    }

    // Add cancellation reason if applicable
    if (transactionStatus === "Cancelled") {
      transactionObject.cancelledReason = cancelledReason;
    }

    const shopDetails = await Shop.findById(authShopId).session(session);
    if (!shopDetails) {
      await session.abortTransaction();
      return next(createError(404, "Shop not found"));
    }

    const foundOrder = await Order.findById(order).session(session);
    if (!foundOrder) {
      await session.abortTransaction();
      return next(createError(404, "Order not found"));
    }

    const currentOrderStatus = [
      "Pending",
      "Processing",
      "Delivered",
      "Cancelled",
      "Refund Requested",
      "Awaiting Item Return",
      "Returned",
      "Refund Processing",
      "Refund Rejected",
      "Refund Accepted",
      "Refunded",
    ];

    if (currentOrderStatus.includes(foundOrder.orderStatus)) {
      await session.abortTransaction();
      return next(
        createError(
          400,
          `Transaction not allowed for orders with status ${foundOrder.orderStatus}`
        )
      );
    }

    // Create the transaction
    const newTransaction = new Transaction(transactionObject);
    await newTransaction.save({ session });

    if (transactionType === "Payout") {
      foundOrder.transaction = newTransaction._id;
      await foundOrder.save({ session });
    }

    const transactionEnum = ["Payout", "Refund", "Withdrawal", "Adjustment"];
    if (transactionEnum.includes(transactionType)) {
      shopDetails.transactions.push(newTransaction._id);

      if (transactionStatus === "Completed") {
        const sign =
          transactionType === "Withdrawal" || transactionType === "Refund"
            ? -1
            : transactionType === "Adjustment"
            ? ["Order Reconciliation", "Promotional Credit Issuance"].includes(
                adjustmentReason
              )
              ? -1
              : 1
            : 1;

        shopDetails.netShopIncome = shopDetails.netShopIncome + sign * amount;
        foundOrder.orderStatus = "Delivered";
        foundOrder.payment.paymentStatus = "completed";
      } else if (transactionStatus === "Cancelled") {
        foundOrder.orderStatus = "Cancelled";
        foundOrder.cancellationReason.reason =
          "Cancelled by Admin due to transaction failure";
        foundOrder.payment.paymentStatus = "cancelled";
      } else if (transactionStatus === "Processing") {
        foundOrder.payment.paymentStatus = "pending";
      }

      await shopDetails.save({ session });
      await foundOrder.save({ session });
    }

    // Handle Refund-related logic based on transaction status
    if (
      transactionType === "Refund" &&
      refundRequest &&
      returnedItem &&
      order &&
      withdrawal
    ) {
      if (transactionStatus === "Completed") {
        const [foundRefundRequest, foundReturnedItem, foundWithdrawal] =
          await Promise.all([
            RefundRequest.findById(refundRequest).session(session),
            ReturnRequest.findById(returnedItem).session(session),
            Withdrawal.findById(withdrawal).session(session),
          ]);

        if (!foundRefundRequest) {
          await session.abortTransaction();
          return next(createError(404, "Refund request not found"));
        }

        if (!foundReturnedItem) {
          await session.abortTransaction();
          return next(createError(404, "Returned item not found"));
        }

        if (!foundWithdrawal) {
          await session.abortTransaction();
          return next(createError(404, "Withdrawal not found"));
        }

        foundOrder.orderStatus = "Refunded";
        foundOrder.payment.paymentStatus = "refunded";
        foundOrder.payment.refunds.push({
          refundId: uuidv4(),
          refundRequestId: foundRefundRequest._id,
          returnedId: foundReturnedItem._id,
          withdrawalId: foundWithdrawal._id,
          transactionId: newTransaction._id,
          refundAmount: amount,
          currency,
          refundMethod: method,
          refundDate: processedDate,
          refundedBy: processedBy,
        });

        await foundOrder.save({ session });
      } else if (transactionStatus === "Cancelled") {
        foundOrder.orderStatus = "Refund Rejected";
        foundOrder.payment.paymentStatus = "refunded";
        await foundOrder.save({ session });
      } else if (transactionStatus === "Processing") {
        foundOrder.orderStatus = "Refund Processing";
        foundOrder.payment.paymentStatus = "pending";
        await foundOrder.save({ session });
      }
    }

    // Commit the transaction
    await session.commitTransaction();

    // Send success response
    res.status(201).json({
      success: true,
      transaction: newTransaction,
      message: "Transaction created successfully",
    });
  } catch (error) {
    console.error("Transaction creation failed:", error);
    await session.abortTransaction();
    next(
      createError(error.status || 500, error.message || "Internal Server Error")
    );
  } finally {
    session.endSession();
  }
};
