import mongoose, { mongo } from "mongoose";
import User from "../models/userModel.js";
import createError from "http-errors";

//====================================================================
// Get a user
//====================================================================
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return next(createError(404, "User not found"));
    }
    res.status(200).json({
      success: true,
      result: user,
    });
  } catch (err) {
    next(createError(500, "Server error"));
  }
};

// ===================================================================
// Get a user info by ID
// ===================================================================
export const getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return next(createError(404, "User not found"));
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    next(createError(500, "Server error"));
  }
};

//====================================================================
// Get a user
//====================================================================
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (users) {
      res.status(200).json({ success: true, users });
    } else {
      return next(createError(404, "Users do not found!"));
    }
  } catch (error) {
    next(createError(500, "Database could not query!"));
  }
};

//====================================================================
// Update user address
//====================================================================

export const updateUserAddress = async (req, res, next) => {
  const {
    country,
    state,
    city,
    streetName,
    houseNumber,
    zipCode,
    addressType,
  } = req.body;

  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(createError(404, "Invalid user ID!"));
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return next(createError(404, "User not found"));
    }

    const houseNum = parseInt(houseNumber);
    const zip = parseInt(zipCode);

    const addressFields = {
      country,
      state,
      city,
      streetName,
      houseNumber: houseNum,
      zipCode: zip,
      addressType,
    };

    // Is the same address type
    const sameAddressType = user.addresses.find(
      (address) => address.addressType === addressType
    );
    if (sameAddressType) {
      return next(createError(400, `${addressType} address already exist!`));
    }

    // Is address exist
    const existAddress = user.addresses.find(
      (address) => address._id === req.body._id
    );

    if (existAddress) {
      Object.assign(existAddress, addressFields);
    } else {
      // Add new Address to the array
      user.addresses.push(addressFields);
    }

    // After updating the address, save the user in the database
    await user.save();

    res.status(200).json({ success: true, user: user });
  } catch (error) {
    console.log(error);
    next(
      createError(500, "The address could not be updated! Please try again!")
    );
  }
};

//====================================================================
// Delete user address
//====================================================================

export const deleteUserAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(createError(404, "Invalid user ID!"));
    }

    const user = await User.findById(userId);

    if (!user) {
      return next(createError(404, "User not found"));
    }

    await User.findByIdAndUpdate(
      {
        _id: userId,
      },
      { $pull: { addresses: { _id: addressId } } }
    );

    // Update user data (address)
    res.status(200).json({ success: true, user, message: "Address deleted!" });
  } catch (error) {
    next(
      createError(500, "The address could not be deleted! Please try again!")
    );
  }
};

//====================================================================
// Delete user by admin
//====================================================================

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(createError(404, "User does not exist!"));
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(201).json({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (error) {
    next(createError(500, "User could not be deleted! Please try again!"));
  }
};
