import { check } from 'express-validator';

const shopRegisterValidator = () => {
  return [
    check('name')
      .escape()
      .isLength({ min: 2, max: 50 })
      .trim()
      .notEmpty()
      .withMessage('Shop name must be between 2 and 50 characters'),

    check('email').isEmail().normalizeEmail().withMessage('Email is not valid'),

    check('password')
      .trim()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character'
      ),

    check('phoneNumber')
      .trim()
      .escape()
      .isNumeric()
      .withMessage('Enter valid phone number'),

    check('description')
      .notEmpty()
      .escape()
      .isLength({ min: 200, max: 1000 })
      .trim()
      .withMessage('Name must be between 200 and 1000 characters'),

    check('shopAddress')
      .notEmpty()
      .trim()
      .escape()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),

    check('image').notEmpty(),
    check('agree').custom((input) => {
      if (input === false) {
        throw new Error(
          'Confirm your consent with the given terms and conditions!'
        );
      }
      return true;
    }),
  ];
};

export default shopRegisterValidator;
