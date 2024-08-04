import createError from 'http-errors';
import { FooterData } from '../data/footer.js';

// Footer Data
export const getFooterData = async (req, res, next) => {
  try {
    const data = FooterData;
    if (!data) {
      return next(createError(400, 'Footer data does not exist!'));
    }

    res.status(200).json({ success: true, footerInfo: data });
  } catch (error) {
    return next(
      createError(500, 'Footer data could not be accessed! Please try again!')
    );
  }
};
