import createError from 'http-errors';
import JWT from 'jsonwebtoken';
import User from '../models/userModel.js';
import Shop from '../models/shopModel.js';

//====================================================================
// Is user auth
//====================================================================
export const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.user_token;
    console.log('User token =', token);

    if (!token) {
      return next(createError(401, 'User is not authenticated. Please login!'));
    }

    // If user token exist, decode it
    const decodedToken = JWT.verify(token, process.env.JWT_USER_SECRET);

    // Find user using the decoded token
    const user = await User.findById(decodedToken.id);

    // If user does not exist, it is unauthorized
    if (!user) {
      return next(createError(403, 'User is not authorized.'));
    }
    // If user exist, proceed to the next middleware
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return next(createError(500, 'User could not access such data.'));
  }
};

//====================================================================
// Is Seller auth
//====================================================================
export const authSeller = async (req, res, next) => {
  try {
    const shopToken = req.cookies.shopToken;

    if (!shopToken) {
      return next(
        createError(401, 'Seller is not authenticated. Please login!')
      );
    }

    const decodedToken = JWT.verify(shopToken, process.env.JWT_SHOP_SECRET);

    const shop = await Shop.findById(decodedToken.id);

    if (!shop) {
      return next(createError(403, 'You are not authorized.'));
    }

    req.shop = shop;
    next();
  } catch (error) {
    console.log(error);
    return next(createError(500, 'User could not access such data.'));
  }
};

//====================================================================
// Is admin auth
//====================================================================
export const authAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.user_token;

    if (!token) {
      return next(createError(401, 'User is not authenticated. Please login!'));
    }

    const decodedToken = JWT.verify(token, process.env.JWT_USER_SECRET);

    const user = await User.findById(decodedToken.id);

    if (user && user.role === 'admin') {
      next();
    } else {
      return next(createError(403, 'User is not authorized.'));
    }
  } catch (error) {
    console.log(error);
    return next(createError(500, 'User could not access such data.'));
  }
};
