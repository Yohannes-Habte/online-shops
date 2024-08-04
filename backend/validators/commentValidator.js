import { check } from 'express-validator';

const commentValidator = () => {
  return [
    check('firstName')
      .notEmpty()
      .trim()
      .escape()
      .isLength({ min: 2, max: 15 })
      .withMessage('First name must be between 2 and 15 characters'),

    check('lastName')
      .notEmpty()
      .trim()
      .escape()
      .isLength({ min: 2, max: 15 })
      .withMessage('Last name must be between 2 and 15 characters'),

    check('message')
      .notEmpty()
      .trim()
      .escape()
      .isLength({ min: 50, max: 500 })
      .withMessage('Text message should be between 50 and 500 characters'),
  ];
};

export default commentValidator;
