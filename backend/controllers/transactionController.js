import Transaction from "../models/transactionModel.js";
import createError from "http-errors";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Order from "../models/orderModel.js";

const calculateShopCommission = (grandTotal) =>
  parseFloat((grandTotal * 0.01).toFixed(2));

export const createTransaction = async (req, res, next) => {
  const {
    shop,
    transactionType,
    order,
    platformFees,
    refundRequest,
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

  // Validate the shop ID
  if (!mongoose.isValidObjectId(authShopId)) {
    return next(createError(400, "Invalid shop ID provided."));
  }

  if (!mongoose.isValidObjectId(shop)) {
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

  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const generatedTransactionId = uuidv4();

    const existingTransaction = await Transaction.findOne({
      shop,
      transactionType,
      order: transactionType === "Payout" ? order : undefined,
      refundRequest: transactionType === "Refund" ? refundRequest : undefined,
      withdrawal: ["Refund", "Withdrawal"].includes(transactionType)
        ? withdrawal
        : undefined,
      adjustmentReason:
        transactionType === "Adjustment" ? adjustmentReason : undefined,
      amount,
      currency,
      method,
      paymentProvider,
      processedBy,
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

    if (transactionType === "Payout") {
      // Calculate commission
      const orderDetails = await Order.findById(order).session(session);
      if (!orderDetails) {
        await session.abortTransaction();
        return next(createError(404, "Order not found"));
      }
      const grandTotal = orderDetails.grandTotal;
      const commission = calculateShopCommission(grandTotal);

      if (!commission !== platformFees) {
        await session.abortTransaction();
        return next(
          createError(400, "Platform fees do not match the commission")
        );
      }

      transactionObject.order = order;
      transactionObject.platformFees = commission;
    } else if (transactionType === "Refund") {
      transactionObject.refundRequest = refundRequest;
      transactionObject.withdrawal = withdrawal;
    } else if (transactionType === "Withdrawal") {
      transactionObject.withdrawal = withdrawal;
    } else if (transactionType === "Adjustment") {
      transactionObject.adjustmentReason = adjustmentReason;
      transactionObject.adjustmentNotes = adjustmentNotes;
    }

    if (transactionStatus === "Cancelled") {
      transactionObject.cancelledReason = cancelledReason;
    }

    const newTransaction = new Transaction(transactionObject);

    await newTransaction.save({ session });

    if (transactionType === "Payout" && order) {
      const foundOrder = await Order.findById(order).session(session);
      if (!foundOrder) {
        await session.abortTransaction();
        return next(createError(404, "Order not found"));
      }
      foundOrder.transaction = newTransaction._id;
      await foundOrder.save({ session });
    }

    // Commit transaction if everything is successful
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      transaction: newTransaction,
      message: "Transaction created successfully",
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    await session.abortTransaction();
    return next(createError(500, "Something went wrong"));
  } finally {
    // End the session regardless of success or failure
    session.endSession();
  }
};
