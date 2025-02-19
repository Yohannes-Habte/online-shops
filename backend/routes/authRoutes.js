import express from 'express';
import {
  changeUserPassword,
  createAccount,
  deleteAccount,
  forgotPassword,
  googleRegisterLogin,
  loginUser,
  resetForgotPassword,
  updateUserProfile,
  userLogout,
} from '../controllers/authController.js';
import requiredValues from '../validators/requiredValues.js';
import userRegisterValidator from '../validators/userRegisterValidator.js';
import checkValidation from '../validators/checkValidation.js';
import { isAuthenticated } from '../middleware/auth.js';

// Auth Router
const authRouter = express.Router();

// Auth routes
authRouter.post(
  '/register',
  requiredValues(['name', 'email', 'password', 'agree']),
  userRegisterValidator(),
  checkValidation,
  createAccount
);
authRouter.post('/google', googleRegisterLogin);
authRouter.post('/login', loginUser);
authRouter.get('/logout', userLogout);
authRouter.post('/forgot-password', forgotPassword);
authRouter.patch('/reset-password/:token', resetForgotPassword);
authRouter.put('/update/profile', isAuthenticated, updateUserProfile);
authRouter.put('/:id/change-user-password', changeUserPassword);
authRouter.delete('/delete-account/:account', deleteAccount);

// Export auth Router
export default authRouter;
