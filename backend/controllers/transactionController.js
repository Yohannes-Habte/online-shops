import Transaction from "../models/transactionModel.js";
import createError from "http-errors";
import mongoose, { Mongoose } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Order from "../models/orderModel.js";
import Shop from "../models/shopModel.js";
import RefundRequest from "../models/refundRequestModel.js";
import ReturnRequest from "../models/ReturnRequestModel.js";
import Withdrawal from "../models/withdrawModel.js";
import { addToStatusHistory } from "../utils/orderHelperFunctions.js";

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

    if (transactionStatus === "Cancelled") {
      transactionObject.cancelledReason = cancelledReason;
    }

    const newTransaction = new Transaction(transactionObject);

    await newTransaction.save({ session });

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

    if (transactionType === "Payout" && order) {
      foundOrder.transaction = newTransaction._id;
      await foundOrder.save({ session });
    }

    if (transactionType === "Payout") {
      shopDetails.transactions.push(newTransaction._id);
      if (transactionStatus === "Completed") {
        shopDetails.netShopIncome += amount;
      }
    } 


    if (
      transactionType === "Refund" &&
      refundRequest &&
      returnedItem &&
      order &&
      withdrawal &&
      transactionStatus == "Completed"
    ) {
      const foundRefundRequest = await RefundRequest.findById(
        refundRequest
      ).session(session);
      if (!foundRefundRequest) {
        await session.abortTransaction();
        return next(createError(404, "Refund request not found"));
      }

      const foundReturnedItem = await ReturnRequest.findById(
        returnedItem
      ).session(session);
      if (!foundReturnedItem) {
        await session.abortTransaction();
        return next(createError(404, "Returned item not found"));
      }

      const foundWithdrawal = await Withdrawal.findById(withdrawal).session(
        session
      );
      if (!foundWithdrawal) {
        await session.abortTransaction();
        return next(createError(404, "Withdrawal not found"));
      }

      const updatedOrderStatus = "Refunded";
      foundOrder.orderStatus = updatedOrderStatus;
      addToStatusHistory(orderDetails, updatedOrderStatus);
      foundOrder.payment.paymentStatus = "refunded";
      foundOrder.payment.refunds.push({
        refundId: uuidv4(),
        refundRequestId: foundRefundRequest._id,
        returnedId: foundReturnedItem._id,
        withdrawalId: foundWithdrawal._id,
        transactionId: newTransaction._id,
        refundAmount: amount,
        currency: currency,
        refundMethod: method,
        refundDate: processedDate,
        refundedBy: processedBy,
      });
      await foundOrder.save({ session });
    }

  

   

    if (transactionType === "Refund") {
      shopDetails.transactions.push(newTransaction._id);

      if (transactionStatus === "Completed") {
        shopDetails.netShopIncome -= amount;
      }
    }

    if (transactionType === "Withdrawal") {
      shopDetails.transactions.push(newTransaction._id);

      if (transactionStatus === "Completed") {
        shopDetails.netShopIncome -= amount;
      }
    }

    if (transactionType === "Adjustment") {
      shopDetails.transactions.push(newTransaction._id);

      if (transactionStatus === "Completed") {
        shopDetails.netShopIncome += amount;
      }
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
