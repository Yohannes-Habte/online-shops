import express from 'express';
import {
  createWithdrawMoney,
  deleteAllMoneyWithdraws,
  deleteMoneyWithdrawRequest,
  getAllWithdrawRequests,
  updateMoneyWithdrawRequest,
} from '../controllers/withdrawController.js';
import { authAdmin, authSeller } from '../middleware/auth.js';
import requiredValues from '../validators/requiredValues.js';
import withdrawValidator from '../validators/withdrawValidator.js';
import checkValidation from '../validators/checkValidation.js';

// withdraw Router
const withdrawRouter = express.Router();

// withdraw routes
withdrawRouter.post(
  '/create-withdraw-request',
  authSeller,
  requiredValues(['amount']),
  withdrawValidator(),
  checkValidation,
  createWithdrawMoney
);

withdrawRouter.put(
  '/update-withdraw-request/:id',
  authAdmin,
  updateMoneyWithdrawRequest
);

withdrawRouter.get('/', getAllWithdrawRequests);
withdrawRouter.delete('/:id', deleteMoneyWithdrawRequest);
withdrawRouter.delete('/', deleteAllMoneyWithdraws);

// Export withdraw Router
export default withdrawRouter;
