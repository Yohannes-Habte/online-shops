import express from 'express';
import {
  createShop,
  deleteAllShops,
  deleteSingleShop,
  deleteWithdrawMethod,
  getAllShops,
  getShop,
  loginSeller,
  resetForgotShopPassword,
  sellerLogout,
  shopForgotPassword,
  updatePaymentMethods,
  updateShopProfile,
} from '../controllers/shopController.js';
import { authAdmin, authSeller } from '../middleware/auth.js';
import requiredValues from '../validators/requiredValues.js';
import shopRegisterValidator from '../validators/shopRegisterValidator.js';
import checkValidation from '../validators/checkValidation.js';

// shop Router
const shopRouter = express.Router();

// shop routes
shopRouter.post(
  '/create-shop',
  requiredValues([
    'name',
    'email',
    'password',
    'phoneNumber',
    'description',
    'shopAddress',
    'image',
    'agree',
  ]),
  shopRegisterValidator(),
  checkValidation,
  createShop
);
shopRouter.post('/login-shop', loginSeller);
shopRouter.get('/logout-shop', sellerLogout);
shopRouter.post('/shop-forgot-password', shopForgotPassword);
shopRouter.patch('/shop-reset-password/:token', resetForgotShopPassword);
shopRouter.put('/update-shop-profile', authSeller, updateShopProfile);
shopRouter.put('/update-payment-methods', authSeller, updatePaymentMethods);
shopRouter.delete('/delete-payment-method', authSeller, deleteWithdrawMethod);
shopRouter.get('/shop/:id', getShop);
shopRouter.get('/', getAllShops);
shopRouter.delete('/delete-shop/:id', deleteSingleShop);
shopRouter.delete('/delete-all-shops', authAdmin, deleteAllShops);

// Export shop Router
export default shopRouter;
