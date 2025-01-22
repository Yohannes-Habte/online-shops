import JWT from "jsonwebtoken";
import createError from "http-errors";
import mongoose from "mongoose";
import User from "../models/userModel.js";


//====================================================================
// Verify token
//====================================================================

const verifyToken = (token) => {
  return JWT.verify(token, process.env.JWT_USER_SECRET);
};

//====================================================================
// Middleware: User Authentication
//====================================================================

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(createError(401, "User is not authenticated!"));
  }

  try {
    const user = verifyToken(token);

    req.user = user;
    next();
  } catch (error) {
    return next(createError(403, "Forbidden"));
  }
};




//====================================================================
// Middleware: Authorization
//====================================================================

const checkRole = (role) => {
  return async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
      return next(createError(401, "Not authenticated!"));
    }

    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(createError(404, "User not found"));
      }

      if (user.role !== role) {
        return next(
          createError(
            403,
            "Forbidden: You do not have permission to perform this action"
          )
        );
      }

      req.user = user;
      next();
    } catch (error) {
      return next(createError(500, "Server error. Please try again later."));
    }
  };
};

//====================================================================
// Middleware: Owner or Admin Authorization
//====================================================================

export const isOwnerOrAdmin = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(createError(401, "Not authenticated!"));
  }

  try {
    const decoded = verifyToken(token);

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid user ID format"));
    }

    const user = await User.findById(decoded.id).select("_id role");

    if (!user) {
      return next(createError(404, "User not found"));
    }

    if (user._id.toString() !== req.params.id && user.role !== "admin") {
      return next(
        createError(
          403,
          "Forbidden: You do not have permission to perform this action"
        )
      );
    }

    req.user = user;
    next();
  } catch (error) {
    return next(createError(500, "Server error. Please try again later."));
  }
};

//====================================================================
// Middleware: Role Authorization
//====================================================================

export const isAdmin = checkRole("admin");
export const isSeller = checkRole("seller");
