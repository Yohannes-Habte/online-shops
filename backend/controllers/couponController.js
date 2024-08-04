import Coupon from '../models/CouponModel.js';
import createError from 'http-errors';

// ==============================================================================
// Create coupon code
// ==============================================================================
export const createCouponCode = async (req, res, next) => {
  try {
    const couponCodeExist = await Coupon.findOne({ name: req.body.name });

    if (couponCodeExist) {
      return next(createError(400, 'The coupon code already exists!'));
    }

    const couponCode = await Coupon.create(req.body);

    // Save coupon code
    try {
      await couponCode.save();
    } catch {
      return next(createError(500, "couldn't save coupon. please try again!"));
    }

    return res.status(201).json({ success: true, coupon: couponCode });
  } catch (error) {
    console.log(error);
    next(createError(400, 'Coupon could not query!'));
  }
};

// ==============================================================================
// Get all coupon codes for specific shop
// ==============================================================================
export const getAllCouponCodes = async (req, res, next) => {
  try {
    // Find all coupons for a shop with a specific shop id (shopID)
    const coupons = await Coupon.find({ shopID: req.params.id });

    if (!coupons) {
      return next(createError(400, 'Coupons do not exist!'));
    }

    res.status(201).json({ success: true, coupons });
  } catch (error) {
    console.log(error);
    next(createError(400, 'Database could not query!'));
  }
};

// ==============================================================================
// Get coupoun code percent by its name
// ==============================================================================
export const getCouponCodePercent = async (req, res, next) => {
  try {
    const coupon = await Coupon.findOne({ name: req.params.name });

    if (!coupon) {
      return next(createError(400, 'Coupon does not exist!'));
    }

    res.status(201).json({ success: true, coupon: coupon });
  } catch (error) {
    console.log(error);
    next(createError(400, 'Database could not query! Please try again!'));
  }
};

// ==============================================================================
// Delete coupoun code of a shop
// ==============================================================================
export const deleteCouponCode = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.couponID);
    if (!coupon) {
      return next(createError(400, 'Coupon not found!'));
    }

    res.status(201).json('Coupon code deleted successfully!');
  } catch (error) {
    console.log(error);
    next(createError(400, 'Database could not query!'));
  }
};
