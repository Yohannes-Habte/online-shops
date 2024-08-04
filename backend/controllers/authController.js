import User from '../models/userModel.js';
import createError from 'http-errors';
import bcrypt from 'bcryptjs';
import userToken from '../middleware/userToken.js';
import crypto from 'crypto';
import sendEmail from '../utils/sendMail.js';

//=========================================================================
// Create an account
//=========================================================================
export const createAccount = async (req, res, next) => {
  const { name, email, password, phone, image, role, agree } = req.body;
  try {
    const user = await User.findOne({ email: email });

    // If user does not exist in the data base, ....
    if (user) {
      return next(
        createError(400, 'Email has been taken! Please Try another one')
      );
    }

    // If user does not exist in the database, ....
    const newUser = new User({
      name: name,
      email: email,
      password: password,
      phone: phone,
      image: image,
      role: role,
      agree: agree,
    });

    // Save user in the database
    try {
      await newUser.save();
    } catch (error) {
      return next(createError(500, 'User could not be saved'));
    }

    // generate user token
    const userRegisterToken = userToken(newUser._id);

    return res
      .cookie('user_token', userRegisterToken, {
        path: '/',
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 60 * 1000),
        sameSite: 'none',
        secure: true,
      })
      .status(201)
      .json({ success: true, user: newUser });
  } catch (error) {
    console.log(error);
    next(createError(500, 'User could not sign up. Please try again!'));
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
        .cookie('user_token', googleLoginToken, {
          path: '/',
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 3600),
          sameSite: 'none',
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
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        image: req.body.image,
        agree: req.body.agree,
      });
      console.log('new User', newUser);

      try {
        await newUser.save();
      } catch (error) {
        next(createError(500, 'User could not save!'));
      }

      const googleLoginSignup = userToken(newUser._id);
      const { password, role, ...otherDetails } = newUser._doc;

      return res
        .cookie('user_token', googleLoginSignup, {
          path: '/',
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 3600),
          sameSite: 'none',
          secure: true,
        })
        .status(200)
        .json({ success: true, user: otherDetails });
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'User could not sign up or login using google!'));
  }
};

//=========================================================================
// Login user
//=========================================================================

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });

    // If user does not exist in the database, then ....
    if (!user) {
      return next(
        createError(400, 'This email does not exist! Please sign up!')
      );
    }

    // If user exist in the database, then check password validity
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(createError(400, 'Invalid password! Please sign up!'));
    }

    if (user && isPasswordValid) {
      const { token, password, ...rest } = user._doc;

      // generate user token
      const loginToken = userToken(user._id);

      return res
        .cookie('user_token', loginToken, {
          path: '/',
          httpOnly: true,
          expires: new Date(Date.now() + 60 * 60 * 1000),
          sameSite: 'none',
          secure: true,
        })
        .status(200)
        .json({ success: true, user });
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'User could not login. Please try again!'));
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
      res.status(404).send('User email does not exist! Please try again!');
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

    const subject = 'Password Reset Request';
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
        message: 'Reset password link has been sent to the your email',
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpires = undefined;
      user.save({ validateBeforeSave: false });
      console.log(error);
      return next(createError(500, 'Error sending password reset email!'));
    }
  } catch (error) {
    console.log(error);
    return next(createError(500, 'Forgotten password not reset!'));
  }
};

//=========================================================================
// Reset forgot password
//=========================================================================

export const resetForgotPassword = async (req, res, next) => {
  const token = req.params.token;
  // Since the token is encrypted in the database, we need to encrypt this token as well
  const encryptedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  try {
    // First find the user who wants to reset password from the database using passwordResetToken. Then, check whether the password reset token is expired or not
    const user = await User.findOne({
      passwordResetToken: encryptedToken,
      passwordResetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).send('Token is invalid or it is expired!');
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
      .cookie('user_token', loginToken, {
        path: '/',
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 60 * 1000),
        sameSite: 'none',
        secure: true,
      })
      .status(200)
      .json({ success: true, user: rest });
  } catch (error) {
    next(
      createError(500, 'The password has not been reset! Please try again!')
    );
  }
};

//=========================================================================
// Logout user
//=========================================================================

export const userLogout = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      next(createError(400, 'User not found!'));
    }

    // First Option to log out a user
    res.clearCookie('user_token');
    res.status(200).json(`You have successfully logged out`);

    // Second option to log out a user:
    /** 
    res.cookie('user_token', null, {
      httpOnly: true,
      expires: new Date(0), // cookie is expired
      sameSite: 'none',
      secure: true,
    });
   res.status(200).json(`${user.name} has successfully logged out`);
    */
  } catch (error) {
    next(createError(500, 'User could not logout. Please try again!'));
  }
};

//=========================================================================
// Update user profile
//=========================================================================

export const updateUserProfile = async (req, res, next) => {
  try {
    const { name, email, password, phone, image } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(createError(400, 'User not found'));
    }

    // If user exist in the database, check password validity
    const isPasswordValid = bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return next(createError(400, 'Invalid password'));
    }

    // Update user data
    user.name = name;
    user.email = email;
    user.phoneNumber = phone;
    user.image = image;

    // Save user in the database
    try {
      await user.save();
    } catch (error) {
      return next(createError(500, 'User could not be saved'));
    }

    return res.status(201).json({ success: true, update: user });
  } catch (error) {
    console.log(error);
    next(createError(500, 'User account could not update! Please try again!'));
  }
};

//=========================================================================
// Change user password
//=========================================================================

export const changeUserPassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('+password');

    if (!user) {
      return next(createError(400, 'User not found'));
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    );
    if (!isPasswordValid) {
      return next(createError(400, 'Invalid old password! Please try again!'));
    }

    user.password = req.body.newPassword;

    await user.save();

    res.status(200).json('Password updated successfully!');
  } catch (error) {
    console.log(error);
    next(createError(500, 'User password could not update! Please try again!'));
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

      res.clearCookie('user_token');
      res.status(200).json(`User has been successfully deleted!`);
    } else {
      return next(createError(404, 'User not found!'));
    }
  } catch (error) {
    return next(
      createError(500, 'User could not delete account. Please try again!')
    );
  }
};
