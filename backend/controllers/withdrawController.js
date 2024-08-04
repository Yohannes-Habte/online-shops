import Withdraw from '../models/withdrawModel.js';
import Shop from '../models/shopModel.js';
import createError from 'http-errors';
import sendEmail from '../utils/sendMail.js';

//====================================================================
// Create withdraw money request only for seller
//====================================================================

export const createWithdrawMoney = async (req, res, next) => {
  try {
    const { amount, seller } = req.body;

    // Email Contents
    const message = `
     <h2> Hello ${seller.name} </h2>
     <p> Your withdraw request of ${amount}$ is processing. It will take 3days to 7days to processing! </p> 
     <p> Best regards, </p>
     <p> Customer Service Team </p>
     `;
    const subject = 'Withdraw Request';
    const send_to = "uhytmsb@gmail.com"

    try {
      await sendEmail({
        email: send_to,
        subject: subject,
        message: message,
      });

      res.status(201).json({
        success: true,
      });
    } catch (error) {
      return next(
        createError(
          500,
          'Withdraw request is not send to seller email! Please try again!'
        )
      );
    }

    // Create withdraw
    const withdraw = new Withdraw({
      seller: seller,
      amount: amount,
    });

    // Update shop or seller available balance after the withdraw money has been successful
    const shop = await Shop.findById(req.shop._id);
    console.log("Shop", shop)

    shop.availableBalance = shop.availableBalance - amount;

    // Save the changes for shop and withdraw in the database
    await shop.save();
    await withdraw.save();

    res.status(201).json({
      success: true,
      withdraw,
    });
  } catch (error) {
    next(createError(500, 'Withdraw money request is not created! Try again!'));
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
    next(createError(500, 'Admin could not access all withdraw requests!'));
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
        status: 'succeed',
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

    const subject = 'Payment Confirmation';
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
          'Withdraw money delivery request is not send to seller email! Please try again!'
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
      return next(createError(400, 'Withdraw request not found!'));
    }
    await Withdraw.findByIdAndDelete(withdrawId);

    res
      .status(200)
      .json({ success: true, message: 'Money withdraw request is deleted!' });
  } catch (error) {
    next(
      createError(
        500,
        'Withdraw money request could not be deleted! Please try again!'
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
      message: 'Money withdraw requests are successfully deleted!',
    });
  } catch (error) {}
};
