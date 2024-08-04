import { check } from 'express-validator';

const eventValidator = () => {
  return [
    check('name')
      .notEmpty()
      .escape()
      .isLength({ min: 2, max: 50 })
      .trim()
      .withMessage('Event name must be between 2 and 50 characters'),

    check('description')
      .notEmpty()
      .escape()
      .isLength({ min: 200, max: 1000 })
      .trim()
      .withMessage('Event description must be between 200 and 1000 characters'),

    check('category')
      .notEmpty()
      .escape()
      .isLength({ min: 2, max: 50 })
      .trim()
      .withMessage('Name must be between 2 and 50 characters'),

    check('startDate')
      .toDate()
      .isISO8601('yyyy-mm-dd')
      .withMessage('Start date must be in correct format yyyy:mm:dd hh:mm:ss'),

    check('endDate')
      .toDate()
      .isISO8601('yyyy-mm-dd')
      .withMessage('End date must be in correct format yyyy:mm:dd hh:mm:ss'),

    check('originalPrice')
      .isNumeric()
      .isFloat({ min: 50, max: 1500 })
      .trim()
      .escape()
      .withMessage('Original price must be between 50 and 1500!'),

    check('discountPrice')
      .isNumeric()
      .isFloat({ min: 50, max: 1000 })
      .trim()
      .escape()
      .withMessage('Discounted price must be between 50 and 1000!'),

    check('stock')
      .isNumeric()
      .isFloat({ min: 1, max: 50 })
      .trim()
      .escape()
      .withMessage('Stack must be between 1 and 50!'),

    check('images').notEmpty(),
  ];
};

export default eventValidator;
