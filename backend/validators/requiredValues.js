import { check } from 'express-validator';

// Function to validate the required fields for all forms in the frontend

const requiredValues = (props) => {
  let requiredFields = [];
  props.forEach((field) => {
    requiredFields.push(check(field).notEmpty().withMessage(`${field} is required`));
  });

  return requiredFields;
};
export default requiredValues;
