import express from 'express';
import {
  createCouponCode,
  deleteCouponCode,
  getAllCouponCodes,
  getCouponCodePercent,
} from '../controllers/couponController.js';
import { authSeller } from '../middleware/auth.js';
import requiredValues from '../validators/requiredValues.js';
import couponValidator from '../validators/couponValidator.js';
import checkValidation from '../validators/checkValidation.js';

// coupon Router
const couponRouter = express.Router();

// coupon routes
couponRouter.post(
  '/create-coupon',

  requiredValues(['name', 'percent', 'minAmount', 'maxAmount']),
  couponValidator(),
  checkValidation,
  createCouponCode
);
couponRouter.get('/shop/:shopID', getAllCouponCodes);
couponRouter.get('/shop/value/:name', getCouponCodePercent);
couponRouter.delete('/:couponID', deleteCouponCode);

// Export coupon Router
export default couponRouter;
