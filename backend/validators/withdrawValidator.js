import { check } from 'express-validator';

const withdrawValidator = () => {
  return [
    check('amount')
      .notEmpty()
      .trim()
      .escape()
      .isNumeric()
      .withMessage('Enter valid amount of money to be withdrawed!'),
  ];
};

export default withdrawValidator;
