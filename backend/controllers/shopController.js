import createError from "http-errors";
import Shop from "../models/shopModel.js";
import bcrypt from "bcryptjs";
import sellerToken from "../middleware/shopToken.js";
import shopSendEmail from "../utils/shopSendEmail.js";
import crypto from "crypto";
import generateShopToken from "../middleware/shopToken.js";

//=========================================================================
// Create a seller
//=========================================================================
export const createShop = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phoneNumber,
      description,
      shopAddress,
      LogoImage,
      agree,
    } = req.body;

    if (typeof LogoImage !== "string") {
      return next(createError(400, "LogoImage must be a valid URL."));
    }

    const sellerEmail = await Shop.findOne({ email: email });
    if (sellerEmail) {
      return next(createError(400, "Shop already exists!"));
    }

    const newShop = new Shop({
      name,
      email,
      password,
      phoneNumber,
      LogoImage,
      shopAddress,
      description,
      agree,
    });

    await newShop.save();

    const token = generateShopToken(newShop);
    return res
      .cookie("shopToken", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        sameSite: "none",
        secure: true,
      })
      .status(201)
      .json({ success: true, shop: newShop, message: "Shop created!" });
  } catch (error) {
    console.log(error);
    return next(
      createError(500, "The shop could not created. Please try again!")
    );
  }
};

//=========================================================================
// Login shop
//=========================================================================
export const loginSeller = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const seller = await Shop.findOne({ email: email });

    // If user does not exist in the database, then ....
    if (!seller) {
      return next(
        createError(400, "This email does not exist! Please sign up!")
      );
    }

    // If user exist in the database, then check password validity
    const isPasswordValid = await bcrypt.compare(password, seller.password);
    if (!isPasswordValid) {
      return next(createError(400, "Invalid password! Please try again!"));
    }

    if (seller && isPasswordValid) {
      const { password, ...rest } = seller._doc;

      // generate login shop token
      const token = sellerToken(seller);

      return res
        .cookie("shopToken", token, {
          path: "/",
          httpOnly: true,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
          sameSite: "none",
          secure: true,
        })
        .status(201)
        .json({ success: true, shop: rest, token: token });
    }
  } catch (error) {
    console.log(error);
    next(createError(500, "User could not login. Please try again!"));
  }
};

//=========================================================================
// Logout shop which is a seller
//=========================================================================
export const sellerLogout = async (req, res, next) => {
  try {
    res.cookie("shopToken", null, {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "none",
      secure: true,
    });
    res.status(201).json({
      success: true,
      message: "Log out successful!",
    });
  } catch (error) {
    next(createError(500, "Seller could not logout. Please try again!"));
  }
};

