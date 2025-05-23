import User from "../models/userModel.js";
import createError from "http-errors";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmail from "../utils/sendMail.js";
import generateUserToken from "../middleware/userToken.js";
import mongoose from "mongoose";

//=========================================================================
// Create an account
//=========================================================================
export const createAccount = async (req, res, next) => {
  const { name, email, password, agree } = req.body;
  try {
    const user = await User.findOne({ email: email });

    // If user does not exist in the data base, ....
    if (user) {
      return next(
        createError(400, "Email has been taken! Please Try another one")
      );
    }

    // If user does not exist in the database, ....
    const newUser = new User({
      name: name,
      email: email,
      password: password,
      agree: agree,
    });

    // Save user in the database
    try {
      await newUser.save();
    } catch (error) {
      return next(createError(500, "User could not be saved"));
    }

    // Generate token for a user
    const token = generateUserToken(newUser);

    return res
      .cookie("user_token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        sameSite: "none",
        secure: true,
      })
      .status(201)
      .json({ success: true, user: newUser });
  } catch (error) {
    console.log(error);
    next(createError(500, "User could not sign up. Please try again!"));
  }
};

//=========================================================================
// Google register and login for a user
//=========================================================================
export const googleRegisterLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    // If user exist, the user will log in
    if (user) {
      const googleLoginToken = userToken(user._id);
      const { password, role, ...otherDetails } = user._doc;

      return res
        .cookie("user_token", googleLoginToken, {
          path: "/",
          httpOnly: true,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
          sameSite: "none",
          secure: true,
        })
        .status(200)
        .json({ success: true, user: otherDetails });
    } else {
      // If user does not exist, the user will sign up
      const generatepassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcrypt.hashSync(generatepassword, 12);

      const newUser = new User({
        name:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        agree: req.body.agree,
      });
    

      try {
        await newUser.save();
      } catch (error) {
        next(createError(500, "User could not save!"));
      }

      const googleLoginSignup = userToken(newUser._id);
      const { password, role, ...otherDetails } = newUser._doc;

      return res
        .cookie("user_token", googleLoginSignup, {
          path: "/",
          httpOnly: true,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
          sameSite: "none",
          secure: true,
        })
        .status(200)
        .json({ success: true, user: otherDetails });
    }
  } catch (error) {
    console.log(error);
    next(createError(500, "User could not sign up or login using google!"));
  }
};

//=========================================================================
// Login user
//=========================================================================

export const loginUser = async (req, res, next) => {
  const { email, password, rememberMe } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      console.error("User not found:", email);
      return next(createError(400, "Wrong credentials"));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(createError(400, "Incorrect password!"));
    }

    if (user && isPasswordValid) {
      const { password, admin, seller, ...userDetails } = user._doc;

      const token = generateUserToken(user);

      const tokenExpiry = rememberMe
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 24 * 60 * 60 * 1000);

      res

        .cookie("token", token, {
          path: "/",
          httpOnly: false,
          secure: true,
          expires: tokenExpiry,
          sameSite: "strict",
        })
        .status(200)
        .json({
          success: true,
          user: { ...userDetails },
          token,
          message: "User successfully logged in!",
        });
    }
  } catch (error) {
    console.error("Login error:", error.message, error.stack);
    return next(createError(400, "You are unable to login! Please try again!"));
  }
};

//=========================================================================
// Forgot password handling
//=========================================================================

export const forgotPassword = async (req, res, next) => {
  /*
     We need to do three things
       1. Get a user using email existed in the database
       2. Generate a random reset token
       3. send the token back to the user email
   */
  try {
    // 1. Identity or get a user using email exist or post in the database
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.status(404).send("User email does not exist! Please try again!");
    }

    // 2. Generate a random reset token
    const resetToken = user.createResetpasswordToken();

    // Save the user in the database
    await user.save({ validateBeforeSave: false });

    // 3. send the token back to the user email for password reset.
    // When you send email, you need to consider two items:
    // 3.1 Construct Reset URL
    const resetUrl = `${process.env.SERVER_URL}/reset-password/${resetToken}`;

    // 3.2 Email Contents
    const message = `
        <h2> Hello ${user.name} </h2>
        <p> Please click on the link below to reset your password </p>
        <p> This reset link is valid only for 10 minutes. </p>
        <a href=${resetUrl} clicktracking=off> ${resetUrl} </a>
        <p> Best regards, </p>
        <p> Customer Service Team </p>
        `;

    const subject = "Password Reset Request";
    const send_to = user.email;
    // const sent_from = process.env.EMAIL_USER;

    try {
      await sendEmail({
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
// Reset forgot password
//=========================================================================

export const resetForgotPassword = async (req, res, next) => {
  const token = req.params.token;
  // Since the token is encrypted in the database, we need to encrypt this token as well
  const encryptedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  try {
    // First find the user who wants to reset password from the database using passwordResetToken. Then, check whether the password reset token is expired or not
    const user = await User.findOne({
      passwordResetToken: encryptedToken,
      passwordResetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).send("Token is invalid or it is expired!");
    }
    // If user exist, rest the user password
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.forgotPasswordChangedAt = Date.now();

    // Save the changes in the databas
    user.save();

    const { password, role, ...rest } = user._doc;

    // generate user token
    const loginToken = userToken(user._id);

    return res
      .cookie("user_token", loginToken, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 60 * 1000),
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .json({ success: true, user: rest });
  } catch (error) {
    next(
      createError(500, "The password has not been reset! Please try again!")
    );
  }
};

//=========================================================================
// Logout user
//=========================================================================

export const userLogout = async (req, res, next) => {
  try {
    res.clearCookie("user_token");
    res.status(200).json({
      success: true,
      message: "You have successfully logged out.",
    });
  } catch (error) {
    next(createError(500, "User could not logout. Please try again!"));
  }
};

//=========================================================================
// Update user profile
//=========================================================================

export const updateUserProfile = async (req, res, next) => {
  const { name, confirmEmail, confirmPassword, phone, image, agree } = req.body;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(createError(400, "User id is not valid"));
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(createError(400, "User not found"));
    }

    // Validate password before allowing updates
    const isPasswordValid = await bcrypt.compare(
      confirmPassword,
      user.password
    );
    if (!isPasswordValid) {
      return next(createError(401, "Invalid password"));
    }

    // Prepare updated fields
    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (confirmEmail) updatedFields.email = confirmEmail;
    if (phone) updatedFields.phone = phone;
    if (image) updatedFields.image = image;
    if (agree !== undefined) updatedFields.agree = agree;

    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.log(error);
    next(createError(500, "User account could not update! Please try again!"));
  }
};

//=========================================================================
// Change user password
//=========================================================================

export const changeUserPassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("+password");

    if (!user) {
      return next(createError(400, "User not found"));
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    );
    if (!isPasswordValid) {
      return next(createError(400, "Invalid old password! Please try again!"));
    }

    user.password = req.body.newPassword;

    await user.save();

    res.status(200).json("Password updated successfully!");
  } catch (error) {
    console.log(error);
    next(createError(500, "User password could not update! Please try again!"));
  }
};

//=========================================================================
// Delete user
//=========================================================================

export const deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.account);

    if (user) {
      await User.findByIdAndDelete(req.params.account);

      res.clearCookie("user_token");
      res.status(200).json(`User has been successfully deleted!`);
    } else {
      return next(createError(404, "User not found!"));
    }
  } catch (error) {
    return next(
      createError(500, "User could not delete account. Please try again!")
    );
  }
};
