import Withdraw from "../models/withdrawModel.js";
import Shop from "../models/shopModel.js";
import createError from "http-errors";
import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import { v4 as uuidv4 } from "uuid";

//====================================================================
// Create withdraw money request only for seller
//====================================================================
export const createWithdrawalRequest = async (req, res, next) => {
  const {
    order,
    withdrawalPurpose,
    supplier,
    refundRequest,
    returnRequest,
    amount,
    currency,
    method,
    notes,
    processedDate,
    processedBy,
  } = req.body;

  const shopId = req.shop.id;

  if (!shopId || !mongoose.Types.ObjectId.isValid(shopId))
    return next(createError(400, "Invalid or missing shop ID!"));

  if (!mongoose.Types.ObjectId.isValid(processedBy))
    return next(createError(400, "Invalid shop ID!"));

  if (shopId !== processedBy)
    return next(createError(400, "Shop ID does not match!"));

  if (
    withdrawalPurpose === "Customer Reimbursement" &&
    !mongoose.Types.ObjectId.isValid(refundRequest)
  )
    return next(createError(400, "Invalid refund ID!"));

  if (
    withdrawalPurpose === "Customer Reimbursement" &&
    !mongoose.Types.ObjectId.isValid(returnRequest)
  ) {
    return next(createError(400, "Invalid return ID!"));
  }

  if (order && !mongoose.Types.ObjectId.isValid(order))
    return next(createError(400, "Invalid order ID!"));

  if (!mongoose.Types.ObjectId.isValid(processedBy))
    return next(createError(400, "Invalid processedBy ID!"));

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const code = `${order}-${withdrawalPurpose}-${amount}-${currency}-${method}}`;

    const withdrawIdv4 = uuidv4();

    const existingWithdraw = await Withdraw.findOne({
      withdrawalCode: code,
    });

    if (existingWithdraw) {
      await session.abortTransaction();
      session.endSession();
      return next(createError(400, "Withdraw request already exists!"));
    }

    const withdrawalData = {
      withdrawalCode: code,
      withdrawId: withdrawIdv4,
      withdrawalPurpose,
      amount,
      currency,
      method,
      notes,
      processedDate,
      processedBy,
    };

    if (withdrawalPurpose === "Product Procurement")
      withdrawalData.supplier = supplier;
    if (withdrawalPurpose === "Customer Reimbursement") {
      withdrawalData.refundRequest = refundRequest;
      withdrawalData.returnRequest = returnRequest;
    }

    const newWithdrawal = new Withdraw(withdrawalData);
    await newWithdrawal.save({ session });

    const orderDetails = await Order.findById(order).session(session);
    if (!orderDetails) {
      await session.abortTransaction();
      session.endSession();
      return next(createError(404, "Order not found!"));
    }

    const shopDetails = await Shop.findById(shopId).session(session);
    if (!shopDetails) {
      await session.abortTransaction();
      session.endSession();
      return next(createError(404, "Shop not found!"));
    }

    // Update order with withdrawal details
    orderDetails.withdrawalRequests.push(newWithdrawal._id);
    orderDetails.orderStatus = "Refunded";
    orderDetails.payment.paymentStatus = "refunded";
    orderDetails.payment.refunds.push({
      refundId: uuidv4(),
      refundRequestId: refundRequest,
      returnedId: returnRequest,
      withdrawalId: newWithdrawal._id,
      transactionId: orderDetails.transaction,
      refundAmount: amount,
      currency: currency,
      refundMethod: method,
      refundDate: processedDate,
      refundedBy: processedBy,
    });

    await orderDetails.save({ session });

    // Update shop with withdrawal details
    shopDetails.withdrawals.push(newWithdrawal._id);
    await shopDetails.save({ session });

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      newWithdrawal,
    });
  } catch (error) {
    console.error("Error creating withdrawal request:", error);
    await session.abortTransaction();
    session.endSession();
    next(createError(500, "Failed to create withdrawal request!"));
  }
};