//=========================================================================
// shop forgot password
//=========================================================================
export const shopForgotPassword = async (req, res, next) => {
  try {
    // Get a shop using its email
    const shop = await Shop.findOne({ email: req.body.email });
    if (!shop) {
      return next(createError(400, "Email does not exist! Please try again!"));
    }

    // Generate a random reset token
    const resetToken = shop.createResetpasswordToken();

    // Save the update
    await shop.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.SERVER_URL}/shop-reset-password/${resetToken}`;

    const message = `
    <h2> Hello ${shop.name} </h2>
    <p> Please click on the link below to reset your password </p>
    <p> This reset link is valid only for 10 minutes. </p>
    <a href=${resetUrl} clicktracking=off> ${resetUrl} </a>
    <p> Best regards, </p>
    <p> Customer Service Team </p>
    `;

    const subject = "Password Reset";
    const send_to = shop.email;
    const sent_from = process.env.EMAIL_SENDER;

    try {
      await shopSendEmail({
        email: send_to,
        subject: subject,
        message: message,
      });

      res.status(200).json({
        success: true,
        message: "Reset password link has been sent to the your email",
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpires = undefined;
      user.save({ validateBeforeSave: false });
      console.log(error);
      return next(createError(500, "Error sending password reset email!"));
    }
  } catch (error) {
    console.log(error);
    return next(createError(500, "Forgotten password not reset!"));
  }
};

//=========================================================================
// Shop rest forgot password
//=========================================================================
export const resetForgotShopPassword = async (req, res, next) => {
  const token = req.params.token;

  const encryptedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  try {
    const shop = await Shop.findOne({
      passwordResetToken: encryptedToken,
      passwordResetTokenExpires: { $gt: Date.now() },
    });

    if (!shop) {
      res.status(400).send("Token is invalid or it is expired!");
    }

    // If shop exist, rest its password
    shop.password = req.body.password;
    shop.passwordResetToken = undefined;
    shop.passwordResetTokenExpires = undefined;
    shop.forgotPasswordChangedAt = Date.now();

    // Save changes
    shop.save();

    const { password, role, ...rest } = shop._doc;

    // generate login shop token
    const shopLoginToken = sellerToken(shop._id);

    return res
      .cookie("ushopToken", shopLoginToken, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 60 * 1000),
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .json({ success: true, shop: rest });
  } catch (error) {
    next(
      createError(500, "The password has not been reset! Please try again!")
    );
  }
};

//=========================================================================
// Update shop Profile
//=========================================================================
export const updateShopProfile = async (req, res, next) => {
  try {
    const { image, name, phoneNumber, shopAddress, description } = req.body;

    const shop = await Shop.findById(req.shop._id);

    if (!shop) {
      return next(createError(400, "Shop not found!"));
    }
    shop.image = image;
    shop.name = name;
    shop.phoneNumber = phoneNumber;
    shop.shopAddress = shopAddress;
    shop.description = description;

    await shop.save();

    res.status(201).json({ success: true, shop });
  } catch (error) {
    next(createError(500, "Seller profile is not update. Please try again!"));
  }
};

//====================================================================
// Get a Seller/shop
//====================================================================
export const getShop = async (req, res, next) => {
  try {
    // const shop = await Shop.findById(req.shop._id);
    const shop = await Shop.findById(req.shop.id);

    if (!shop) {
      return next(createError(404, "Shop does not found! Please try again!"));
    }

    return res.status(200).json({ success: true, shop });
  } catch (error) {
    next(createError(500, "Database could not query! Please try again!"));
    console.log(error);
  }
};

//====================================================================
// Get all sellers/shops
//====================================================================
export const getAllShops = async (req, res, next) => {
  try {
    const shops = await Shop.find().sort({
      createdAt: -1,
    });
    res.status(201).json({
      success: true,
      shops,
    });
  } catch (error) {
    next(createError(500, "Database could not query!"));
  }
};

//====================================================================
// Get a single shop products
//====================================================================

export const getShopProducts = async (req, res, next) => {
  try {
    // Find the shop and populate its shopProducts
    const shop = await Shop.findById(req.shop.id).populate("shopProducts");

    // Check if the shop exists
    if (!shop) {
      return next(createError(400, "Shop not found! Please try again!"));
    }

    // Return the shop's products
    res.status(200).json({
      success: true,
      products: shop.shopProducts,
    });
  } catch (error) {
    console.error("Error fetching shop products:", error);
    return next(createError(500, "Database could not query!"));
  }
};

//====================================================================
// Update seller/shop withdraw methods
//====================================================================
export const updatePaymentMethods = async (req, res, next) => {
  try {
    const { withdrawMethod } = req.body;

    const shop = await Shop.findByIdAndUpdate(req.shop._id, { withdrawMethod });

    // Save changes to a shop
    shop.save();

    res.status(201).json({
      success: true,
      shop,
    });
  } catch (error) {
    console.log(error);
    next(createError(500, "Database could not update payment method!"));
  }
};

//====================================================================
// Delete seller/shop withdraw methods
//====================================================================
export const deleteWithdrawMethod = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.shop._id);

    if (!shop) {
      return next(createError(400, "Shop not found! Please try again!"));
    }

    // nullify the withdrawMethod
    shop.withdrawMethod = null;

    await shop.save();

    res.status(200).json({
      success: true,
      shop,
    });
  } catch (error) {
    next(createError(500, "Database could not delete payment method!"));
  }
};

//====================================================================
// Delete single shop by admin only
//====================================================================
export const deleteSingleShop = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return next(createError(400, "Shop not found! Please try again!"));
    }

    await Shop.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Shop is successfully deleted!",
    });
  } catch (error) {
    next(createError(500, "Database could not delete shop! Please try again!"));
  }
};

//====================================================================
// Delete all shops by admin only
//====================================================================
export const deleteAllShops = async (req, res, next) => {
  try {
    await Shop.deleteMany();

    res.status(200).json({
      success: true,
      message: "Shops have been deleted successfully!",
    });
  } catch (error) {
    next(
      createError(500, "Database could not delete shops! Please try again!")
    );
  }
};

/** 
// ====================================================================
// Delete the shopProducts field contents, but the shopProducts field. 
// ====================================================================
const clearShopProducts = async (shopId) => {
  
  try {
    const updatedShop = await Shop.updateOne(
      { _id: shopId }, // Filter: Shop with the specific ID
      { $set: { shopProducts: [] } } // Set shopProducts to an empty array
    );
    console.log("ShopProducts cleared successfully:", updatedShop);
  } catch (err) {
    console.error("Error clearing ShopProducts:", err);
  }
};

// clearShopProducts("Enter shop ID here"); 


// ====================================================================
// If You Need to Clear shopProducts for All Shops:
// ====================================================================

const clearAllShopProducts = async () => {
  try {
    const result = await Shop.updateMany(
      {}, // No filter: Applies to all documents
      { $set: { orders: [] } } // Set soldProducts to an empty array
    );
  } catch (err) {
    console.error("Error clearing ShopProducts for all shops:", err);
  }
};

//clearAllShopProducts();

// ====================================================================
// If You Need to Clear the soldProducts Field for All Shops:
// ====================================================================
const clearShopProductsField = async () => {
  try {
    const result = await Shop.updateMany(
      {}, // No filter: Applies to all documents
      { $unset: { soldProducts: "" } } // Removes the soldProducts field entirely
    );
    console.log(result);
  } catch (err) {
    console.error("Error clearing ShopProducts for all shops:", err);
  }
};

// clearShopProductsField();
*/

