import Withdraw from "../models/withdrawModel.js";
import Shop from "../models/shopModel.js";
import createError from "http-errors";
import sendEmail from "../utils/sendMail.js";
import mongoose from "mongoose";

//====================================================================
// Create withdraw money request only for seller
//====================================================================
export const createWithdrawalRequest = async (req, res, next) => {
  try {
    const {
      withdrawalPurpose,
      shop,
      order,
      product,
      refundTransactionId,
      supplier,
      amount,
      currency,
      method,
      accountHolderName,
      bankName,
      bankCountry,
      bankAddress,
      bankSwiftCode,
      accountNumber,
      routingNumber,
      email,
      cryptoWalletAddress,
      cryptoCurrency,
      chequeRecipient,
      notes,
      processedDate,
      processedBy,
    } = req.body;

    const shopId = req.shop.id;

    if (!shopId || !mongoose.Types.ObjectId.isValid(shopId))
      return next(createError(400, "Invalid or missing shop ID!"));

    if (!mongoose.Types.ObjectId.isValid(shop))
      return next(createError(400, "Invalid shop ID!"));

    if (shopId !== shop)
      return next(createError(400, "Shop ID does not match!"));

    if (
      refundTransactionId &&
      !mongoose.Types.ObjectId.isValid(refundTransactionId)
    )
      return next(createError(400, "Invalid refund transaction ID!"));

    if (order && !mongoose.Types.ObjectId.isValid(order))
      return next(createError(400, "Invalid order ID!"));

    if (product && !mongoose.Types.ObjectId.isValid(product))
      return next(createError(400, "Invalid product ID!"));

    if (!mongoose.Types.ObjectId.isValid(processedBy))
      return next(createError(400, "Invalid processedBy ID!"));

    const seller = await Shop.findById(shopId);
    if (!seller) return next(createError(400, "Seller not found!"));

    // Sanitize request: Remove irrelevant fields based on method
    const withdrawalData = {
      withdrawalPurpose,
      shop,
      amount,
      currency,
      method,
      notes,
      processedDate,
      processedBy,
    };

    // Add conditionals
    if (withdrawalPurpose === "Product Procurement")
      withdrawalData.supplier = supplier;
    if (withdrawalPurpose === "Customer Reimbursement") {
      withdrawalData.order = order;
      withdrawalData.product = product;
      withdrawalData.refundTransactionId = refundTransactionId;
    }

    if (method === "Bank Transfer") {
      Object.assign(withdrawalData, {
        accountHolderName,
        bankName,
        bankCountry,
        bankAddress,
        bankSwiftCode,
        accountNumber,
        routingNumber,
      });
    }

    if (method === "PayPal" || method === "Stripe")
      withdrawalData.email = email;
    if (method === "Crypto") {
      withdrawalData.cryptoWalletAddress = cryptoWalletAddress;
      withdrawalData.cryptoCurrency = cryptoCurrency;
    }
    if (method === "Cheque") withdrawalData.chequeRecipient = chequeRecipient;

    // Create withdraw
    const newWithdrawal = new Withdraw(withdrawalData);
    await newWithdrawal.save();

    // Send email (after successful save)
    try {
      await sendEmail({
        email: "successselam@gmail.com",
        subject: "Withdraw Request",
        message: `
          <h2>Hello ${seller.name}</h2>
          <p>Your withdraw request of ${amount}$ is being processed. It may take 3–7 days to complete.</p>
          <p>Best regards,<br/>Customer Service Team</p>
        `,
      });
    } catch (emailErr) {
      console.error("Email error:", emailErr.message);
      // Optional: log but don't fail the whole request
    }

    res.status(201).json({
      success: true,
      newWithdrawal,
    });
  } catch (error) {
    console.error("Withdraw error", error);
    next(createError(500, "Withdraw money request is not created! Try again!"));
  }
};

//====================================================================
// Admin will access all withdraw requests
//====================================================================

export const getAllWithdrawRequests = async (req, res, next) => {
  try {
    const withdraws = await Withdraw.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      withdraws: withdraws,
    });
  } catch (error) {
    next(createError(500, "Admin could not access all withdraw requests!"));
  }
};

//====================================================================
// Admin can only update specific money withdraw request
//====================================================================

export const updateMoneyWithdrawRequest = async (req, res, next) => {
  try {
    const { sellerId } = req.body;

    const withdraw = await Withdraw.findByIdAndUpdate(
      req.params.id,
      {
        status: "succeed",
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    const seller = await Shop.findById(sellerId);

    const transection = {
      _id: withdraw._id,
      amount: withdraw.amount,
      updatedAt: withdraw.updatedAt,
      status: withdraw.status,
    };

    seller.transections = [...seller.transections, transection];

    await seller.save();
    await withdraw.save();

    // Email Contents
    const message = `
      <h2> Hello ${req.seller.name} </h2>
      <p> Your withdraw request of ${withdraw.amount}$ is on the way. Delivery time depends on your bank's rules it usually takes from 3 days to 7 days. </p> 
      <p> Best regards, </p>
      <p> Customer Service Team </p>
      `;

    const subject = "Payment Confirmation";
    const send_to = req.seller.email;

    try {
      await sendEmail({
        email: send_to,
        subject: subject,
        message: message,
      });
    } catch (error) {
      next(
        createError(
          500,
          "Withdraw money delivery request is not send to seller email! Please try again!"
        )
      );
    }

    res.status(200).json({
      success: true,
      withdraw,
    });
  } catch (error) {}
};

//====================================================================
// Admin only will delete specific money withdraw request
//====================================================================

export const deleteMoneyWithdrawRequest = async (req, res, next) => {
  try {
    const withdrawId = req.params.id;
    const withdraw = await Withdraw.findById(withdrawId);
    if (!withdraw) {
      return next(createError(400, "Withdraw request not found!"));
    }
    await Withdraw.findByIdAndDelete(withdrawId);

    res
      .status(200)
      .json({ success: true, message: "Money withdraw request is deleted!" });
  } catch (error) {
    next(
      createError(
        500,
        "Withdraw money request could not be deleted! Please try again!"
      )
    );
  }
};

//====================================================================
// Admin only will get all withdraws
//====================================================================

export const deleteAllMoneyWithdraws = async (req, res, next) => {
  try {
    await Withdraw.deleteMany();

    res.status(200).json({
      success: true,
      message: "Money withdraw requests are successfully deleted!",
    });
  } catch (error) {}
};
