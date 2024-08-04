import Stripe from 'stripe';
import createError from 'http-errors';

//==========================================================================================
// Stripe payment
//==========================================================================================
export const postStripe = async (req, res, next) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: 'EUR',
      metadata: {
        company: 'LisaConsult',
      },
    });
    res.status(200).json({
      success: true,
      client_secret: myPayment.client_secret,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

//==========================================================================================
// Stripe payment
//==========================================================================================
export const getStripe = async (req, res, next) => {
  try {
    const stripeApikey = process.env.STRIPE_API_KEY;
    if (!stripeApikey) {
      return next(createError(400, 'Stripe API Key not found!'));
    }
    res.status(200).json({ stripeApikey: stripeApikey });
  } catch (error) {
    next(
      createError(500, 'Feedback could not be accessed from stripe payment')
    );
  }
};
