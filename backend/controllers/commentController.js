import Comment from '../models/commentModel.js';
import createError from 'http-errors';
import User from '../models/userModel.js';

// ================================================================
// Create new comment
// ================================================================
export const createComment = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return next(createError(400, 'User does not exist! Please login!'));
    }

    const comment = new Comment(req.body);

    user.comments = [...user.comments, comment];

    // Save user after the comment is added in the database
    try {
      await user.save();
    } catch (error) {
      return next(createError(500, 'Comment could not be saved'));
    }

    // Save comment in the database
    try {
      await comment.save();
    } catch (error) {
      return next(createError(500, 'Comment could not be saved'));
    }

    res.status(201).json({ success: true, comment });
  } catch (error) {
    console.log(error);
    next(createError(500, 'Comment is not created! Please try again!'));
  }
};
