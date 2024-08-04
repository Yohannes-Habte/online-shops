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
import { authUser } from '../middleware/auth.js';
import requiredValues from '../validators/requiredValues.js';
import userRegisterValidator from '../validators/userRegisterValidator.js';
import checkValidation from '../validators/checkValidation.js';

// Auth Router
const authRouter = express.Router();

// Auth routes
authRouter.post(
  '/register',
  requiredValues(['name', 'email', 'password', 'phone', 'image', 'agree']),
  userRegisterValidator(),
  checkValidation,
  createAccount
);
authRouter.post('/google', googleRegisterLogin);
authRouter.post('/login', loginUser);
authRouter.post('/forgot-password', forgotPassword);
authRouter.patch('/reset-password/:token', resetForgotPassword);
authRouter.put('/update-user-profile', updateUserProfile);
authRouter.put('/:id/change-user-password', changeUserPassword);
authRouter.get('/logout/:id', userLogout);
authRouter.delete('/delete-account/:account', authUser, deleteAccount);

// Export auth Router
export default authRouter;
