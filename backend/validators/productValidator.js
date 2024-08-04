import { check } from 'express-validator';

const productValidator = () => {
  return [
    check('name')
      .escape()
      .isLength({ min: 2, max: 50 })
      .trim()
      .withMessage('Product name must be between 2 and 50 characters'),

    check('description')
      .notEmpty()
      .escape()
      .trim()
      .isLength({ min: 200, max: 1000 })
      .withMessage(
        'Product description must be between 200 and 1000 characters'
      ),

    check('category')
      .escape()
      .isLength({ min: 2, max: 50 })
      .trim()
      .withMessage('Name must be between 2 and 50 characters'),

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

export default productValidator;
