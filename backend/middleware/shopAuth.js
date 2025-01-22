import JWT from "jsonwebtoken";
import createError from "http-errors";
import mongoose from "mongoose";
import Shop from "../models/shopModel.js";

//====================================================================
// Verify token
//====================================================================

const verifyToken = (token) => {
  try {
    const sellerToken = JWT.verify(token, process.env.JWT_SHOP_SECRET);
    return sellerToken;
  } catch (error) {
    throw new Error("Token verification failed");
  }
};

//====================================================================
// Middleware: User Authentication
//====================================================================

export const isSellerAuthenticated = (req, res, next) => {
  const token = req.cookies.shopToken

  if (!token) {
    return next(createError(401, "Seller is not authenticated!"));
  }

  try {
    const shop = verifyToken(token);
    req.shop = shop;
    next();
  } catch (error) {
    return next(createError(403, "Forbidden"));
  }
};


//====================================================================
// Middleware: Owner or Admin Authorization
//====================================================================

export const isOwnerOrAdmin = async (req, res, next) => {
  const token = req.cookies.shopToken;

  if (!token) {
    return next(createError(401, "Not authenticated!"));
  }

  try {
    const decoded = verifyToken(token);

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid user ID format"));
    }

    const shop = await Shop.findById(decoded.id).select("_id role");

    if (!shop) {
      return next(createError(404, "User not found"));
    }

    if (shop._id.toString() !== req.params.id && shop.role !== "admin") {
      return next(
        createError(
          403,
          "Forbidden: You do not have permission to perform this action"
        )
      );
    }

    req.shop = shop;
    next();
  } catch (error) {
    return next(createError(500, "Server error. Please try again later."));
  }
};

//====================================================================
// Middleware: Authorization
//====================================================================

const checkRole = (role) => {
  return async (req, res, next) => {
    const token = req.cookies.shopToken;

    if (!token) {
      return next(createError(401, "Not authenticated!"));
    }

    try {
      const decoded = verifyToken(token);
      const shop = await Shop.findById(decoded.id);

      if (!shop) {
        return next(createError(404, "User not found"));
      }

      if (shop.role !== role) {
        return next(
          createError(
            403,
            "Forbidden: You do not have permission to perform this action"
          )
        );
      }

      req.shop = shop;
      next();
    } catch (error) {
      return next(createError(500, "Server error. Please try again later."));
    }
  };
};

//====================================================================
// Middleware: Role Authorization
//====================================================================

export const isAdmin = checkRole("admin");
export const isSeller = checkRole("seller");
