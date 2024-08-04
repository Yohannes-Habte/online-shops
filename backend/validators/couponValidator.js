import { check } from 'express-validator';

const couponValidator = () => {
  return [
    check('name')
      .escape()
      .isLength({ min: 2, max: 50 })
      .trim()
      .withMessage('Coupon name must be between 2 and 50 characters'),

    check('percent')
      .isNumeric()
      .isFloat({ min: 10, max: 50 })
      .trim()
      .escape()
      .withMessage('Percent must be between 10 and 50!'),

    check('minAmount')
      .isNumeric()
      .isFloat({ min: 10 })
      .trim()
      .escape()
      .withMessage('Minimum amount must be at least 10!'),

    check('maxAmount')
      .isNumeric()
      .isFloat({ max: 50 })
      .trim()
      .escape()
      .withMessage('Maximum amount must be at most 50!'),
  ];
};

export default couponValidator;
