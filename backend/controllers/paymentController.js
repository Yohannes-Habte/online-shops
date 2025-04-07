import Stripe from "stripe";
import createError from "http-errors";

//==========================================================================================
// Stripe payment
//==========================================================================================

const allowedCurrencies = ["USD", "EUR", "GBP", "INR", "JPY", "AUD"];

export const postStripe = async (req, res, next) => {
  try {
    const { amount, currency } = req.body;
    if (!amount || amount <= 0 || isNaN(amount)) {
      return next(createError(400, "Invalid payment amount."));
    }

    if (!currency || !allowedCurrencies.includes(currency.toUpperCase())) {
      return next(createError(400, "Invalid or unsupported currency."));
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return next(createError(500, "Stripe Secret Key is not set."));
    }

    const stripe = new Stripe(stripeSecretKey);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency.toUpperCase(),
      metadata: {
        company: "LisaConsult",
      },
    });

    res.status(200).json({
      success: true,
      client_secret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe Payment Error:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while processing the payment." });
  }
};

//==========================================================================================
// Stripe payment
//==========================================================================================
export const getStripe = async (req, res, next) => {
  try {
    const stripeApiKey = process.env.STRIPE_API_KEY;
    if (!stripeApiKey) {
      return next(createError(400, "Stripe API Key not found!"));
    }

    res.status(200).json({ stripeApiKey });
  } catch (error) {
    console.error("Error retrieving Stripe API Key:", error.message);
    next(createError(500, "Unable to access feedback from Stripe payment."));
  }
};
