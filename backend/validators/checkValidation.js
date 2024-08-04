import createError from 'http-errors';
import { validationResult } from 'express-validator';

const checkValidation = (req, res, next) => {
  const errors = validationResult(req);

  console.log(errors);

  if (!errors.isEmpty()) {
    const foundErrors = errors.array();
    let errorMessage = '';

    // Loop through all errors and concatenate them into one string that can be displayed to the user
    foundErrors.forEach((error, index) => {
      index !== foundErrors.length - 1
        ? (errorMessage += error.msg + '\n ')
        : (errorMessage += error.msg);
    });

    // Send error response to frontend via error handling middleware
    return next(createError(401, errorMessage));
  }

  next();
};

export default checkValidation;
